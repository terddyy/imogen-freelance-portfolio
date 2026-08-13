/** Shared rate-limit tiers (10-minute windows unless noted). */
export const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

/** Edge middleware: blocks API floods before serverless handlers run. */
export const API_FLOOD_MAX = 30;

/** Per-visitor inquiry submissions. */
export const INQUIRY_RATE_LIMIT_MAX = 5;

/** Site-wide inquiry cap to limit SMS/email cost abuse. */
export const GLOBAL_INQUIRY_RATE_LIMIT_MAX = 25;
