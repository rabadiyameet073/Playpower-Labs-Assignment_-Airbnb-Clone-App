import React, { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "text" | "secondary";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-semibold transition-all duration-200 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 select-none active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100",
          {
            // Primary gradient reserve button style
            "bg-gradient-cta text-white rounded-lg hover:brightness-[0.92]": variant === "primary",
            // Outline border button style
            "border border-foreground bg-background text-foreground rounded-lg hover:bg-secondary": variant === "outline",
            // Ghost gray secondary style
            "bg-secondary text-foreground rounded-full hover:bg-neutral-200": variant === "secondary",
            // Text only style
            "bg-transparent text-foreground underline underline-offset-2 p-0 rounded-none hover:text-muted-foreground active:scale-100": variant === "text",
          },
          {
            "px-4 py-2 text-sm": size === "sm",
            "px-6 py-3.5 text-base": size === "md",
            "px-8 py-4.5 text-lg": size === "lg",
            "p-0": variant === "text",
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
