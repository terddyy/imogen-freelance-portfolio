import Image from "next/image";
import { AnimatedSection } from "@/components/AnimatedSection";
import { aboutHighlights, contactMethods } from "@/lib/portfolio-data";

export const metadata = {
  title: "About | Imogen Inocentes",
  description: "About Imogen Inocentes, freelance web designer and digital solutions specialist.",
};

export default function AboutPage() {
  return (
    <main className="page routePage">
      <AnimatedSection>
        <section className="shell routeHero splitRouteHero">
          <div>
            <span className="sectionLabel">About Imogen</span>
            <h1>A solo freelance partner for clear, polished websites.</h1>
            <p>
              Imogen Inocentes helps turn early ideas, rough content, and placeholder assets into a
              professional web presence. The work is built around clarity first: what you do, who it is
              for, why it matters, and how someone should contact you.
            </p>
          </div>
          <div className="routeImageFrame">
            <Image
              src="/placeholders/imogen-workspace.svg"
              alt="Workspace placeholder for Imogen Inocentes"
              width={720}
              height={580}
            />
          </div>
        </section>
      </AnimatedSection>

      <AnimatedSection>
        <section className="shell routeSection">
          <div className="serviceGrid">
            {aboutHighlights.map((item) => {
              const Icon = item.icon;
              return (
                <article className="serviceCard" key={item.title}>
                  <span className="serviceIcon">
                    <Icon size={20} />
                  </span>
                  <h2>{item.title}</h2>
                  <p>{item.description}</p>
                </article>
              );
            })}
          </div>
        </section>
      </AnimatedSection>

      <AnimatedSection>
        <section className="shell finalCta">
          <div>
            <span className="sectionLabel">Work Style</span>
            <h2>Practical scope, clean delivery, honest placeholders.</h2>
            <p>
              This portfolio is prepared with safe sample content so real photos, testimonials, pricing,
              and links can be added when Imogen approves them.
            </p>
          </div>
          <div className="contactMethodStack">
            {contactMethods.map((method) => {
              const Icon = method.icon;
              return (
                <a href={method.href} key={method.label}>
                  <Icon size={17} />
                  <span>
                    <strong>{method.label}</strong>
                    <small>{method.value}</small>
                  </span>
                </a>
              );
            })}
          </div>
        </section>
      </AnimatedSection>
    </main>
  );
}
