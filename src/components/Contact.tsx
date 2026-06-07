import { Reveal } from "@/components/Reveal";
import { MagneticButton } from "@/components/MagneticButton";
import { CopyEmail } from "@/components/CopyEmail";
import { mailtoHref } from "@/lib/site";

export function Contact() {
  return (
    <section id="contact" className="border-t border-line">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:py-32">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-mono text-xs uppercase tracking-widest text-accent">
              // contact
            </p>
            <h2 className="mt-3 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              Let&apos;s build something.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-lg leading-relaxed text-muted">
              Got an idea, a half-built product, or just a question? We read and
              reply to every email.
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <MagneticButton
                href={mailtoHref}
                className="inline-flex items-center justify-center rounded-lg bg-ink px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-accent"
              >
                Email us →
              </MagneticButton>
              <CopyEmail />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
