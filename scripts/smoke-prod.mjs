const BASE_URL = process.env.REPLYMINT_BASE_URL || "https://reddit-ai-reply-website.vercel.app";
const TEST_EXTENSION_KEY = process.env.REPLYMINT_TEST_EXTENSION_KEY || "";

async function fetchJson(url, options) {
  const response = await fetchWithRetry(url, options);
  let json = {};
  try {
    json = await response.json();
  } catch {
    // ignore non-json payloads
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
      const delay = 500 * i;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw lastError || new Error(`fetch failed: ${url}`);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function main() {
  console.log(`Smoke target: ${BASE_URL}`);

  const home = await fetchWithRetry(BASE_URL, { redirect: "follow" });
  assert(home.ok, `Home not reachable: ${home.status}`);
  console.log(`OK home ${home.status}`);

  const { response: healthRes, json: health } = await fetchJson(`${BASE_URL}/api/health`);
  assert(healthRes.ok, `Health endpoint failed: ${healthRes.status}`);
  assert(health.ok === true, "Health payload missing ok=true");
  assert(health.env?.hasOpenAiApiKey, "OPENAI_API_KEY missing in production env");
  console.log("OK /api/health");

  if (TEST_EXTENSION_KEY) {
    const { response: aiRes, json: ai } = await fetchJson(`${BASE_URL}/api/ai/reply`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Extension-Key": TEST_EXTENSION_KEY,
      },
      body: JSON.stringify({
        postContent: "Smoke test prompt for ReplyMint",
        parentComment: "Please provide a concise response",
        language: "en",
        bio: "SaaS founder",
      }),
    });

    if (aiRes.status === 200) {
      const keys = Object.keys(ai.replies || {});
      assert(keys.includes("friendly") && keys.includes("professional") && keys.includes("humorous"), "Invalid AI response shape");
      console.log("OK /api/ai/reply paid path");
    } else if (aiRes.status === 402) {
      console.log("WARN /api/ai/reply returned 402 (non-paid test key)");
    } else {
      throw new Error(`/api/ai/reply failed: ${aiRes.status} ${JSON.stringify(ai)}`);
    }
  } else {
    console.log("SKIP /api/ai/reply (REPLYMINT_TEST_EXTENSION_KEY not set)");
  }

  console.log("Smoke passed");
}

main().catch((error) => {
  console.error("Smoke failed:", error.message);
  process.exit(1);
});
