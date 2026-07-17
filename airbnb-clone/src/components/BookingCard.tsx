import React, { useState, useCallback, useRef, useEffect, useMemo, memo } from "react";
import { listing } from "../data";
import { useApp } from "../context/AppContext";
import CalendarPicker from "./CalendarPicker";
import discountSvg from "../assets/image1_files/discount.svg";


const BookingCard = memo(function BookingCard() {
  const {
    checkIn,
    checkOut,
    guests,
    setGuests,
    guestOpen,
    setGuestOpen,
    showToast,
    claimedDiscount,
    setClaimedDiscount,
  } = useApp();

  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const guestRef = useRef<HTMLDivElement>(null);

  // Close overlays on clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setDatePickerOpen(false);
      }
      if (guestRef.current && !guestRef.current.contains(e.target as Node)) {
        setGuestOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setGuestOpen]);

  // Calculate nights with useMemo
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

  // Memoize price calculations
  const total = useMemo(() => {
    const nightsTotal = listing.pricePerNight * calculatedNights;
    const discount = claimedDiscount ? nightsTotal * 0.1 : 0;
    return nightsTotal - discount + listing.cleaningFee + listing.serviceFee;
  }, [calculatedNights, claimedDiscount]);

  const handleReserve = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const guestDetails = `${guests.adults} Adult${guests.adults !== 1 ? "s" : ""}${guests.children > 0 ? `, ${guests.children} Child${guests.children !== 1 ? "ren" : ""}` : ""}`;
    showToast(`🎉 Reservation requested! Dates: ${checkIn || "N/A"} to ${checkOut || "N/A"} (${guestDetails})`);
  }, [checkIn, checkOut, guests, showToast]);

  const totalGuests = guests.adults + guests.children;

  const guestSummaryText = useMemo(() => {
    let text = `${totalGuests} guest${totalGuests !== 1 ? "s" : ""}`;
    if (guests.infants > 0) text += `, ${guests.infants} infant${guests.infants !== 1 ? "s" : ""}`;
    if (guests.pets > 0) text += `, ${guests.pets} pet${guests.pets !== 1 ? "s" : ""}`;
    return text;
  }, [totalGuests, guests.infants, guests.pets]);

  const handleGuestCountChange = useCallback((type: keyof typeof guests, operation: "inc" | "dec") => {
    setGuests((prev) => {
      const next = { ...prev };
      if (operation === "inc") {
        if (type === "adults" || type === "children") {
          if (prev.adults + prev.children < listing.stats.guests) {
            next[type] = prev[type] + 1;
            if (next.children > 0 && next.adults === 0) next.adults = 1;
          }
        } else {
          if (prev[type] < 5) next[type] = prev[type] + 1;
        }
      } else {
        if (type === "adults") {
          const minAdults = prev.children > 0 ? 1 : 0;
          if (prev.adults > minAdults) next.adults = prev.adults - 1;
        } else {
          if (prev[type] > 0) next[type] = prev[type] - 1;
        }
      }
      return next;
    });
  }, [setGuests]);

  const formatDateMMDDYYYY = useCallback((dateStr: string) => {
    if (!dateStr) return "Add date";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "Add date";
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const day = d.getDate().toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${month}/${day}/${year}`;
  }, []);

  const cancellationDateText = useMemo(() => {
    const defaultDate = checkIn ? new Date(checkIn) : new Date("2026-10-18");
    if (!isNaN(defaultDate.getTime())) {
      const cancelDate = new Date(defaultDate);
      cancelDate.setDate(defaultDate.getDate() - 1);
      const day = cancelDate.getDate();
      const monthName = cancelDate.toLocaleString("en-US", { month: "long" });
      return `${day} ${monthName}`;
    }
    return "17 October";
  }, [checkIn]);

  return (
    <div ref={cardRef} className="flex flex-col gap-0 select-none">
      {/* 1. Top discount banner */}
      <div className="_kDefVU">
        <img src={discountSvg} alt="" className="_WGtRPa" aria-hidden="true" />
        <div className="_uXBIIR">
          Get 10% off your next stay.
          <br />
          <a href="#" onClick={(e) => { e.preventDefault(); showToast("Discount terms: Valid for stays of 3+ nights, booked within 30 days. Cannot be combined with other offers."); }}>Terms apply</a>
        </div>
        <button
          type="button"
          className="_dUZzqb"
          onClick={() => {
            if (!claimedDiscount) {
              setClaimedDiscount(true);
              showToast("🎉 Discount claimed! 10% off has been applied to your stay.");
            } else {
              showToast("You've already claimed this discount.");
            }
          }}
          style={claimedDiscount ? { opacity: 0.5, cursor: "not-allowed" } : undefined}
          disabled={claimedDiscount}
        >
          {claimedDiscount ? "Claimed" : "Claim"}
        </button>
      </div>

      {/* 2. Main Booking Card container */}
      <div className="_wquDFA">
        {/* Price header: ₹28,499 for 5 nights */}
        <div className="_KVzBtf">
          <span className="_ctCzOZ flex items-center gap-2">
            {claimedDiscount && (
              <span className="line-through text-neutral-400 font-normal text-lg mr-1">
                {listing.currency}{(listing.pricePerNight * calculatedNights + listing.cleaningFee + listing.serviceFee).toLocaleString()}
              </span>
            )}
            <span>
              {listing.currency}
              {total.toLocaleString()}
            </span>
          </span>
          <span className="_sHBaep">
            for {calculatedNights} night{calculatedNights !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Date + Guest selectors box */}
        <div className="_pVUQKF">
          <div className="_KWmrmZ">
            <button
              type="button"
              onClick={() => {
                setDatePickerOpen(!datePickerOpen);
                setGuestOpen(false);
              }}
              className="_kKMKFu text-left"
            >
              <div className="_LrGBOE">CHECK-IN</div>
              <div className="_QDbcjH">{formatDateMMDDYYYY(checkIn)}</div>
            </button>
            <button
              type="button"
              onClick={() => {
                setDatePickerOpen(!datePickerOpen);
                setGuestOpen(false);
              }}
              className="_kKMKFu text-left"
            >
              <div className="_LrGBOE">CHECKOUT</div>
              <div className="_QDbcjH">{formatDateMMDDYYYY(checkOut)}</div>
            </button>
          </div>

          {datePickerOpen && (
            <div className="relative">
              <CalendarPicker />
            </div>
          )}

          {/* Guests row */}
          <div className="relative" ref={guestRef}>
            <button
              type="button"
              onClick={() => {
                setGuestOpen(!guestOpen);
                setDatePickerOpen(false);
              }}
              aria-expanded={guestOpen}
              aria-haspopup="listbox"
              className="_txAGtY w-full text-left"
            >
              <div>
                <div className="_LrGBOE">GUESTS</div>
                <div className="_QDbcjH">{guestSummaryText}</div>
              </div>
              <span className="_SHwZRb">
                <svg
                  viewBox="0 0 32 32"
                  aria-hidden="true"
                  role="presentation"
                  focusable="false"
                  style={{
                    display: "block",
                    height: "100%",
                    width: "100%",
                    fill: "none",
                    stroke: "currentColor",
                    strokeWidth: 2,
                    overflow: "visible",
                  }}
                >
                  <path
                    d="M4 10l12 12 12-12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
              </span>
            </button>

            {guestOpen && (
              <GuestDropdown
                guests={guests}
                totalGuests={totalGuests}
                onCountChange={handleGuestCountChange}
              />
            )}
          </div>
        </div>

        {/* Free cancellation banner */}
        <div className="_ICtBAS">
          Free cancellation before <b>{cancellationDateText}</b>
        </div>

        {/* Reserve button */}
        <button
          id="booking-card-reserve-btn"
          type="button"
          onClick={handleReserve}
          className="_yUDphb _rOppNP"
        >
          Reserve
        </button>

        {/* Charge notice */}
        <div className="_uNGnOu">You won't be charged yet</div>
      </div>

      {/* 3. Report Listing link */}
      <div className="_uwXNpr">
        <span className="ico">
          <svg
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            role="presentation"
            focusable="false"
            style={{
              display: "block",
              height: "100%",
              width: "100%",
              fill: "currentColor",
            }}
          >
            <path d="m7.5011 1c.5272 0 .9591.40794.99725.92537l.00275.07463v1h5.5c.31265 0 .5435.281645.4935.581075l-.01275.056285-.96125 3.36264.96125 3.36265c.08055.2818-.0967.5625-.36775.62465l-.0554.00945-.0576.00325h-5.5c-.5272 0-.9591-.40795-.99725-.92535l-.00275-.07465v-1h-5v6h-1v-14zm1 3h-1v4h1z"></path>
          </svg>
        </span>
        <a href="#" onClick={(e) => { e.preventDefault(); showToast("Thank you for flagging this listing. Our team will review it."); }}>Report this listing</a>
      </div>
    </div>
  );
});

/* ─── Guest Dropdown ─── */

interface GuestDropdownProps {
  guests: { adults: number; children: number; infants: number; pets: number };
  totalGuests: number;
  onCountChange: (type: "adults" | "children" | "infants" | "pets", op: "inc" | "dec") => void;
}

function GuestDropdown({ guests, totalGuests, onCountChange }: GuestDropdownProps) {
  const rows: { type: "adults" | "children" | "infants" | "pets"; label: string; sub: string; count: number; min: number; max: number }[] = [
    { type: "adults", label: "Adults", sub: "Age 13 or above", count: guests.adults, min: guests.children > 0 ? 1 : 0, max: listing.stats.guests - guests.children },
    { type: "children", label: "Children", sub: "Ages 2 – 12", count: guests.children, min: 0, max: listing.stats.guests - guests.adults },
    { type: "infants", label: "Infants", sub: "Under 2", count: guests.infants, min: 0, max: 5 },
    { type: "pets", label: "Pets", sub: "Bringing a service animal?", count: guests.pets, min: 0, max: 5 },
  ];

  return (
    <div
      className="absolute right-0 top-full mt-2 w-full z-50 rounded-2xl border border-border bg-background shadow-modal p-4 flex flex-col gap-4"
      role="group"
      aria-label="Guest count options"
    >
      {rows.map((row, i) => (
        <div key={row.type} className={`flex items-center justify-between ${i > 0 ? "border-t border-border pt-4" : ""}`}>
          <div>
            <p className="text-sm font-bold text-foreground">{row.label}</p>
            <p className="text-xs text-muted-foreground">{row.sub}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onCountChange(row.type, "dec")}
              disabled={row.count <= row.min}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-foreground font-semibold hover:border-foreground disabled:cursor-not-allowed disabled:opacity-30 active:scale-95"
              aria-label={`Decrease ${row.label.toLowerCase()} count`}
            >
              −
            </button>
            <span className="w-4 text-center text-sm font-bold text-foreground tabular-nums">{row.count}</span>
            <button
              type="button"
              onClick={() => onCountChange(row.type, "inc")}
              disabled={row.type === "adults" || row.type === "children" ? totalGuests >= listing.stats.guests : row.count >= row.max}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-foreground font-semibold hover:border-foreground disabled:cursor-not-allowed disabled:opacity-30 active:scale-95"
              aria-label={`Increase ${row.label.toLowerCase()} count`}
            >
              +
            </button>
          </div>
        </div>
      ))}
      <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
        This place has a maximum of {listing.stats.guests} guests, not including infants. Pets are allowed.
      </p>
    </div>
  );
}

export default BookingCard;
