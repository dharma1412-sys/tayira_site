"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function BannerCarousel({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative w-full h-[200px] sm:h-[400px] overflow-hidden carousel-img-wrapper">
      {images.map((img, idx) => (
        <Image
          key={img}
          src={img}
          alt={`Banner ${idx + 1}`}
          fill
          sizes="(max-width: 640px) 100vw, 800px"
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-700 ${
            idx === current ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* Carousel Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {images.map((_, idx) => (
          <button
            key={idx}
            className={`w-3 h-3 rounded-full ${
              idx === current ? "bg-amber-600" : "bg-gray-300"
            }`}
            onClick={() => setCurrent(idx)}
            aria-label={`Go to banner ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
