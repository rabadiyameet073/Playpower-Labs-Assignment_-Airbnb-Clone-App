import { useEffect, RefObject } from "react";

export function useFocusTrap(ref: RefObject<HTMLElement | null>, active: boolean) {
  useEffect(() => {
    if (!active || !ref.current) return;

    const element = ref.current;
    // Find all focusable elements
    const focusableSelector =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

    // Store previous focus
    const previousFocus = document.activeElement as HTMLElement | null;

    // Focus the first element inside the trap or the close button
    const focusableElements = Array.from(
      element.querySelectorAll(focusableSelector)
    ) as HTMLElement[];

    if (focusableElements.length > 0) {
      // Prioritize buttons (like Close) or check if there is an explicit close button
      const closeBtn = focusableElements.find(
        (el) =>
          el.getAttribute("aria-label")?.toLowerCase().includes("close") ||
          el.classList.contains("close")
      );
      if (closeBtn) {
        closeBtn.focus();
      } else {
        focusableElements[0].focus();
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== "Tab") return;

      const currentFocusables = Array.from(
        element.querySelectorAll(focusableSelector)
      ) as HTMLElement[];

      if (currentFocusables.length === 0) {
        e.preventDefault();
        return;
      }

      const firstElement = currentFocusables[0];
      const lastElement = currentFocusables[currentFocusables.length - 1];

      if (e.shiftKey) {
        // Shift + Tab: loop back to last element if at first element
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab: loop to first element if at last element
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }

    element.addEventListener("keydown", handleKeyDown);

    return () => {
      element.removeEventListener("keydown", handleKeyDown);
      // Restore focus to previous active element
      if (previousFocus && typeof previousFocus.focus === "function") {
        previousFocus.focus();
      }
    };
  }, [ref, active]);
}
