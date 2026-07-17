import React, { useState, useCallback, memo } from "react";
import { listing } from "../data";

const EXPANDED_NEIGHBOURHOOD = `Located in the heart of Candolim, Amor de Goa offers a peaceful stay with easy access to beaches, cafés, and popular attractions.

Candolim Beach is just a 5-minute drive away, known for its pristine golden sands and stunning sunsets. The area is surrounded by charming local restaurants serving authentic Goan cuisine, seafood shacks, and international dining options.

Popular nearby attractions include Fort Aguada (2 km), Sinquerim Beach (3 km), and the vibrant Calangute Beach strip (4 km). For nightlife enthusiasts, Tito's Lane in Baga is just 6 km away.

The neighbourhood is well-connected with easy access to local taxis, scooter rentals, and ride-sharing services. Goa International Airport (Dabolim) is approximately 40 km away, while the new Manohar International Airport (Mopa) is about 35 km away.

Grocery stores, pharmacies, and ATMs are all within walking distance, making daily essentials easily accessible during your stay.`;

const MapSection = memo(function MapSection() {
  const [zoom, setZoom] = useState(14);
  const [neighbourhoodExpanded, setNeighbourhoodExpanded] = useState(false);

  const handleZoomIn = useCallback(() => {
    setZoom((z) => Math.min(z + 1, 18));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((z) => Math.max(z - 1, 10));
  }, []);

  const handleSearchClick = useCallback(() => {
    window.open("https://www.google.com/maps/search/?api=1&query=Candolim,+Goa,+India", "_blank");
  }, []);

  return (
    <section aria-labelledby="map-heading" className="_AIFnOW" id="location">
      <h2 id="map-heading" className="_ALTsyF">
        Where you'll be
      </h2>
      <div className="_PEorae">{listing.location}</div>
      
      <div className="_qfDJVJ">
        {/* Real Google Maps embed inside the wrapper */}
        <div className="_kYZPBQ">
          <iframe
            title="Interactive Google Map of Candolim, Goa"
            src={`https://maps.google.com/maps?q=Candolim,%20Goa,%20India&t=&z=${zoom}&ie=UTF8&iwloc=&output=embed`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        
        {/* Search button overlay */}
        <button 
          className="_XDlpxx" 
          aria-label="View larger map on Google Maps" 
          type="button"
          onClick={handleSearchClick}
        >
          <span style={{ width: '16px', height: '16px' }}>
            <svg viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', height: '100%', width: '100%', fill: 'none', stroke: 'currentColor', strokeWidth: 2, overflow: 'visible' }}>
              <circle cx="14" cy="14" r="9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M21 21l9 9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </button>

        {/* Zoom controls overlay */}
        <div className="_OtMovh">
          <button aria-label="Zoom in" type="button" onClick={handleZoomIn}>
            <span className="ico">
              <svg viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', height: '100%', width: '100%', fill: 'none', stroke: 'currentColor', strokeWidth: 2, overflow: 'visible' }}>
                <path d="M16 5v22M5 16h22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>
          <button aria-label="Zoom out" type="button" onClick={handleZoomOut}>
            <span className="ico">
              <svg viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', height: '100%', width: '100%', fill: 'none', stroke: 'currentColor', strokeWidth: 2, overflow: 'visible' }}>
                <path d="M5 16h22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>
        </div>

        {/* House pin badge in the center */}
        <div className="_gUwYgn">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{ display: "block", height: "24px", width: "24px", fill: "currentColor" }}>
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
        </div>
      </div>

      <div className="_TDksCB">Exact location will be provided after booking.</div>
      <div className="_skaisy">Neighbourhood highlights</div>
      <div className="_jErbPL" style={{ whiteSpace: "pre-line" }}>
        {neighbourhoodExpanded
          ? EXPANDED_NEIGHBOURHOOD
          : "Located in the heart of Candolim, Amor de Goa offers a peaceful stay with easy access to beaches, cafés, and popular attractions."}
      </div>
      <button
        className="_ywZNbX"
        style={{ marginTop: '18px' }}
        type="button"
        onClick={() => setNeighbourhoodExpanded(!neighbourhoodExpanded)}
      >
        {neighbourhoodExpanded ? "Show less" : "Show more"}{" "}
        <span className="_lUheNd" style={{ transform: neighbourhoodExpanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
          <svg viewBox="0 0 18 18" role="presentation" aria-hidden="true" focusable="false" style={{ display: 'block', height: '100%', width: '100%', fill: 'currentColor' }}>
            <path d="M6.2 16.2L13.4 9 6.2 1.8 7.6.4l8.6 8.6-8.6 8.6-1.4-1.4z" fillRule="evenodd" />
          </svg>
        </span>
      </button>
    </section>
  );
});

export default MapSection;
