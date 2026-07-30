import { Container } from "@/components/ui/container";

export type LegalSection = {
  heading: string;
  paragraphs: string[];
  list?: string[];
};

export function LegalPageLayout({
  title,
  updatedLabel,
  updatedDate,
  intro,
  sections,
}: {
  title: string;
  updatedLabel: string;
  updatedDate: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <section className="py-20">
      <Container className="max-w-3xl">
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {updatedLabel}: {updatedDate}
        </p>
        <p className="mt-6 text-muted-foreground">{intro}</p>

        <div className="mt-10 space-y-10">
          {sections.map((section) => (
            <div key={section.heading}>
              <h2 className="text-xl font-semibold">{section.heading}</h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
                {section.paragraphs.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
                {section.list && (
                  <ul className="list-disc space-y-1.5 pl-5">
                    {section.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
