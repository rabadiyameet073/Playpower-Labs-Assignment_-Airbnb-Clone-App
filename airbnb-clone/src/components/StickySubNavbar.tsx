import React, { useState, useEffect, useMemo, memo } from "react";
import { listing } from "../data";
import { useApp } from "../context/AppContext";

const StickySubNavbar = memo(function StickySubNavbar() {
  const { checkIn, checkOut, claimedDiscount } = useApp();
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState("photos");

  // Calculate nights dynamically to sync with booking card
  const calculatedNights = useMemo(() => {
    if (checkIn && checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays > 0) return diffDays;
      }
    }
    return listing.nights;
  }, [checkIn, checkOut]);

  // Calculate total price dynamically to sync with booking card
  const totalPrice = useMemo(() => {
    const nightsTotal = listing.pricePerNight * calculatedNights;
    const discount = claimedDiscount ? nightsTotal * 0.1 : 0;
    return nightsTotal - discount + listing.cleaningFee + listing.serviceFee;
  }, [calculatedNights, claimedDiscount]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      // Show sticky navbar if scrolled past the photo grid section (~580px)
      setIsVisible(scrollTop > 580);

      // Section Scrollspy logic
      const sections = ["photos", "amenities", "reviews", "location"];
      let currentActive = "photos";

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          // Active threshold when the top of the section reaches near the sticky navbar height
          if (rect.top <= 120) {
            currentActive = sectionId;
          }
        }
      }
      setActiveSection(currentActive);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Trigger initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80; // height offset for the sticky sub-navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const handleReserveScroll = () => {
    const el = document.getElementById("booking-card-reserve-btn");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div
      className={`_ZltfzZ ${isVisible ? "_slbRnI" : ""}`}
      id="_ZltfzZ"
      aria-hidden={!isVisible}
    >
      <div className="_QswPPK">
        {/* Left Side: Navigation Links */}
        <nav className="_uwYJfK" aria-label="Listing sections">
          <button
            type="button"
            onClick={() => scrollToSection("photos")}
            className={activeSection === "photos" ? "_AhbiGK" : ""}
          >
            Photos
          </button>
          <button
            type="button"
            onClick={() => scrollToSection("amenities")}
            className={activeSection === "amenities" ? "_AhbiGK" : ""}
          >
            Amenities
          </button>
          <button
            type="button"
            onClick={() => scrollToSection("reviews")}
            className={activeSection === "reviews" ? "_AhbiGK" : ""}
          >
            Reviews
          </button>
          <button
            type="button"
            onClick={() => scrollToSection("location")}
            className={activeSection === "location" ? "_AhbiGK" : ""}
          >
            Location
          </button>
        </nav>

        {/* Right Side: Quick Booking Summary */}
        <div className="_UGmJLh">
          <div className="_ncZnCc">
            <div className="flex flex-col text-right">
              <div className="flex items-center gap-1 justify-end">
                {claimedDiscount && (
                  <span className="line-through text-neutral-400 font-normal text-xs mr-1">
                    {listing.currency}{(listing.pricePerNight * calculatedNights + listing.cleaningFee + listing.serviceFee).toLocaleString()}
                  </span>
                )}
                <span className="_rralkF">
                  {listing.currency}
                  {totalPrice.toLocaleString()}
                </span>
              </div>
              <span className="_hVbRBo">for {calculatedNights} night{calculatedNights !== 1 ? "s" : ""}</span>
            </div>
            <div className="_poLbZw">
              <span className="_vHjUXs" aria-hidden="true" />
              <span>
                {listing.rating} · <span className="sn-reviews">{listing.reviewCount} reviews</span>
              </span>
            </div>
          </div>
          <button
            className="_yUDphb _vhoBtL"
            type="button"
            onClick={handleReserveScroll}
          >
            Reserve
          </button>
        </div>
      </div>
    </div>
  );
});

export default StickySubNavbar;
