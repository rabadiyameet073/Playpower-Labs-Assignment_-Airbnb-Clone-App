import React, { useRef, memo, useState, useMemo, useCallback } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { Star, X, ChevronRight, Sparkles, CheckCircle, Key, MessageSquare, Map, Tag } from "lucide-react";
import { listing, reviews } from "../data";
import { useApp } from "../context/AppContext";
import { useFocusTrap } from "../hooks/useFocusTrap";
import { useBodyScrollLock } from "../hooks/useBodyScrollLock";
import { Review } from "../types";

// Import custom assets
import laurelLeft from "../assets/image1_files/laurel-left.png";
import laurelRight from "../assets/image1_files/laurel-right.png";

import comfortIcon from "../assets/image1_files/comfort.png";
import accuracyIcon from "../assets/image1_files/accuracy.png";
import hotTubIcon from "../assets/image1_files/hot-tub.png";
import conditionIcon from "../assets/image1_files/condition.png";
import hospitalityIcon from "../assets/image1_files/hospitality.png";
import cleanlinessIcon from "../assets/image1_files/cleanliness.png";
import amenitiesIcon from "../assets/image1_files/amenities.png";
import decorIcon from "../assets/image1_files/decor.png";
import indoorSpacesIcon from "../assets/image1_files/indoor-spaces.png";
import locationIcon from "../assets/image1_files/location.png";

const StarRating = memo(function StarRating({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <span className="flex gap-0.5" aria-label={`Rated ${value} out of ${max} stars`}>
      {Array.from({ length: max }, (_, i) => (
        <Star
          key={i}
          className={`h-3 w-3 ${
            i < Math.round(value)
              ? "fill-primary text-primary"
              : "fill-transparent text-border stroke-border"
          }`}
          aria-hidden="true"
        />
      ))}
    </span>
  );
});

const ReviewCard = memo(function ReviewCard({ review, compact = false }: { review: Review; compact?: boolean }) {
  const { setReviewsOpen } = useApp();
  const [isExpanded, setIsExpanded] = React.useState(false);

  const yearsText = review.yearsOnPlatform === 0 
    ? "2 months" 
    : review.yearsOnPlatform === 0.7 
    ? "8 months" 
    : `${review.yearsOnPlatform} year${review.yearsOnPlatform !== 1 ? "s" : ""}`;

  const isLongText = review.text.length > 180;

  const handleShowMore = () => {
    if (compact) {
      setReviewsOpen(true);
    } else {
      setIsExpanded(true);
    }
  };

  return (
    <li className={`flex flex-col gap-3 ${compact ? "" : "border-b border-border pb-8 last:border-b-0 last:pb-0"}`}>
      <div className="flex items-center gap-3">
        {review.avatar ? (
          <img
            src={review.avatar}
            alt={review.name}
            className="h-11 w-11 shrink-0 rounded-full object-cover select-none"
          />
        ) : (
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white select-none"
            style={{ backgroundColor: review.avatarColor }}
            aria-hidden="true"
          >
            {review.name[0].toUpperCase()}
          </span>
        )}
        <div>
          <p className="text-sm font-semibold text-foreground">{review.name}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{yearsText} on Airbnb</p>
        </div>
      </div>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <StarRating value={review.rating} />
          <span className="text-xs text-muted-foreground font-semibold">{review.date}</span>
        </div>
        <div className={`_rlBwiT ${compact && isLongText && !isExpanded ? "_WGNLgB" : ""}`}>
          {review.text}
        </div>
        {compact && isLongText && !isExpanded && (
          <button
            type="button"
            className="_zwAReJ"
            onClick={handleShowMore}
          >
            Show more
          </button>
        )}
      </div>
    </li>
  );
});

