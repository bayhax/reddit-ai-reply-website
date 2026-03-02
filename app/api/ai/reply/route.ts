import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const openAiApiKey = process.env.OPENAI_API_KEY;

type Payload = {
  postContent?: string;
  parentComment?: string;
  language?: "en" | "zh" | "auto";
  bio?: string;
};

function buildPrompt(postContent: string, parentComment: string | undefined, language: string, bio: string) {
  const langInstruction = language === "zh" ? "Reply in Chinese." : "Reply in English.";
  const context = parentComment
    ? `Post/thread context:\n"""\n${postContent}\n"""\n\nComment you are replying to:\n"""\n${parentComment}\n"""`
    : `Post you are replying to:\n"""\n${postContent}\n"""`;

  const bioSection = bio
    ? `\nYour persona/background:\n"""\n${bio}\n"""\nUse this persona to inform the tone, perspective, and content of your replies. Stay in character.\n`
    : "";

  return `You are a Reddit user writing a reply. ${langInstruction}
${bioSection}
Given the following context, generate exactly 3 reply versions with different tones.

${context}

Generate 3 replies in this exact JSON format (no other text, no markdown):
{"friendly":"A warm, casual, supportive reply","professional":"A thoughtful, well-structured, insightful reply","humorous":"A witty, funny, light-hearted reply"}

Rules:
- Each reply should be 1-4 sentences
- Keep replies natural and authentic to Reddit culture
- Do not use hashtags
- Do not be sycophantic or over-the-top
- Return ONLY the JSON object, no markdown fences, no explanation`;
}

function parseAIResponse(text: string) {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const match = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (match) return JSON.parse(match[1].trim());
    const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    throw new Error("Failed to parse AI response");
  }
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, X-Extension-Key",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}

export async function POST(request: NextRequest) {
  const supabaseAdmin = getSupabaseAdmin() as any;
  if (!openAiApiKey) {
    return NextResponse.json({ error: "OPENAI_API_KEY not configured" }, { status: 500, headers: corsHeaders() });
  }

  const extensionKey = request.headers.get("x-extension-key");
  if (!extensionKey) {
    return NextResponse.json({ error: "Missing extension key" }, { status: 401, headers: corsHeaders() });
  }

  const { data: profileRaw, error: profileError } = await supabaseAdmin
    .from("user_profiles")
    .select("user_id,plan,subscription_status")
    .eq("extension_api_key", extensionKey)
    .maybeSingle();
  const profile = profileRaw as { user_id: string; plan: string; subscription_status: string } | null;

  if (profileError || !profile) {
    return NextResponse.json({ error: "Invalid extension key" }, { status: 401, headers: corsHeaders() });
  }

  const isPaid = profile.plan !== "free" && profile.subscription_status === "active";
  const usageDate = new Date().toISOString().slice(0, 10);
  if (!isPaid) {
    const { data: usageRaw } = await supabaseAdmin
      .from("reply_usage_daily")
      .select("count")
      .eq("user_id", profile.user_id)
      .eq("usage_date", usageDate)
      .maybeSingle();
    const usage = usageRaw as { count: number } | null;

    if ((usage?.count ?? 0) >= 5) {
      return NextResponse.json({ error: "Free daily limit reached (5/day)" }, { status: 402, headers: corsHeaders() });
    }
  }

  const payload = (await request.json()) as Payload;
  if (!payload.postContent) {
    return NextResponse.json({ error: "Missing postContent" }, { status: 400, headers: corsHeaders() });
  }

  const language = payload.language === "zh" ? "zh" : "en";
  const prompt = buildPrompt(payload.postContent, payload.parentComment, language, payload.bio ?? "");

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${openAiApiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that generates Reddit replies. Always respond with valid JSON only.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    return NextResponse.json(
      { error: err.error?.message ?? `OpenAI API error: ${response.status}` },
      { status: 502, headers: corsHeaders() },
    );
  }

  const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
  const content = data.choices?.[0]?.message?.content ?? "";
  const replies = parseAIResponse(content);

  if (!isPaid) {
    const { data: usageRaw } = await supabaseAdmin
      .from("reply_usage_daily")
      .select("count")
      .eq("user_id", profile.user_id)
      .eq("usage_date", usageDate)
      .maybeSingle();
    const usage = usageRaw as { count: number } | null;

    const nextCount = (usage?.count ?? 0) + 1;
    await supabaseAdmin.from("reply_usage_daily").upsert(
      {
        user_id: profile.user_id,
        usage_date: usageDate,
        count: nextCount,
      },
      { onConflict: "user_id,usage_date" },
    );
  }

  await supabaseAdmin.from("reply_history").insert({
    user_id: profile.user_id,
    mode: isPaid ? "cloud_paid" : "cloud_free",
    provider: "openai",
    post_excerpt: payload.postContent.slice(0, 1000),
    parent_excerpt: (payload.parentComment || "").slice(0, 1000),
    language,
    bio: (payload.bio || "").slice(0, 1000),
    friendly: String(replies.friendly || ""),
    professional: String(replies.professional || ""),
    humorous: String(replies.humorous || ""),
  });

  return NextResponse.json({ replies }, { headers: corsHeaders() });
}
