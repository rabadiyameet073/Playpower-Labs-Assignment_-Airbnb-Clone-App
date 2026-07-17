import React, { memo, useCallback } from "react";
import { photos } from "../data";
import { useApp } from "../context/AppContext";

const FALLBACK_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23f0f0f0' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999' font-size='14'%3EImage unavailable%3C/text%3E%3C/svg%3E";

const PhotoGrid = memo(function PhotoGrid() {
  const { openPhotoTour } = useApp();
  const tiles = React.useMemo(() => [
    photos[6],  // photo6 (2367476f...)
    photos[3],  // photo3 (090d8b0b...)
    photos[4],  // photo4 (9be71047...)
    photos[12], // photo12 (67c61c6f...)
    photos[28]  // photo28 (c904e1ab...)
  ].filter(Boolean), []);

  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.src !== FALLBACK_IMG) {
      img.src = FALLBACK_IMG;
    }
  }, []);

  return (
    <section id="photos" aria-label="Photo gallery" className="_LYTWdd">
      <div className="_xabjMC" id="heroGrid">
        {tiles.map((photo, i) => (
          <button
            key={photo.src}
            type="button"
            onClick={() => {
              const originalIndex = photos.indexOf(photo);
              openPhotoTour(originalIndex !== -1 ? originalIndex : 0);
            }}
            aria-label={`Open photo tour at ${photo.room}`}
            className="_bcKEnm"
          >
            <img
              src={photo.src}
              alt={photo.alt}
              loading={i === 0 ? "eager" : "lazy"}
              onError={handleImageError}
            />
          </button>
        ))}
      </div>

      {/* Show all photos pill button */}
      <button
        type="button"
        id="showAllPhotos"
        className="_ocjgQL"
        onClick={() => openPhotoTour(0)}
      >
        <span className="_bhnFoi">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', height: '100%', width: '100%', fill: 'currentColor' }}>
            <path fill-rule="evenodd" d="M3 11.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm5 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm5 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm-10-5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm5 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm5 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm-10-5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm5 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm5 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z"></path>
          </svg>
        </span>
        Show all photos
      </button>
    </section>
  );
});

export default PhotoGrid;
