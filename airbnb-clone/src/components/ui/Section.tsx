import React, { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface SectionProps {
  id?: string;
  headingId?: string;
  heading?: string;
  children: ReactNode;
  className?: string;
  noBorder?: boolean;
}

export default function Section({
  id,
  headingId,
  heading,
  children,
  className,
  noBorder = false,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cn("py-8", { "border-b border-border": !noBorder }, className)}
    >
      {heading && (
        <h2 id={headingId} className="text-[22px] font-semibold leading-[1.3] text-foreground">
          {heading}
        </h2>
      )}
      <div className={cn({ "mt-4": heading })}>{children}</div>
    </section>
  );
}
