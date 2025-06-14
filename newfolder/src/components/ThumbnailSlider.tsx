// src/components/ThumbnailSlider.tsx
import React, { useState, useEffect } from 'react';

interface ThumbnailSliderProps {
  thumbnails: string[];
}

const ThumbnailSlider: React.FC<ThumbnailSliderProps> = ({ thumbnails }) => {
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    if (thumbnails.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % thumbnails.length);
    }, 2500); // Change image every 2.5 seconds

    return () => clearInterval(interval);
  }, [thumbnails.length]);

  return (
    <div className="relative w-full h-52 overflow-hidden rounded-lg group">
      {thumbnails.map((thumb, idx) => (
        <img
          key={idx}
          src={thumb}
          alt={`Preview ${idx + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            idx === currentIdx ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
    </div>
  );
};

export default ThumbnailSlider;