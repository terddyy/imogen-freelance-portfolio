import { XAI_MAX_COMPLETION_TOKENS, XAI_REASONING_EFFORT, getXaiApiKey } from "@/lib/chatbot/config";

const XAI_API_BASE = "https://api.x.ai/v1";

export type XaiChatRole = "system" | "user" | "assistant";

export type XaiChatMessage = {
  role: XaiChatRole;
  content: string;
};

type XaiChatCompletionResponse = {
  model: string;
  choices: Array<{
    message?: {
      role?: string;
      content?: string | null;
    };
    finish_reason?: string | null;
  }>;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
};

export class XaiApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "XaiApiError";
    this.status = status;
  }
}

export async function createChatCompletion(messages: XaiChatMessage[], model: string) {
  const apiKey = getXaiApiKey();
  if (!apiKey) {
    throw new Error("XAI_API_KEY is not configured.");
  }

  const response = await fetch(`${XAI_API_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    redirect: "error",
    signal: AbortSignal.timeout(60_000),
    body: JSON.stringify({
      model,
      messages,
      stream: false,
      max_completion_tokens: XAI_MAX_COMPLETION_TOKENS,
      reasoning_effort: XAI_REASONING_EFFORT,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new XaiApiError(response.status, errorBody || "xAI chat completion failed.");
  }

  const payload = (await response.json()) as XaiChatCompletionResponse;
  const content = payload.choices[0]?.message?.content?.trim();

  if (!content) {
    throw new Error("xAI returned an empty assistant message.");
  }

  return {
    model: payload.model || model,
    content,
    usage: {
      prompt_tokens: payload.usage?.prompt_tokens ?? 0,
      completion_tokens: payload.usage?.completion_tokens ?? 0,
      total_tokens: payload.usage?.total_tokens ?? 0,
    },
  };
}
