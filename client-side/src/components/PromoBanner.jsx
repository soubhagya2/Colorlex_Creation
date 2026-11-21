import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Copy, Check } from 'lucide-react';
import photoFrame from '../assets/images/Photo Frame.png';
import mug from '../assets/images/Mug.png';
import tshirt from '../assets/images/tshirt.png'
import leser from '../assets/images/leser.png'
const COUPON_CODE = 'COLORLEX15';

const promoProducts = [
  {
    id: 'photo-frames',
    title: 'Photo Frames',
    buttonText: 'Trending Now',
    link: '/product/photo-frame-printing',
    image: photoFrame,
    fallbackImage: '/images/banner-6.png',
  },
  {
    id: 'customized-mugs',
    title: 'Customized Mugs',
    buttonText: 'Budget Buys',
    link: '/product/personalized-magic-mug',
    image: mug,
    fallbackImage:
      'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'customized-tshirts',
    title: 'Customized T-Shirts',
    buttonText: 'Top Rated Picks',
    link: '/product/custom-printed-t-shirt',
    image: tshirt,
    fallbackImage:
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'laser-cut-designs',
    title: 'Laser-Cut Designs',
    buttonText: 'Daily Essentials',
    link: '/product/wedding-laser-cut-decor',
    image: leser,
    fallbackImage: '/images/banner-7.png',
  },
];

const discountTextShadow = {
  textShadow: '0 2px 0 rgba(255,255,255,0.7), 2px 4px 0 rgba(110,10,50,0.2)',
};

export default function PromoBanner() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(COUPON_CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  return (
    <section className="relative">
      <div className="relative flex flex-col lg:flex-row items-stretch overflow-hidden border border-purple-500/20 bg-slate-950 shadow-2xl shadow-purple-950/40">

        {/* LEFT SECTION: Promotional Callout */}
        <div className="relative flex shrink-0 flex-col justify-between gap-5 overflow-hidden bg-gradient-to-br from-[#FF9F00] via-[#FF8500] to-[#E65100] p-6 text-slate-950 shadow-lg sm:p-8 lg:w-[32%] xl:w-[29%]">

          {/* Decorative glows */}
          <div className="pointer-events-none absolute -top-16 -left-16 h-44 w-44 rounded-full bg-white/20 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-amber-300/30 blur-2xl" />

          {/* Rotated T&C stamp */}
          <div className="pointer-events-none absolute left-1.5 top-1/2 hidden -translate-y-1/2 -rotate-90 select-none text-[9px] font-bold uppercase tracking-widest text-amber-950/40 lg:block">
            T&amp;C Apply*
          </div>

          {/* Offer text */}
          <div className="relative z-10 lg:pl-3">
            <span className="block text-xs font-extrabold uppercase tracking-wider text-[#3B0728]/85 sm:text-sm">
              Up to
            </span>

            <div className="my-1 flex items-baseline gap-1.5 sm:my-2">
              <span
                className="select-none text-5xl font-black leading-none tracking-tight text-[#360424] sm:text-6xl xl:text-7xl"
                style={discountTextShadow}
              >
                15%
              </span>
              <span
                className="select-none text-3xl font-black uppercase leading-none tracking-tight text-[#360424] sm:text-4xl xl:text-5xl"
                style={discountTextShadow}
              >
                OFF
              </span>
            </div>

            <p className="mt-1 text-base font-black leading-tight text-[#3B0728] sm:text-lg">
              on your first order
            </p>
          </div>

          {/* Coupon code */}
          <div className="relative z-10 lg:pl-3">
            <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-[#3B0728]/70 sm:text-xs">
              Use Code
            </p>
            <button
              type="button"
              onClick={handleCopy}
              aria-label={`Copy coupon code ${COUPON_CODE}`}
              className="flex w-full items-center justify-between gap-3 rounded-xl border-2 border-dashed border-[#3B0728]/60 bg-white/25 px-4 py-2.5 backdrop-blur-sm transition-colors hover:bg-white/40 sm:w-auto"
            >
              <span className="text-base font-black tracking-widest text-[#360424] sm:text-lg">
                {COUPON_CODE}
              </span>
              <span className="flex items-center gap-1 text-xs font-bold text-[#3B0728]">
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </span>
            </button>
          </div>

          {/* Shop Now button */}
          <div className="relative z-10 lg:pl-3">
            <Link
              to="/catalog"
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/80 bg-white px-7 py-3 text-sm font-black text-[#40002A] shadow-xl transition-colors hover:bg-amber-50 sm:w-auto sm:text-base"
            >
              <span>Shop Now</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* RIGHT SECTION: Product Showcase */}
        <div className="relative flex flex-1 flex-col justify-center overflow-hidden bg-gradient-to-r from-[#7D0552] via-[#640141] to-[#3B0027] p-4 sm:p-6 lg:p-7">
          <div className="relative z-10 grid grid-cols-2 items-stretch gap-3 sm:grid-cols-4 sm:gap-4">
            {promoProducts.map((product) => (
              <Link
                key={product.id}
                to={product.link}
                className="group flex h-full flex-col items-center gap-3"
              >
                <img
                  src={product.image}
                  alt={product.title}
                  loading="lazy"
                  className="aspect-square w-[90%] object-contain drop-shadow-2xl transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    if (
                      product.fallbackImage &&
                      e.currentTarget.src !== product.fallbackImage
                    ) {
                      e.currentTarget.src = product.fallbackImage;
                    }
                  }}
                />

                <div className="mt-auto w-full rounded-full border border-white/90 bg-white px-2 py-2 text-center text-xs font-extrabold text-[#40002A] shadow-md transition-colors group-hover:bg-amber-50 sm:text-sm">
                  <span className="block truncate">{product.buttonText}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}