import React, { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";
import { cn } from "../../lib/utils";

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "ghost" | "solid" | "outline";
  size?: "sm" | "md" | "lg";
}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant = "ghost", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-full transition-all select-none active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100",
          {
            "text-foreground hover:bg-secondary": variant === "ghost",
            "bg-foreground text-background hover:bg-foreground/90": variant === "solid",
            "border border-border text-foreground hover:shadow-pill": variant === "outline",
          },
          {
            "h-8 w-8": size === "sm",
            "h-10 w-10": size === "md",
            "h-12 w-12": size === "lg",
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

IconButton.displayName = "IconButton";
export default IconButton;
