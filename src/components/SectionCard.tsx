import type { ReactNode } from "react";

type SectionCardProps = {
  number: number;
  title: string;
  children: ReactNode;
};

export default function SectionCard({ number, title, children }: SectionCardProps) {
  return (
    <section className="section-card">
      <div className="section-heading">
        <span className="step-number">{number}</span>
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  );
}
