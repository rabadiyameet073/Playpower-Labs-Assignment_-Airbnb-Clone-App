import { useEffect } from "react";

export function useBodyScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;

    // Save original overflow style
    const originalStyle = window.getComputedStyle(document.body).overflow;
    
    // Lock scroll
    document.body.style.overflow = "hidden";

    return () => {
      // Restore original overflow style
      document.body.style.overflow = originalStyle;
    };
  }, [active]);
}
