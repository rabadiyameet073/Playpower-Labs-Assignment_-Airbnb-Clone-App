import React, { useState, useCallback, useMemo, memo } from "react";
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

const parseLocalDate = (dateStr: string) => {
  if (!dateStr) return null;
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
};

const formatDateRange = (inStr: string, outStr: string) => {
  const dIn = parseLocalDate(inStr);
  if (!dIn) return "Add your travel dates for exact pricing";
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const inFormatted = `${dIn.getDate()} ${months[dIn.getMonth()]} ${dIn.getFullYear()}`;
  const dOut = parseLocalDate(outStr);
  if (!dOut) return `${inFormatted} - Add checkout date`;
  return `${inFormatted} - ${dOut.getDate()} ${months[dOut.getMonth()]} ${dOut.getFullYear()}`;
};

const InlineCalendar = memo(function InlineCalendar() {
  const { checkIn, setCheckIn, checkOut, setCheckOut } = useApp();
  
  // Starting view months: default to October 2026
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(9); // October (9 is 0-indexed)

  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  const startVal = useMemo(() => parseLocalDate(checkIn), [checkIn]);
  const endVal = useMemo(() => parseLocalDate(checkOut), [checkOut]);

  const nightsCount = useMemo(() => {
    if (!startVal || !endVal) return 0;
    const diff = endVal.getTime() - startVal.getTime();
    return Math.round(diff / (1000 * 60 * 60 * 24));
  }, [startVal, endVal]);

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
    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(dateStr);
      setCheckOut("");
    } else {
      const selected = parseLocalDate(dateStr)!;
      const start = parseLocalDate(checkIn)!;
      if (selected < start) {
        setCheckIn(dateStr);
      } else {
        setCheckOut(dateStr);
      }
    }
  }, [checkIn, checkOut, setCheckIn, setCheckOut]);

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
      <div className="_hPpKsx" key={`${year}-${month}`}>
        <div className="_gzHmfN">
          {MONTH_NAMES[month]} {year}
        </div>
        
        {/* Weekday headers */}
        <div className="_HTRKRV">
          {WEEKDAYS.map((d) => (
            <span key={d}>
              {d[0]}
            </span>
          ))}
        </div>

        {/* Days grid */}
        <div className="_VFCCyU">
          {grid.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} className="_PuyutQ _vmdwgU" />;
            }

            const monthStr = String(month + 1).padStart(2, "0");
            const dayStr = String(day).padStart(2, "0");
            const dateStr = `${year}-${monthStr}-${dayStr}`;
            
            const cellDate = parseLocalDate(dateStr)!;
            const isTodayOrFuture = cellDate >= parseLocalDate("2026-07-01")!; // Allow dates starting July 2026

            const isStart = checkIn === dateStr;
            const isEnd = checkOut === dateStr;
            
            let isInRange = false;
            let isHoverRange = false;

            if (startVal && endVal) {
              isInRange = cellDate > startVal && cellDate < endVal;
            } else if (startVal && hoveredDate) {
              const hoverVal = parseLocalDate(hoveredDate)!;
              isHoverRange = cellDate > startVal && cellDate < hoverVal;
            }

            let cellClass = "_PuyutQ";
            if (!isTodayOrFuture) {
              cellClass += " _ZzbOXA";
            } else if (isStart) {
              cellClass += " _LpBjQi";
            } else if (isEnd) {
              cellClass += " _CkEFjf";
            } else if (isInRange) {
              cellClass += " _ARTKxS";
            } else if (isHoverRange) {
              cellClass += " _ARTKxS";
            }

            return (
              <button
                key={dateStr}
                type="button"
                disabled={!isTodayOrFuture}
                onClick={() => selectDate(dateStr)}
                onMouseEnter={() => setHoveredDate(dateStr)}
                onMouseLeave={() => setHoveredDate(null)}
                className={cellClass}
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

  const headingText = nightsCount > 0 ? `${nightsCount} nights in Candolim` : "Select check-in date";
  const dateRangeText = formatDateRange(checkIn, checkOut);

  return (
    <div className="_DETeJn">
      <div className="_KCTBwD">
        <div className="_advEXQ">{headingText}</div>
        <div className="_oKYmRd">{dateRangeText}</div>
      </div>

      <div className="_NXopGD">
        {/* Navigation buttons */}
        <div className="_rQGcyI">
          <button type="button" onClick={handlePrevMonths} aria-label="Previous month">
            <span className="ico">
              <svg viewBox="0 0 18 18" style={{ display: 'block', height: '100%', width: '100%', fill: 'currentColor' }}>
                <path d="m13.7 16.29a1 1 0 1 1 -1.42 1.41l-8-8a1 1 0 0 1 0-1.41l8-8a1 1 0 1 1 1.42 1.41l-7.29 7.29z" fillRule="evenodd"></path>
              </svg>
            </span>
          </button>
          <button type="button" onClick={handleNextMonths} aria-label="Next month">
            <span className="ico">
              <svg viewBox="0 0 18 18" style={{ display: 'block', height: '100%', width: '100%', fill: 'currentColor' }}>
                <path d="m4.29 1.71a1 1 0 1 1 1.42-1.41l8 8a1 1 0 0 1 0 1.41l-8 8a1 1 0 1 1 -1.42-1.41l7.29-7.29z" fillRule="evenodd"></path>
              </svg>
            </span>
          </button>
        </div>

        {/* Monthly Grids */}
        {renderMonthGrid(currentYear, currentMonth)}
        {renderMonthGrid(nextYear, nextMonth)}
      </div>

      {/* Footer controls */}
      <div className="_pcAVYu">
        <span className="_REkRVA" aria-hidden="true">
          <svg viewBox="0 0 32 22" width="20" height="14" fill="none" stroke="currentColor" strokeWidth="1.6">
            <rect x="1" y="1" width="30" height="20" rx="3"></rect>
            <path d="M6 7h.01M11 7h.01M16 7h.01M21 7h.01M26 7h.01M6 12h.01M26 12h.01M9 16h14"></path>
          </svg>
        </span>
        <button
          type="button"
          onClick={() => {
            setCheckIn("");
            setCheckOut("");
          }}
          className="_vvVZXL"
        >
          Clear dates
        </button>
      </div>
    </div>
  );
});

export default InlineCalendar;
