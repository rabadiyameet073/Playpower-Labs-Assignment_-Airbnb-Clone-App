import React, { useState, useCallback, useMemo, memo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useApp } from "../context/AppContext";

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const CalendarPicker = memo(function CalendarPicker() {
  const { checkIn, setCheckIn, checkOut, setCheckOut } = useApp();
  
  // Starting view months: default to August 2026 (based on screenshots Aug 10 - Aug 15, 2026)
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(7); // August (0-indexed, so 7 is August)

  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  const startVal = useMemo(() => (checkIn ? new Date(checkIn) : null), [checkIn]);
  const endVal = useMemo(() => (checkOut ? new Date(checkOut) : null), [checkOut]);

  const handlePrevMonths = useCallback(() => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  }, [currentMonth]);

  const handleNextMonths = useCallback(() => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  }, [currentMonth]);

  const selectDate = useCallback((dateStr: string) => {
    const selected = new Date(dateStr);
    
    if (!startVal || (startVal && endVal)) {
      setCheckIn(dateStr);
      setCheckOut("");
    } else {
      if (selected < startVal) {
        setCheckIn(dateStr);
      } else {
        setCheckOut(dateStr);
      }
    }
  }, [startVal, endVal, setCheckIn, setCheckOut]);

  const renderMonthGrid = useCallback((year: number, month: number) => {
    const daysCount = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const grid: (number | null)[] = [];

    // Pad before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      grid.push(null);
    }

    // Populate month days
    for (let i = 1; i <= daysCount; i++) {
      grid.push(i);
    }

    return (
      <div className="w-[300px]" key={`${year}-${month}`}>
        <div className="text-center font-bold text-base text-foreground mb-4">
          {MONTH_NAMES[month]} {year}
        </div>
        
        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-y-1 mb-2 text-center text-xs font-semibold text-muted-foreground">
          {WEEKDAYS.map((d) => (
            <div key={d} className="h-9 flex items-center justify-center">
              {d}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-y-1 text-center text-sm font-semibold">
          {grid.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} className="h-10" />;
            }

            const monthStr = String(month + 1).padStart(2, "0");
            const dayStr = String(day).padStart(2, "0");
            const dateStr = `${year}-${monthStr}-${dayStr}`;
            
            const cellDate = new Date(dateStr);
            const isTodayOrFuture = cellDate >= new Date("2026-07-01"); // Allow dates starting July 2026 for testing

            const isStart = checkIn === dateStr;
            const isEnd = checkOut === dateStr;
            
            let isInRange = false;
            let isHoverRange = false;

            if (startVal && endVal) {
              isInRange = cellDate > startVal && cellDate < endVal;
            } else if (startVal && hoveredDate) {
              const hoverVal = new Date(hoveredDate);
              isHoverRange = cellDate > startVal && cellDate < hoverVal;
            }

            let bgClass = "bg-transparent text-foreground hover:border-foreground border border-transparent";
            if (isStart || isEnd) {
              bgClass = "bg-primary text-white rounded-full scale-95";
            } else if (isInRange) {
              bgClass = "bg-primary/10 text-foreground rounded-none";
            } else if (isHoverRange) {
              bgClass = "bg-primary/5 text-foreground rounded-none";
            }

            return (
              <button
                key={dateStr}
                type="button"
                disabled={!isTodayOrFuture}
                onClick={() => selectDate(dateStr)}
                onMouseEnter={() => setHoveredDate(dateStr)}
                onMouseLeave={() => setHoveredDate(null)}
                className={`h-10 w-10 flex items-center justify-center rounded-full transition-all focus-visible:outline-2 ${bgClass} disabled:opacity-20 disabled:cursor-not-allowed`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    );
  }, [checkIn, checkOut, startVal, endVal, hoveredDate, selectDate]);

  // Next month calculation
  const { nextMonth, nextYear } = useMemo(() => {
    let m = currentMonth + 1;
    let y = currentYear;
    if (m > 11) {
      m = 0;
      y += 1;
    }
    return { nextMonth: m, nextYear: y };
  }, [currentMonth, currentYear]);

  return (
    <div className="absolute right-0 top-full mt-2 z-50 rounded-3xl border border-border bg-background shadow-modal p-6 flex flex-col gap-4 w-[670px] max-md:w-full max-md:flex-col">
      {/* Controls */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <button
          type="button"
          onClick={handlePrevMonths}
          className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-secondary focus-visible:outline-2"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="text-sm font-semibold">Select Dates</span>
        <button
          type="button"
          onClick={handleNextMonths}
          className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-secondary focus-visible:outline-2"
          aria-label="Next month"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Calendar Double Grid */}
      <div className="flex gap-8 max-md:flex-col justify-center">
        {renderMonthGrid(currentYear, currentMonth)}
        {renderMonthGrid(nextYear, nextMonth)}
      </div>

      {/* Footer info */}
      <div className="flex items-center justify-between border-t border-border pt-4 text-xs font-medium text-muted-foreground">
        <span>Check-in: {checkIn || "Not set"}</span>
        <span>Checkout: {checkOut || "Not set"}</span>
        <button
          type="button"
          onClick={() => {
            setCheckIn("");
            setCheckOut("");
          }}
          className="underline hover:text-foreground focus-visible:outline-2"
        >
          Clear dates
        </button>
      </div>
    </div>
  );
});

export default CalendarPicker;