const renderCategoryIcon = (label: string) => {
  switch (label) {
    case "Cleanliness":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', height: '100%', width: '100%', fill: 'currentColor' }}>
          <path d="M24 0v6h-4.3c.13 1.4.67 2.72 1.52 3.78l.2.22-1.5 1.33a9.05 9.05 0 0 1-2.2-5.08c-.83.38-1.32 1.14-1.38 2.2v4.46l4.14 4.02a5 5 0 0 1 1.5 3.09l.01.25.01.25v8.63a3 3 0 0 1-2.64 2.98l-.18.01-.21.01-12-.13A3 3 0 0 1 4 29.2L4 29.02v-8.3a5 5 0 0 1 1.38-3.45l.19-.18L10 12.9V8.85l-4.01-3.4.02-.7A5 5 0 0 1 10.78 0H11zm-5.03 25.69a8.98 8.98 0 0 1-6.13-2.41l-.23-.23A6.97 6.97 0 0 0 6 21.2v7.82c0 .51.38.93.87 1H7l11.96.13h.13a1 1 0 0 0 .91-.88l.01-.12v-3.52c-.34.04-.69.06-1.03.06zM17.67 2H11a3 3 0 0 0-2.92 2.3l-.04.18-.01.08 3.67 3.1h2.72l.02-.1a4.29 4.29 0 0 1 3.23-3.4zM30 4a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm-3-2a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm-5 0h-2.33v2H22zm8-2a1 1 0 1 1 0 2 1 1 0 0 1 0-2zM20 20.52a3 3 0 0 0-.77-2l-.14-.15-4.76-4.61v-4.1H12v4.1l-5.06 4.78a3 3 0 0 0-.45.53 9.03 9.03 0 0 1 7.3 2.34l.23.23A6.98 6.98 0 0 0 20 23.6z"></path>
        </svg>
      );
    case "Accuracy":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', height: '100%', width: '100%', fill: 'currentColor' }}>
          <path d="M16 1a15 15 0 1 1 0 30 15 15 0 0 1 0-30zm0 2a13 13 0 1 0 0 26 13 13 0 0 0 0-26zm7 7.59L24.41 12 13.5 22.91 7.59 17 9 15.59l4.5 4.5z"></path>
        </svg>
      );
    case "Check-in":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', height: '100%', width: '100%', fill: 'currentColor' }}>
          <path d="M16.84 27.16v-3.4l-.26.09c-.98.32-2.03.51-3.11.55h-.7A11.34 11.34 0 0 1 1.72 13.36v-.59A11.34 11.34 0 0 1 12.77 1.72h.59c6.03.16 10.89 5.02 11.04 11.05V13.45a11.3 11.3 0 0 1-.9 4.04l-.13.3 7.91 7.9v5.6H25.7l-4.13-4.13zM10.31 7.22a3.1 3.1 0 1 1 0 6.19 3.1 3.1 0 0 1 0-6.2zm0 2.06a1.03 1.03 0 1 0 0 2.06 1.03 1.03 0 0 0 0-2.06zM22.43 25.1l4.12 4.13h2.67v-2.67l-8.37-8.37.37-.68.16-.3c.56-1.15.9-2.42.96-3.77v-.64a9.28 9.28 0 0 0-9-9h-.55a9.28 9.28 0 0 0-9 9v.54a9.28 9.28 0 0 0 13.3 8.1l.3-.16 1.52-.8v4.62z"></path>
        </svg>
      );
    case "Communication":
      return (
        <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', height: '100%', width: '100%', fill: 'none', stroke: 'currentColor', strokeWidth: 2, overflow: 'visible' }}>
          <path d="m25.5 3.5c2.2091 0 4 1.79086 4 4v13.8333c0 2.2092-1.7909 4-4 4h-5.8192l-3.6808 4.5-3.6832-4.5h-5.8168c-2.20914 0-4-1.7908-4-4v-13.8333c0-2.20914 1.79086-4 4-4z" fill="none"></path>
        </svg>
      );
    case "Location":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', height: '100%', width: '100%', fill: 'currentColor' }}>
          <path d="M30.95 3.81a2 2 0 0 0-2.38-1.52l-7.58 1.69-10-2-8.42 1.87A1.99 1.99 0 0 0 1 5.8v21.95a1.96 1.96 0 0 0 .05.44 2 2 0 0 0 2.38 1.52l7.58-1.69 10 2 8.42-1.87A1.99 1.99 0 0 0 31 26.2V4.25a1.99 1.99 0 0 0-.05-.44zM12 4.22l8 1.6v21.96l-8-1.6zM3 27.75V5.8l-.22-.97.22.97 7-1.55V26.2zm26-1.55-7 1.55V5.8l7-1.55z"></path>
        </svg>
      );
    case "Value":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', height: '100%', width: '100%', fill: 'currentColor' }}>
          <path d="M16.17 2a3 3 0 0 1 1.98.74l.14.14 11 11a3 3 0 0 1 .14 4.1l-.14.14L18.12 29.3a3 3 0 0 1-4.1.14l-.14-.14-11-11A3 3 0 0 1 2 16.37l-.01-.2V5a3 3 0 0 1 2.82-3h11.35zm0 2H5a1 1 0 0 0-1 .88v11.29a1 1 0 0 0 .2.61l.1.1 11 11a1 1 0 0 0 1.31.08l.1-.08L27.88 16.7a1 1 0 0 0 .08-1.32l-.08-.1-11-11a1 1 0 0 0-.58-.28L16.17 4zM9 6a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm0 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"></path>
        </svg>
      );
    default:
      return null;
  }
};

