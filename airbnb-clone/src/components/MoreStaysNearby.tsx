import React, { useState, useRef, useCallback, memo } from "react";
import { staysNearby } from "../data";

const MoreStaysNearby = memo(function MoreStaysNearby() {
  const [slide, setSlide] = useState(1);
  const trackRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    if (trackRef.current) {
      const scrollLeft = trackRef.current.scrollLeft;
      // If scrolled past half card width, mark as slide 2
      const isSlide2 = scrollLeft > 100;
      setSlide(isSlide2 ? 2 : 1);
    }
  }, []);

  const handlePrev = useCallback(() => {
    if (trackRef.current) {
      trackRef.current.scrollLeft = 0;
    }
  }, []);

  const handleNext = useCallback(() => {
    if (trackRef.current) {
      trackRef.current.scrollLeft = trackRef.current.scrollWidth;
    }
  }, []);

  return (
    <section className="_AIFnOW" aria-labelledby="stays-heading">
      <div className="_gjSeKQ">
        <h2 id="stays-heading" className="_ALTsyF" style={{ margin: "0px" }}>
          More stays nearby
        </h2>
        
        {/* Slide Controls */}
        <div className="_SQVNmy">
          <span className="_wBYuLY">{slide} / 2</span>
          <button
            type="button"
            disabled={slide === 1}
            onClick={handlePrev}
            aria-label="Previous slide"
            className="_zuEUty"
            id="simPrev"
          >
            <span className="ico">
              <svg viewBox="0 0 18 18" role="presentation" aria-hidden="true" focusable="false" style={{ display: 'block', height: '100%', width: '100%', fill: 'currentColor' }}>
                <path d="M13.7 16.2L6.5 9l7.2-7.2-1.4-1.4L3.7 9l8.6 8.6-1.4-1.4z" fillRule="evenodd" />
              </svg>
            </span>
          </button>
          <button
            type="button"
            disabled={slide === 2}
            onClick={handleNext}
            aria-label="Next slide"
            className="_zuEUty"
            id="simNext"
          >
            <span className="ico">
              <svg viewBox="0 0 18 18" role="presentation" aria-hidden="true" focusable="false" style={{ display: 'block', height: '100%', width: '100%', fill: 'currentColor' }}>
                <path d="M4.3 16.2L11.5 9 4.3 1.8 5.7.4l8.6 8.6-8.6 8.6-1.4-1.4z" fillRule="evenodd" />
              </svg>
            </span>
          </button>
        </div>
      </div>

      {/* Grid of Listings Slider */}
      <div className="_vTPWvh" id="simTrack" ref={trackRef} onScroll={handleScroll}>
        {staysNearby.map((stay) => (
          <div key={stay.id} className="_HRgUtV">
            <div className="stay-img-wrapper">
              <img
                src={stay.image}
                alt={stay.title}
                loading="lazy"
              />
            </div>
            <div className="_advEXQ">{stay.title}</div>
            <div className="p">
              ₹{stay.price.toLocaleString()}&nbsp;&nbsp;
              <span className="star">
                <svg viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', height: '100%', width: '100%', fill: 'currentColor' }}>
                  <path fillRule="evenodd" d="m15.1 1.58-4.13 8.88-9.86 1.27a1 1 0 0 0-.54 1.74l7.3 6.57-1.97 9.85a1 1 0 0 0 1.48 1.06l8.62-5 8.63 5a1 1 0 0 0 1.48-1.06l-1.97-9.85 7.3-6.57a1 1 0 0 0-.55-1.73l-9.86-1.28-4.12-8.88a1 1 0 0 0-1.82 0z" />
                </svg>
              </span>
              &nbsp;{stay.rating.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
});

export default MoreStaysNearby;
