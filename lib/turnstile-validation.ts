export const TURNSTILE_ACTION = "project-inquiry";

export type TurnstileResult = {
  success?: boolean;
  action?: string;
  hostname?: string;
};

export function isValidTurnstileResult(result: TurnstileResult, allowedHostnames: Set<string>) {
  return (
    result.success === true &&
    result.action === TURNSTILE_ACTION &&
    typeof result.hostname === "string" &&
    allowedHostnames.has(result.hostname)
  );
}
