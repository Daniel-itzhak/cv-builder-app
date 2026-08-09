import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        aria-hidden
        className="animate-sheen absolute inset-0 bg-[linear-gradient(135deg,#0f172a_0%,#1e3a5f_42%,#0f766e_100%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(rgba(244,247,251,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(244,247,251,0.35)_1px,transparent_1px)] [background-size:56px_56px]"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/25 to-transparent"
      />

      <div className="relative z-10 flex min-h-screen flex-col text-[var(--paper)]">
        <SiteHeader />

        <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-6 pb-20 pt-10 md:px-10">
          <section className="animate-rise max-w-2xl">
            <p className="mb-5 font-[family-name:var(--font-display)] text-6xl font-extrabold tracking-tight md:text-7xl">
              Folio
            </p>
            <h1 className="animate-rise-delay text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
              Build CVs that read as clearly as you think.
            </h1>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-white/75 md:text-lg">
              Draft, version, and publish professional resumes from one focused
              workspace — structured to scale into a multi-tenant SaaS product.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/register">
                <Button className="bg-[var(--paper)] px-5 py-3 text-[var(--ink)] hover:bg-white">
                  Start free
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="secondary"
                  className="border-white/25 bg-white/10 px-5 py-3 text-white hover:bg-white/15"
                >
                  Log in
                </Button>
              </Link>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
