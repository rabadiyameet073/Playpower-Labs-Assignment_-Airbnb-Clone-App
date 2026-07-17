import React, { useRef, useState, useEffect, useCallback, useMemo, memo } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Share } from "lucide-react";
import { photos } from "../data";
import { useApp } from "../context/AppContext";
import { useBodyScrollLock } from "../hooks/useBodyScrollLock";
import { useFocusTrap } from "../hooks/useFocusTrap";
import Lightbox from "./Lightbox";

const FALLBACK_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='500'%3E%3Crect fill='%23f0f0f0' width='800' height='500'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999' font-size='14'%3EImage unavailable%3C/text%3E%3C/svg%3E";

const PhotoTour = memo(function PhotoTour() {
  const {
    tourOpen,
    openPhotoTour,
    closePhotoTour,
    openLightbox,
    lightboxOpen,
    lightboxIndex,
    closeLightbox,
    tourIndex,
  } = useApp();

  const containerRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState<string>("");

  // Lock scroll on body when tour is open
  useBodyScrollLock(tourOpen);

  // Focus trapping inside the photo tour modal
  useFocusTrap(containerRef, tourOpen && !lightboxOpen);

  // Keyboard Escape key handling
  useEffect(() => {
    if (!tourOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (lightboxOpen) return;
        e.preventDefault();
        closePhotoTour();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [tourOpen, lightboxOpen, closePhotoTour]);

  // Sync URL search params with tourOpen state
  useEffect(() => {
    if (tourOpen) {
      const url = new URL(window.location.href);
      if (url.searchParams.get("modal") !== "PHOTO_TOUR_SCROLLABLE") {
        url.searchParams.set("modal", "PHOTO_TOUR_SCROLLABLE");
        window.history.pushState({}, "", url.toString());
      }
    } else {
      const url = new URL(window.location.href);
      if (url.searchParams.has("modal")) {
        url.searchParams.delete("modal");
        window.history.pushState({}, "", url.toString());
      }
    }
  }, [tourOpen]);

  // Handle browser popstate / back button and initial mount
  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      if (params.get("modal") === "PHOTO_TOUR_SCROLLABLE") {
        if (!tourOpen) {
          openPhotoTour(0);
        }
      } else {
        if (tourOpen) {
          closePhotoTour();
        }
      }
    };

    handleUrlChange(); // check on mount

    window.addEventListener("popstate", handleUrlChange);
    return () => window.removeEventListener("popstate", handleUrlChange);
  }, [tourOpen, openPhotoTour, closePhotoTour]);

  // Get unique room categories
  const categories = useMemo(() => {
    return Array.from(new Set(photos.map((p) => p.room)));
  }, [photos]);

  // Group photos by room category
  const groupedPhotos = useMemo(() => {
    const groups: { [key: string]: typeof photos } = {};
    photos.forEach((photo) => {
      if (!groups[photo.room]) {
        groups[photo.room] = [];
      }
      groups[photo.room].push(photo);
    });
    return groups;
  }, [photos]);

  // Initialize activeCategory to first category when they load
  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0]);
    }
  }, [categories, activeCategory]);

  // Scrollspy observer inside the scroll container
  useEffect(() => {
    if (!tourOpen) return;

    let scrollContainer: HTMLDivElement | null = null;
    let handleScroll: () => void;

    const timer = setTimeout(() => {
      const container = containerRef.current;
      if (!container) return;
      scrollContainer = container;

      handleScroll = () => {
        let currentActive = categories[0] || "";
        for (const cat of categories) {
          const el = container.querySelector(`[data-section="${cat}"]`);
          if (el) {
            const rect = el.getBoundingClientRect();
            // The sticky header height is approx 80px.
            // If the section top is within or above the active zone (<= 120px), mark it active.
            if (rect.top <= 120) {
              currentActive = cat;
            }
          }
        }
        setActiveCategory(currentActive);
      };

      container.addEventListener("scroll", handleScroll);
      handleScroll();
    }, 100);

    return () => {
      clearTimeout(timer);
      if (scrollContainer && handleScroll) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, [tourOpen, categories]);

  // Scroll to the selected image's section on open
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    if (tourOpen && tourIndex > 0) {
      timer = setTimeout(() => {
        const scrollContainer = containerRef.current;
        if (!scrollContainer) return;
        const imgEl = scrollContainer.querySelector(`[data-idx="${tourIndex}"]`);
        if (imgEl) {
          const containerRect = scrollContainer.getBoundingClientRect();
          const elRect = imgEl.getBoundingClientRect();
          const relativeTop = elRect.top - containerRect.top + scrollContainer.scrollTop;
          scrollContainer.scrollTo({
            top: relativeTop - 80, // Offset for sticky header
            behavior: "auto", // Instant on initial load
          });
        }
      }, 50);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [tourOpen, tourIndex]);

  // Smooth scroll container to category section
  const scrollToCategory = useCallback((cat: string) => {
    const scrollContainer = containerRef.current;
    if (!scrollContainer) return;
    const el = scrollContainer.querySelector(`[data-section="${cat}"]`);
    if (el) {
      const containerRect = scrollContainer.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      const relativeTop = elRect.top - containerRect.top + scrollContainer.scrollTop;
      scrollContainer.scrollTo({
        top: relativeTop - 80, // Offset for sticky header
        behavior: "smooth",
      });
    }
  }, []);

  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.src !== FALLBACK_IMG) {
      img.src = FALLBACK_IMG;
    }
  }, []);

  return (
    <Dialog.Root open={tourOpen} onOpenChange={(open) => !open && closePhotoTour()}>
      <AnimatePresence>
        {tourOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                key="tour-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-40 bg-white"
              />
            </Dialog.Overlay>

            <Dialog.Content asChild>
              <motion.div
                key="tour-content"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                transition={{ duration: 0.35, ease: [0.2, 0, 0, 1] }}
                ref={containerRef}
                className="fixed inset-0 z-40 flex flex-col bg-white overflow-y-auto"
                aria-describedby={undefined}
              >
                {/* Sticky Header */}
                <div className="sticky top-0 z-50 bg-white border-b border-neutral-100">
                  <div className="max-w-[1120px] w-full mx-auto px-6 md:px-12 flex items-center justify-between py-4">
                    <Dialog.Close asChild>
                      <button
                        type="button"
                        onClick={closePhotoTour}
                        className="flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-neutral-100"
                        aria-label="Back to listing page"
                      >
                        <ArrowLeft className="h-5 w-5" />
                      </button>
                    </Dialog.Close>

                    <button
                      type="button"
                      className="flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-neutral-100"
                      aria-label="Share listing"
                      onClick={() => {
                        navigator.clipboard
                          .writeText(window.location.href.split("?")[0])
                          .then(() => {})
                          .catch(() => {});
                        // Use a simple approach — create a temporary toast
                        const toast = document.createElement("div");
                        toast.textContent = "Link copied to clipboard!";
                        toast.style.cssText = "position:fixed;bottom:32px;left:50%;transform:translateX(-50%);z-index:99999;background:#222;color:#fff;padding:12px 24px;border-radius:12px;font-size:14px;box-shadow:0 4px 20px rgba(0,0,0,0.3);";
                        document.body.appendChild(toast);
                        setTimeout(() => toast.remove(), 2500);
                      }}
                    >
                      <Share className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Photo Tour Layout */}
                <div className="flex-1 flex max-w-[1120px] w-full mx-auto relative px-6 md:px-12 py-8 select-none">
                  <Dialog.Title className="sr-only">Photo Tour</Dialog.Title>

                  {/* Left sidebar: sticky room category navigation links */}
                  <div className="hidden md:block w-[240px] shrink-0 pr-8">
                    <div className="sticky top-[80px] flex flex-col">
                      <div className="text-[11px] font-semibold tracking-wider text-neutral-400 uppercase mb-4 pl-4 select-none">
                        Rooms & spaces
                      </div>
                      <div className="flex flex-col gap-1">
                        {categories.map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => scrollToCategory(cat)}
                            className={`tour-sidebar-link ${activeCategory === cat ? "active" : ""}`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right side scrollable content: categorized room photo groups */}
                  <div className="flex-1 min-w-0 flex flex-col gap-12 pb-24">
                    {categories.map((cat) => (
                      <div key={cat} data-section={cat} className="flex flex-col gap-4 border-b border-neutral-100 pb-10 last:border-0 last:pb-0">
                        <h3 className="text-[20px] font-semibold text-neutral-900 leading-[1.2] mb-1">{cat}</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {groupedPhotos[cat]?.map((photo) => {
                            const originalIndex = photos.indexOf(photo);
                            return (
                              <button
                                key={photo.src}
                                type="button"
                                data-idx={originalIndex}
                                onClick={() => openLightbox(originalIndex)}
                                className={`w-full text-left overflow-hidden rounded-lg bg-neutral-100 transition-transform duration-300 hover:scale-[1.005] active:scale-100 group ${
                                  groupedPhotos[cat].length === 1 ? "md:col-span-2" : ""
                                }`}
                                aria-label={`Open photo viewer for ${photo.room}: ${photo.alt}`}
                              >
                                <img
                                  src={photo.src}
                                  alt={photo.alt}
                                  onError={handleImageError}
                                  className="w-full h-auto object-cover aspect-[3/2] md:aspect-auto md:max-h-[60vh] mx-auto transition-transform duration-500 group-hover:scale-[1.01]"
                                />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </Dialog.Content>

            {/* Lightbox inside portal */}
            <Lightbox
              open={lightboxOpen}
              onClose={closeLightbox}
              initialIndex={lightboxIndex}
            />
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
});

export default PhotoTour;
