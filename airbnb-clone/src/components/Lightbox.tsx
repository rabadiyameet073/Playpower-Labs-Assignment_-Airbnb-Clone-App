import React, { useEffect, useState, useRef, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { photos } from "../data";
import { useFocusTrap } from "../hooks/useFocusTrap";

interface LightboxProps {
  open: boolean;
  onClose: () => void;
  initialIndex: number;
}

const FALLBACK_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='500'%3E%3Crect fill='%23222' width='800' height='500'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23666' font-size='14'%3EImage unavailable%3C/text%3E%3C/svg%3E";

export default function Lightbox({ open, onClose, initialIndex }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync index when lightbox is opened
  useEffect(() => {
    if (open) {
      setCurrentIndex(initialIndex);
    }
  }, [open, initialIndex]);

  const handlePrev = useCallback(
    (e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
    },
    []
  );

  const handleNext = useCallback(
    (e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
    },
    []
  );

  // Keyboard navigation & isolated ESC closure
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.stopPropagation();
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      }
    }

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [open, onClose, handlePrev, handleNext]);

  // Focus trapping inside Lightbox when active
  useFocusTrap(containerRef, open);

  // Preload adjacent images
  useEffect(() => {
    if (!open) return;
    const prevIdx = currentIndex === 0 ? photos.length - 1 : currentIndex - 1;
    const nextIdx = currentIndex === photos.length - 1 ? 0 : currentIndex + 1;

    const imgPrev = new Image();
    imgPrev.src = photos[prevIdx].src;

    const imgNext = new Image();
    imgNext.src = photos[nextIdx].src;
  }, [open, currentIndex]);

  if (!open) return null;

  const activePhoto = photos[currentIndex];

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col bg-black text-white select-none"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Photo viewer: ${activePhoto.room}`}
    >
      {/* Header bar */}
      <div
        className="flex items-center justify-between px-4 py-3 z-50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button — dark circle matching reference */}
        <button
          type="button"
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          aria-label="Close photo viewer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Counter — centered */}
        <div className="text-sm font-semibold tracking-wider" aria-live="polite">
          {currentIndex + 1} / {photos.length}
        </div>

        {/* Spacer for symmetry */}
        <div className="w-10" aria-hidden="true" />
      </div>

      {/* Main content area */}
      <div className="relative flex flex-1 items-center justify-between px-4 md:px-8">
        {/* Prev Arrow — dark circle with border matching reference */}
        <button
          type="button"
          onClick={handlePrev}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white border border-white/20 transition-transform hover:bg-white/20 hover:scale-105 active:scale-95 shrink-0 z-50"
          aria-label="Previous photo"
        >
          <ChevronLeft className="h-7 w-7" />
        </button>

        {/* Center Image */}
        <div
          className="flex-1 flex items-center justify-center px-4"
          onClick={(e) => e.stopPropagation()}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={activePhoto.src}
              alt={activePhoto.alt}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }}
              draggable={false}
              className="max-w-full max-h-[75vh] w-auto h-auto rounded-lg object-contain pointer-events-none"
            />
          </AnimatePresence>
        </div>

        {/* Next Arrow */}
        <button
          type="button"
          onClick={handleNext}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white border border-white/20 transition-transform hover:bg-white/20 hover:scale-105 active:scale-95 shrink-0 z-50"
          aria-label="Next photo"
        >
          <ChevronRight className="h-7 w-7" />
        </button>
      </div>

      {/* Footer caption */}
      <div
        className="py-6 text-center text-sm text-white/70 px-6 z-50"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="max-w-2xl mx-auto font-normal">
          {activePhoto.alt}
        </p>
      </div>
    </div>
  );
}
