import React, { useState, useCallback, memo } from "react";
import { Heart, Share, Star } from "lucide-react";
import { listing } from "../data";
import { useApp } from "../context/AppContext";

const TitleRow = memo(function TitleRow() {
  const { showToast, toggleSaveListing, isListingSaved } = useApp();
  const saved = isListingSaved(listing.title);

  const handleShare = useCallback(() => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        showToast("Link copied to clipboard!");
      })
      .catch(() => {
        alert("Copy link to clipboard: " + window.location.href);
      });
  }, [showToast]);

  const handleSave = useCallback(() => {
    toggleSaveListing(listing);
  }, [toggleSaveListing]);

  return (
    <div className="_nqOILr select-none">
      <h1 className="_XtZJrm">
        {listing.title}
      </h1>
      <div className="_MIbhFG">
        <button
          type="button"
          onClick={handleShare}
          className="_lXWmLq"
          aria-label="Share this listing"
        >
          <span className="_ffLphr">
            <Share className="h-4 w-4" aria-hidden="true" strokeWidth={2} />
          </span>
          <span className="_lBQzRQ">Share</span>
        </button>
        <button
          type="button"
          onClick={handleSave}
          className={`_lXWmLq ${saved ? "_RxcXJB" : ""}`}
          aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
          aria-pressed={saved}
        >
          <span className="_ffLphr">
            <Heart
              className={`h-4 w-4 transition-transform duration-200 ${
                saved ? "fill-primary text-primary scale-110" : ""
              }`}
              aria-hidden="true"
              strokeWidth={2}
            />
          </span>
          <span className="_lBQzRQ">
            {saved ? "Saved" : "Save"}
          </span>
        </button>
      </div>
    </div>
  );
});

export default TitleRow;
