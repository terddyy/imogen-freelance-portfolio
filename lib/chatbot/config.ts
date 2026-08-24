/** Cheapest xAI text model for simple chat (see xAI pricing docs). */
export const DEFAULT_XAI_CHAT_MODEL = "grok-3-mini";

export function getXaiChatModel() {
  return process.env.XAI_CHAT_MODEL?.trim() || DEFAULT_XAI_CHAT_MODEL;
}

export function getXaiApiKey() {
  return process.env.XAI_API_KEY?.trim() || "";
}

/** Cap assistant output to keep chatbot responses short and inexpensive. */
export const XAI_MAX_COMPLETION_TOKENS = 512;

/** Keep reasoning shallow on mini models to reduce hidden token spend. */
export const XAI_REASONING_EFFORT = "low" as const;

export const CHAT_MAX_MESSAGES = 20;
export const CHAT_MAX_MESSAGE_CHARS = 2_000;
export const CHAT_MAX_BODY_BYTES = 32 * 1024;

export const PORTFOLIO_CHAT_SYSTEM_PROMPT = `You are a helpful assistant on Imogen's freelance portfolio website.

Answer questions about Imogen's services, project types, process, and how to get in touch. Be concise, friendly, and professional.

If you do not know something specific about Imogen, say so and suggest using the project inquiry form or contact page instead of guessing.

Do not provide medical, legal, or financial advice. Do not invent pricing, timelines, or past client details.`;
