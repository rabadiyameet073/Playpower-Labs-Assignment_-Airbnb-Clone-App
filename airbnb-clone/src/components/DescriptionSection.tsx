import React, { useState, memo } from "react";
import { listing } from "../data";

const ORIGINAL_TEXT = `Amor de Goa — a romantic 1BHK in the heart of Candolim, Goa with a private Jacuzzi and rooftop pool. Located just minutes from Candolim Beach, this beautifully designed serviced apartment offers the perfect blend of modern luxury and Goan charm.

The apartment features a spacious bedroom with a king-size bed, a fully equipped kitchen, high-speed WiFi, air conditioning, and a private outdoor Jacuzzi for intimate evenings. Guests also have access to the building's stunning rooftop infinity pool with panoramic views.

Whether you're celebrating a special occasion or simply seeking a peaceful getaway, Amor de Goa provides an unforgettable experience with its thoughtful design, premium amenities, and prime location near restaurants, cafés, and nightlife.`;

const DescriptionSection = memo(function DescriptionSection() {
  const [expanded, setExpanded] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);

  const displayText = showOriginal ? ORIGINAL_TEXT : listing.description.join("\n\n");

  return (
    <div className="_aYmOjv">
      {/* Translation banner in grey box */}
      <div className="_Qngmmk">
        <span>
          {showOriginal ? "Showing original text. " : "Some info has been automatically translated. "}
          <button
            type="button"
            onClick={() => setShowOriginal(!showOriginal)}
            className="underline font-medium hover:text-neutral-600 bg-transparent border-none cursor-pointer p-0 text-inherit"
          >
            {showOriginal ? "Show translation" : "Show original"}
          </button>
        </span>
      </div>

      {/* Description text with fade mask when collapsed */}
      <p id="descText" className={expanded ? "" : "_WGNLgB"} style={{ whiteSpace: "pre-line" }}>
        {displayText}
      </p>

      {/* Expand/Collapse Button */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="_ywZNbX"
        id="descMore"
      >
        {expanded ? "Show less" : "Show more"}{" "}
        <span className="_lUheNd" style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
          <svg
            viewBox="0 0 18 18"
            role="presentation"
            aria-hidden="true"
            focusable="false"
            style={{ display: "block", height: "100%", width: "100%", fill: "currentColor" }}
          >
            <path
              d="m4.29 1.71a1 1 0 1 1 1.42-1.41l8 8a1 1 0 0 1 0 1.41l-8 8a1 1 0 1 1 -1.42-1.41l7.29-7.29z"
              fillRule="evenodd"
            ></path>
          </svg>
        </span>
      </button>
    </div>
  );
});

export default DescriptionSection;