const ReviewsSection = memo(function ReviewsSection() {
  const { reviewsOpen, setReviewsOpen } = useApp();
  const panelRef = useRef<HTMLDivElement>(null);
  
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Lock body scroll and trap focus when modal is open
  useBodyScrollLock(reviewsOpen);
  useFocusTrap(panelRef, reviewsOpen);

  const overallRatingBars = [
    { star: 5, width: "95%" },
    { star: 4, width: "5%" },
    { star: 3, width: "0%" },
    { star: 2, width: "0%" },
    { star: 1, width: "0%" },
  ];

  const subRatingPills = useMemo(() => {
    const counts: Record<string, number> = {};
    reviews.forEach((r) => {
      r.tags?.forEach((tag) => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });

    const pills = [
      { label: "Comfort", icon: comfortIcon },
      { label: "Accuracy", icon: accuracyIcon },
      { label: "Hot tub", icon: hotTubIcon },
      { label: "Condition", icon: conditionIcon },
      { label: "Hospitality", icon: hospitalityIcon },
      { label: "Cleanliness", icon: cleanlinessIcon },
      { label: "Amenities", icon: amenitiesIcon },
      { label: "Decor", icon: decorIcon },
      { label: "Indoor spaces", icon: indoorSpacesIcon },
      { label: "Location", icon: locationIcon },
    ];

    return pills.map((p) => ({
      ...p,
      count: counts[p.label] || 0,
    }));
  }, []);

  const filteredReviews = useMemo(() => {
    if (!selectedTag) return reviews;
    return reviews.filter((r) => r.tags?.includes(selectedTag));
  }, [selectedTag]);

  const visibleReviews = useMemo(() => {
    if (selectedTag) return filteredReviews;
    return filteredReviews.slice(0, 6);
  }, [filteredReviews, selectedTag]);

  const handleTagClick = useCallback((tag: string) => {
    setSelectedTag((prev) => (prev === tag ? null : tag));
  }, []);

  return (
    <section aria-labelledby="reviews-heading" className="_AIFnOW" id="reviews">
      <div className="_VbWVER">
        <div className="_BPBwHJ">
          <img src={laurelLeft} alt="" />
          <div className="_ceuCIZ">4.95</div>
          <img src={laurelRight} alt="" />
        </div>
        <div className="_VWzNrR">Guest favourite</div>
        <div className="_vnmuLP">
          This home is a guest favourite based on ratings, reviews and reliability
        </div>
        <button className="_bphONg" type="button" onClick={() => setReviewsOpen(true)}>
          How reviews work
        </button>
      </div>

      {/* Categories Summary Grid */}
      <div className="_IRzoii">
        {/* Overall rating bar chart column */}
        <div className="_NADHQP">
          <div className="_HMnqoH">Overall rating</div>
          <div className="_uKBFwH">
            {overallRatingBars.map((bar) => (
              <div key={bar.star} className="_eGEGJX">
                <span className="_zQuixH">{bar.star}</span>
                <div className="_jpDJSE">
                  <div className="_ysmTju" style={{ width: bar.width }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6 Category Rating Columns */}
        {listing.categoryRatings.map((cat) => (
          <div key={cat.label} className="_NADHQP">
            <div className="_HMnqoH">{cat.label}</div>
            <div className="_hTqLOj">{cat.value.toFixed(1)}</div>
            <div className="ico">
              {renderCategoryIcon(cat.label)}
            </div>
          </div>
        ))}
      </div>

      {/* Sub-rating Pills Row */}
      <div className="_riglmZ">
        {subRatingPills.map((pill) => (
          <button
            key={pill.label}
            type="button"
            className={`_SQnYKT ${selectedTag === pill.label ? "_active" : ""}`}
            onClick={() => handleTagClick(pill.label)}
          >
            <img src={pill.icon} alt="" className="_dBKfAU" />
            <span>{pill.label}</span>
            <span className="_iIqzkf">{pill.count}</span>
          </button>
        ))}
      </div>

      {/* Reviews grid */}
      <ul className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
        {visibleReviews.map((review) => (
          <ReviewCard key={review.id} review={review} compact />
        ))}
      </ul>

      {/* Show all reviews modal */}
      <Dialog.Root open={reviewsOpen} onOpenChange={setReviewsOpen}>
        <Dialog.Trigger asChild>
          <button
            type="button"
            className="_svzNBY mt-8"
          >
            Show all {listing.reviewCount} reviews
          </button>
        </Dialog.Trigger>
        <AnimatePresence>
          {reviewsOpen && (
            <Dialog.Portal forceMount>
              {/* Overlay backdrop */}
              <Dialog.Overlay asChild>
                <motion.div
                  key="reviews-overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 z-50 bg-overlay-scrim"
                />
              </Dialog.Overlay>
              
              {/* Content Panel */}
              <Dialog.Content asChild>
                <motion.div
                  key="reviews-panel"
                  initial={{ opacity: 0, scale: 0.97, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97, y: 16 }}
                  transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
                  ref={panelRef}
                  className="fixed inset-x-4 top-8 bottom-8 z-50 max-w-2xl mx-auto overflow-hidden rounded-2xl bg-background shadow-modal flex flex-col"
                  aria-describedby={undefined}
                >
                  <div className="flex items-center justify-between border-b border-border bg-background p-6">
                    <Dialog.Title className="text-xl font-bold text-foreground">
                      {listing.reviewCount} reviews
                    </Dialog.Title>
                    <Dialog.Close asChild>
                      <button
                        type="button"
                        className="flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-200 hover:bg-secondary focus-visible:outline-2"
                        aria-label="Close reviews"
                      >
                        <X className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </Dialog.Close>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6">
                    <ul className="flex flex-col gap-8">
                      {filteredReviews.map((review) => (
                        <ReviewCard key={review.id} review={review} />
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>
    </section>
  );
});

export default ReviewsSection;
