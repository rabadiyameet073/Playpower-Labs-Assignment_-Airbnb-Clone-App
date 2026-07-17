import React from "react";

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
}

export default function Skeleton({
  className = "",
  width,
  height,
  borderRadius = "0.5rem",
}: SkeletonProps) {
  const style: React.CSSProperties = {
    width: width !== undefined ? width : "100%",
    height: height !== undefined ? height : "1rem",
    borderRadius,
  };

  return (
    <div
      style={style}
      className={`animate-pulse bg-neutral-200 ${className}`}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Loading content placeholder"
    />
  );
}
