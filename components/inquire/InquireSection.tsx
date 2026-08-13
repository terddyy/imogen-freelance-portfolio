import { InquireForm } from "@/components/inquire/InquireForm";

export function InquireSection() {
  return (
    <section
      className="relative isolate mx-auto grid w-full max-w-[720px] gap-1 px-2.5 py-0 sm:gap-2.5 sm:px-4 sm:py-2"
      aria-label="Project inquiry"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[8%_10%_20%] -z-10 hidden rounded-full bg-[radial-gradient(circle,rgba(0,255,136,0.12),transparent_68%)] blur-xl sm:block"
      />

      <div className="hidden flex-col items-center gap-1 text-center sm:flex">
        <span className="rounded-full border border-neon/40 bg-neon/[0.06] px-3 py-1 text-[11px] font-semibold tracking-wide text-white">
          Project inquiry
        </span>
        <h1 className="text-balance text-[clamp(20px,2.6vw,28px)] font-extrabold tracking-tight text-white">
          Let&apos;s scope your next build.
        </h1>
      </div>

      <InquireForm />
    </section>
  );
}
