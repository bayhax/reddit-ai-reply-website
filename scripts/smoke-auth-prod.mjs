import { createClient } from "@supabase/supabase-js";

const BASE_URL = process.env.REPLYMINT_BASE_URL || "https://reddit-ai-reply-website.vercel.app";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function createOrUpdateSmokeUser(adminClient, email, password) {
  const { data: listData, error: listError } = await adminClient.auth.admin.listUsers({
    page: 1,
    perPage: 200,
  });
  if (listError) throw new Error(`listUsers failed: ${listError.message}`);

  const existing = (listData?.users || []).find((user) => user.email?.toLowerCase() === email.toLowerCase());
  if (existing) {
    const { error: updateError } = await adminClient.auth.admin.updateUserById(existing.id, {
      password,
      email_confirm: true,
      user_metadata: { smoke_test: true },
    });
    if (updateError) throw new Error(`updateUserById failed: ${updateError.message}`);
    return existing.id;
  }

  const { data: createData, error: createError } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { smoke_test: true },
  });
  if (createError || !createData.user) {
    throw new Error(`createUser failed: ${createError?.message || "unknown"}`);
  }
  return createData.user.id;
}

async function callApi(path, token, options = {}) {
  const response = await fetchWithRetry(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  let json = {};
  try {
    json = await response.json();
  } catch {
    // ignore
  }
  return { response, json };
}

async function fetchWithRetry(url, options, attempts = 4) {
  let lastError = null;
  for (let i = 1; i <= attempts; i += 1) {
    try {
      return await fetch(url, options);
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, i * 500));
    }
  }
  throw lastError || new Error(`fetch failed for ${url}`);
}

async function main() {
  assert(SUPABASE_URL, "Missing NEXT_PUBLIC_SUPABASE_URL");
  assert(SUPABASE_ANON_KEY, "Missing NEXT_PUBLIC_SUPABASE_ANON_KEY");
  assert(SUPABASE_SERVICE_ROLE_KEY, "Missing SUPABASE_SERVICE_ROLE_KEY");

  const suffix = Date.now().toString().slice(-8);
  const email = `smoke+${suffix}@replymint.app`;
  const password = `ReplyMint!${suffix}Aa`;

  const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const authClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const userId = await createOrUpdateSmokeUser(adminClient, email, password);
  assert(Boolean(userId), "No user id returned");

  const { data: signInData, error: signInError } = await authClient.auth.signInWithPassword({
    email,
    password,
  });
  if (signInError || !signInData.session?.access_token) {
    throw new Error(`signInWithPassword failed: ${signInError?.message || "no session"}`);
  }

  const accessToken = signInData.session.access_token;

  const me = await callApi("/api/me", accessToken);
  assert(me.response.status === 200, `/api/me expected 200, got ${me.response.status}`);

  const history = await callApi("/api/history", accessToken);
  assert(history.response.status === 200, `/api/history expected 200, got ${history.response.status}`);

  const extensionKey = await callApi("/api/extension-key", accessToken, { method: "POST" });
  assert(extensionKey.response.status === 200, `/api/extension-key expected 200, got ${extensionKey.response.status}`);
  assert(typeof extensionKey.json.extensionKey === "string" && extensionKey.json.extensionKey.length > 16, "extensionKey missing");

  const ops = await callApi("/api/metrics/ops", accessToken);
  assert(ops.response.status === 200, `/api/metrics/ops expected 200, got ${ops.response.status}`);

  console.log("Auth smoke passed");
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`User: ${email}`);
  console.log("Endpoints: /api/me /api/history /api/extension-key /api/metrics/ops");
}

main().catch((error) => {
  console.error("Auth smoke failed:", error.message);
  process.exit(1);
});
