import { hasCookieConsent, setCookieConsent } from "@/lib/cookie-consent";

/** Grants necessary-cookie consent when the user agrees to send an inquiry. */
export function grantInquirySecurityConsent() {
  if (!hasCookieConsent()) {
    setCookieConsent("accepted");
  }
}
