import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

import banner1 from "/images/banner-1.png";
import banner2 from "/images/banner-2.png";
import banner3 from "/images/banner-3.png";
import banner4 from "/images/banner-4.png";
import banner5 from "/images/banner-5.png";
import banner6 from "/images/banner-6.png";
import banner7 from "/images/banner-7.png";

export const bannerSlides = [
  {
    id: 1,
    image: banner1,
    title: "ColorLex Creation - Print, Design & Software Solutions",
    productLink: "/catalog"
  },
  {
    id: 2,
    image: banner2,
    title: "Spiral Photo Album Book - Keepsakes & Stories",
    productLink: "/product/photo-frame-printing"
  },
  {
    id: 3,
    image: banner3,
    title: "Custom Luxury Business Cards - Foil & Spot UV",
    productLink: "/product/premium-visiting-card"
  },
  {
    id: 4,
    image: banner4,
    title: "High Impact Vinyl & Outdoor Banner Print",
    productLink: "/product/frontlit-flex-printing"
  },
  {
    id: 5,
    image: banner5,
    title: "High-Impact Outdoor Signage & LED Boards",
    productLink: "/product/led-glow-sign-board"
  },
  {
    id: 6,
    image: banner6,
    title: "Premium Handcrafted Photo Frames",
    productLink: "/product/photo-frame-printing"
  },
  {
    id: 7,
    image: banner7,
    title: "Precision Laser Cutting & Engraving Services",
    productLink: "/product/wedding-laser-cut-decor"
  }
];

export default function Hero({ onSlideChange }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const isDraggingRef = useRef(false);
  const navigate = useNavigate();

  const SLIDE_DURATION = 5000; // 5 seconds autoplay rotation

  // Next Slide
  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % bannerSlides.length);
  }, []);

  // Previous Slide
  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? bannerSlides.length - 1 : prev - 1));
  }, []);

  // Go to specific slide
  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (onSlideChange) onSlideChange(currentIndex);
  }, [currentIndex, onSlideChange]);

  // Autoplay timer
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      handleNext();
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [isPlaying, handleNext]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  // Touch swipe support for mobile
  const handleTouchStart = (e) => {
    setIsPlaying(false);
    setTouchStartX(e.touches[0].clientX);
    setTouchEndX(e.touches[0].clientX);
    isDraggingRef.current = false;
  };

  const handleTouchMove = (e) => {
    if (touchStartX === null) return;
    const currentX = e.touches[0].clientX;
    setTouchEndX(currentX);
    setSwipeOffset(currentX - touchStartX);
    if (Math.abs(currentX - touchStartX) > 10) {
      isDraggingRef.current = true;
    }
  };

  const handleTouchEnd = () => {
    if (touchStartX === null || touchEndX === null) {
      setSwipeOffset(0);
      setIsPlaying(true);
      return;
    }
    const diff = touchStartX - touchEndX;
    const minSwipeDistance = 45;

    if (diff > minSwipeDistance) {
      handleNext();
    } else if (diff < -minSwipeDistance) {
      handlePrev();
    }

    setTouchStartX(null);
    setTouchEndX(null);
    setSwipeOffset(0);
    setIsPlaying(true);

    setTimeout(() => {
      isDraggingRef.current = false;
    }, 120);
  };

  const handleBannerClick = (e, link) => {
    if (isDraggingRef.current) {
      e.preventDefault();
      return;
    }
    navigate(link);
  };

  return (
    <section className="relative w-full mt-1  overflow-hidden bg-slate-950 select-none">
      {/* Edge-to-Edge Banner Carousel */}
      <div
        className="relative w-full overflow-hidden group"
        onMouseEnter={() => setIsPlaying(false)}
        onMouseLeave={() => setIsPlaying(true)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Sliding Track */}
        <div
          className={`flex w-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isDraggingRef.current ? "transition-none" : ""
          }`}
          style={{
            transform: `translateX(calc(-${currentIndex * 100}% + ${swipeOffset}px))`
          }}
        >
          {bannerSlides.map((slide, idx) => (
            <div
              key={slide.id}
              className="min-w-full w-full relative flex items-center justify-center bg-slate-950"
            >
              {/* Full-width responsive aspect ratio covering edge-to-edge */}
              <div
                onClick={(e) => handleBannerClick(e, slide.productLink)}
                className="relative w-full sm:aspect-[2.45/1] md:aspect-[2.75/1] lg:aspect-[2.85/1] block overflow-hidden bg-slate-950 cursor-pointer"
                title={`Click to view ${slide.title}`}
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  loading={idx === 0 ? "eager" : "lazy"}
                  decoding="async"
                  className="w-full h-auto object-contain sm:h-full sm:object-cover transition-transform duration-700 select-none pointer-events-none hover:scale-[1.01]"
                />

                {/* Subtle bottom shadow vignette for clean indicator contrast */}
                <div className="absolute inset-x-0 bottom-0 h-12 sm:h-20 bg-gradient-to-t from-slate-950/60 via-slate-950/20 to-transparent pointer-events-none" />
              </div>
            </div>
          ))}
        </div>

        {/* Left Arrow Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          aria-label="Previous banner"
          className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-slate-950/60 hover:bg-slate-900/90 text-white backdrop-blur-md border border-white/20 hover:border-white/50 flex items-center justify-center shadow-2xl transition-all duration-300 opacity-70 sm:opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Right Arrow Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          aria-label="Next banner"
          className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-slate-950/60 hover:bg-slate-900/90 text-white backdrop-blur-md border border-white/20 hover:border-white/50 flex items-center justify-center shadow-2xl transition-all duration-300 opacity-70 sm:opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Clean Indicator Dots — on mobile sits near the image bottom edge */}
        <div className="absolute bottom-1 sm:bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-1.5 sm:space-x-2 bg-slate-950/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-lg">
          {bannerSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                goToSlide(idx);
              }}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                currentIndex === idx
                  ? "w-6 sm:w-8 bg-purple-500 shadow-md shadow-purple-500/50"
                  : "w-1.5 sm:w-2 bg-white/40 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
