import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Printer, Sparkles, ArrowRight, ShieldCheck, Zap, ChevronDown } from 'lucide-react';
import Hero from './Hero';
import PromoBanner from '../components/PromoBanner';
import PhotoFrameShowcase from '../components/photo-frame-showcase/PhotoFrameShowcase';
import { apiFetch } from '../services/api';
import creative from '../assets/images/creative.png';
import mobCreative from '../assets/images/mobCreative.png';

/* Shared horizontal margin for every section. Change it here only.
   Mobile: 12px, tablet: 24px, desktop: 32px */
const SECTION = 'mx-3 sm:mx-6 lg:mx-8';

const FEATURES = [
  { icon: Printer, title: 'Ultra 300 DPI CMYK', text: 'Vibrant, true-to-file color precision', tone: 'bg-purple-100 text-purple-600' },
  { icon: ShieldCheck, title: 'Free Proof Approval', text: 'Inspect & approve before printing starts', tone: 'bg-indigo-100 text-indigo-600' },
  { icon: Zap, title: 'Express Dispatch', text: 'Rush same-day & 24h turnaround', tone: 'bg-emerald-100 text-emerald-600' },
  { icon: Sparkles, title: 'In-House Design Desk', text: 'Custom artwork & prepress support', tone: 'bg-pink-100 text-pink-600' },
];

const STEPS = [
  { no: '01', title: 'Choose Your Product', text: 'Select your item, custom sizes, paper stock, foil finishes, and quantity.', tone: 'text-purple-500/40' },
  { no: '02', title: 'Upload or Request Design', text: 'Upload print-ready files or let our graphic designers craft custom artwork for you.', tone: 'text-indigo-500/40' },
  { no: '03', title: 'Approve Digital Proof', text: 'Inspect high-resolution 3D & digital proofs. Nothing prints until you approve it!', tone: 'text-pink-500/40' },
  { no: '04', title: 'Precision Print & Ship', text: 'Fast turnarounds, protective packaging, and tracked doorstep delivery.', tone: 'text-emerald-500/40' },
];

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  /* Fetch home data */
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [featRes, catRes, allRes] = await Promise.all([
          apiFetch('/products?featured=true').catch(() => ({ success: false })),
          apiFetch('/categories').catch(() => ({ success: false })),
          apiFetch('/products').catch(() => ({ success: false })),
        ]);
        if (!isMounted) return;

        if (featRes?.success && Array.isArray(featRes.data)) setFeaturedProducts(featRes.data);
        if (catRes?.success && Array.isArray(catRes.data)) {
          setCategories([...catRes.data].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)));
        }
        if (allRes?.success && Array.isArray(allRes.data)) setAllProducts(allRes.data);
      } catch (err) {
        console.error('Failed to load home data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  /* Close category dropdown on outside click */
  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest('.category-dropdown-group')) setOpenDropdownId(null);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const getCategoryProducts = (cat) => {
    if (Array.isArray(cat.products) && cat.products.length > 0) return cat.products;

    return allProducts.filter((p) => {
      const pCatId = typeof p.category === 'object' ? p.category?._id : p.category;
      const pCatSlug = typeof p.category === 'object' ? p.category?.slug : null;
      return (
        (pCatId && cat._id && pCatId.toString() === cat._id.toString()) ||
        (pCatSlug && cat.slug && pCatSlug === cat.slug)
      );
    });
  };

  const displayProducts = featuredProducts.length > 0 ? featuredProducts : allProducts;

  return (
    <div className="space-y-4 overflow-x-clip pb-6 sm:space-y-8 sm:pb-8">
      {/* 1. Hero */}
      <Hero />

      {/* 2. Trust & features bar */}
      <section className={SECTION}>
        <div className="rounded-2xl bg-white p-2 shadow-xl sm:rounded-3xl sm:p-4 sm:shadow-2xl">
          <div className="grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-4">
            {FEATURES.map(({ icon: Icon, title, text, tone }) => (
              <div
                key={title}
                className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 p-2.5 sm:items-start sm:gap-3 sm:rounded-2xl sm:p-5"
              >
                <div className={`shrink-0 rounded-lg p-1.5 sm:rounded-xl sm:p-2.5 ${tone}`}>
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-[11px] font-bold leading-tight text-slate-800 sm:text-sm">{title}</h3>
                  <p className="mt-0.5 hidden text-[11px] text-slate-500 sm:block">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Categories */}
      {(loading || categories.length > 0) && (
        <section className={`${SECTION} relative z-20`}>
          <div className="relative rounded-2xl border border-slate-100 bg-white p-2.5 shadow-sm sm:rounded-3xl sm:p-4">
            {loading ? (
              <div className="flex items-center gap-3 overflow-x-auto py-1 scrollbar-hide sm:gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex min-w-[72px] animate-pulse flex-col items-center gap-2 sm:min-w-[88px]">
                    <div className="h-16 w-16 rounded-full bg-slate-100 sm:h-24 sm:w-24" />
                    <div className="h-3 w-12 rounded bg-slate-100" />
                  </div>
                ))}
              </div>
            ) : (
              /* Scrolls sideways on mobile, dropdowns work from md up */
              <div className="-mx-1 flex snap-x items-start gap-3 overflow-x-auto px-1 py-1 scrollbar-hide sm:gap-4 md:mx-0 md:items-center md:justify-between md:overflow-visible md:px-0">
                {categories.slice(0, 6).map((cat, idx) => {
                  const categoryProducts = getCategoryProducts(cat);
                  const isOpen = openDropdownId === cat._id;
                  const alignClass =
                    idx === 0 ? 'left-0' : idx >= 4 ? 'right-0' : 'left-1/2 -translate-x-1/2';

                  return (
                    <div
                      key={cat._id}
                      className="category-dropdown-group group relative flex w-[72px] shrink-0 snap-start flex-col items-center gap-1.5 sm:w-auto sm:min-w-[88px] sm:gap-2 md:shrink"
                      onMouseEnter={() => setOpenDropdownId(cat._id)}
                      onMouseLeave={() => setOpenDropdownId(null)}
                    >
                      {/* Category circle */}
                      <Link
                        to={`/catalog?category=${cat.slug}`}
                        className="block h-16 w-16 overflow-hidden rounded-full border-2 border-transparent bg-slate-50 p-0.5 shadow-sm transition-all duration-300 group-hover:border-purple-200 group-hover:shadow-md sm:h-24 sm:w-24 sm:border-4 sm:p-1"
                      >
                        {cat.image ? (
                          <img
                            src={cat.image}
                            alt={cat.name}
                            loading="lazy"
                            className="h-full w-full rounded-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center rounded-full bg-purple-50 text-lg font-bold text-purple-600">
                            {cat.name?.charAt(0) || 'C'}
                          </div>
                        )}
                      </Link>

                      {/* Name + dropdown trigger */}
                      <div className="relative flex w-full items-center justify-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenDropdownId(isOpen ? null : cat._id);
                          }}
                          aria-expanded={isOpen}
                          className="flex max-w-full items-center gap-1 rounded-lg px-1 py-0.5 text-[11px] font-bold text-slate-700 transition-colors hover:bg-purple-50/60 group-hover:text-purple-600 sm:px-1.5 sm:text-sm"
                        >
                          <span className="max-w-[72px] truncate sm:max-w-[115px]">{cat.name}</span>
                          <ChevronDown
                            className={`hidden h-3.5 w-3.5 shrink-0 transition-transform duration-200 md:block ${
                              isOpen ? 'rotate-180 text-purple-600' : 'text-slate-400 group-hover:text-purple-600'
                            }`}
                          />
                        </button>

                        {/* Dropdown (hidden on mobile, where it would be clipped by the scroll area) */}
                        {isOpen && (
                          <div className={`absolute top-full z-50 hidden w-56 pt-1.5 md:block ${alignClass}`}>
                            <div className="overflow-hidden rounded-xl border border-slate-100 bg-white py-1.5 shadow-2xl">
                              {categoryProducts.length > 0 ? (
                                <>
                                  {categoryProducts.slice(0, 6).map((prod) => (
                                    <Link
                                      key={prod._id || prod.slug}
                                      to={`/product/${prod.slug}`}
                                      onClick={() => setOpenDropdownId(null)}
                                      title={prod.name}
                                      className="block truncate px-3.5 py-1.5 text-left text-xs font-semibold text-slate-700 transition-colors hover:bg-purple-50 hover:text-purple-600"
                                    >
                                      {prod.name}
                                    </Link>
                                  ))}
                                  <div className="mt-1 border-t border-slate-100 pt-1">
                                    <Link
                                      to={`/catalog?category=${cat.slug}`}
                                      onClick={() => setOpenDropdownId(null)}
                                      className="block px-3.5 py-1.5 text-left text-[11px] font-bold text-purple-600 transition-colors hover:bg-purple-50 hover:text-purple-700"
                                    >
                                      View all in {cat.name} &rarr;
                                    </Link>
                                  </div>
                                </>
                              ) : (
                                <Link
                                  to={`/catalog?category=${cat.slug}`}
                                  onClick={() => setOpenDropdownId(null)}
                                  className="block px-3.5 py-1.5 text-left text-xs font-semibold text-slate-700 transition-colors hover:bg-purple-50 hover:text-purple-600"
                                >
                                  Explore {cat.name} &rarr;
                                </Link>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* View all */}
                <div className="flex shrink-0 snap-start items-center self-start pr-1 pt-4 sm:pt-6 md:self-center md:pt-0">
                  <Link
                    to="/catalog"
                    className="group inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-purple-50 px-3 py-2 text-xs font-bold text-purple-600 shadow-sm transition-colors hover:bg-purple-100 hover:text-purple-700 sm:px-4 sm:py-2.5 sm:text-sm"
                  >
                    <span>View All</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Promo banner */}
      <div className={SECTION}>
        <PromoBanner />
      </div>

      {/* 4. Best sellers */}
      {(loading || displayProducts.length > 0) && (
        <section className={`${SECTION} space-y-4 sm:space-y-8`}>
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <span className="mb-0.5 block text-[11px] font-bold uppercase tracking-wider text-amber-400 sm:mb-1 sm:text-xs">
                Top Customer Favorites
              </span>
              <h2 className="text-xl font-black leading-tight tracking-tight text-white sm:text-3xl">
                Best Selling Print Products
              </h2>
            </div>
            <Link
              to="/catalog"
              className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-xs font-bold text-slate-400 transition-colors hover:text-white sm:text-sm"
            >
              <span>
                <span className="hidden sm:inline">Browse Full Catalog</span>
                <span className="sm:hidden">See all</span>
              </span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:gap-6 lg:grid-cols-4">
            {loading
              ? [...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse space-y-3 rounded-2xl border border-slate-800/90 bg-slate-900/70 p-3 sm:p-4"
                  >
                    <div className="aspect-[4/3] rounded-xl bg-slate-800" />
                    <div className="h-4 w-3/4 rounded bg-slate-800" />
                    <div className="h-3 w-1/2 rounded bg-slate-800" />
                  </div>
                ))
              : displayProducts.slice(0, 4).map((prod) => (
                  <Link
                    key={prod._id}
                    to={`/product/${prod.slug}`}
                    className="group flex min-w-0 flex-col justify-between rounded-xl border border-slate-800/90 bg-slate-900/70 p-2 shadow-lg shadow-slate-950/40 transition-all duration-300 hover:-translate-y-1 hover:border-slate-600 hover:shadow-xl sm:rounded-2xl sm:p-4"
                  >
                    <div>
                      <div className="relative mb-2 aspect-[4/3] overflow-hidden rounded-lg bg-slate-950 sm:mb-4 sm:rounded-xl">
                        {prod.images?.[0] ? (
                          <img
                            src={prod.images[0]}
                            alt={prod.name}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-slate-800 text-slate-500">
                            <Printer className="h-8 w-8" />
                          </div>
                        )}
                        {prod.isBestSeller && (
                          <span className="absolute left-1.5 top-1.5 rounded bg-gradient-to-r from-amber-500 to-orange-500 px-1.5 py-0.5 text-[8px] font-black uppercase text-white shadow-md sm:left-2 sm:top-2 sm:rounded-md sm:px-2 sm:text-[10px]">
                            Best Seller
                          </span>
                        )}
                      </div>

                      <h3 className="line-clamp-2 text-xs font-bold leading-snug text-white transition-colors group-hover:text-purple-300 sm:line-clamp-1 sm:text-base">
                        {prod.name}
                      </h3>
                      {prod.description && (
                        <p className="mt-1 hidden line-clamp-2 text-xs text-slate-400 sm:block">
                          {prod.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-2 flex items-center justify-between gap-1 border-t border-slate-800/80 pt-2 sm:mt-4 sm:pt-3">
                      <div className="min-w-0">
                        <span className="block text-[9px] font-bold uppercase text-slate-400 sm:text-[10px]">
                          From
                        </span>
                        <span className="block truncate text-sm font-black text-white sm:text-lg">₹{prod.basePrice}</span>
                      </div>
                      <span className="shrink-0 rounded-lg border border-slate-700 bg-slate-800 px-2 py-1 text-[10px] font-bold text-slate-300 transition-colors group-hover:border-purple-500 group-hover:bg-purple-600 group-hover:text-white sm:rounded-xl sm:px-3 sm:py-1.5 sm:text-xs">
                        Configure<span className="hidden sm:inline"> &rarr;</span>
                      </span>
                    </div>
                  </Link>
                ))}
          </div>
        </section>
      )}

      {/* ColorLex Creation: Custom Photo Frames Scroll-Stacking Showcase (5 Full-Screen 100svh Sections) */}
      <PhotoFrameShowcase />

      {/* 5. How it works */}
      <section className={SECTION}>
        <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-xl sm:space-y-6 sm:rounded-3xl sm:p-10">
          <div className="mx-auto max-w-2xl space-y-1.5 text-center sm:space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400 sm:text-xs">
              Seamless Ordering Experience
            </span>
            <h2 className="text-xl font-black tracking-tight text-white sm:text-3xl">How ColorLex Works</h2>
            <p className="text-xs text-slate-300 sm:text-sm">
              From your initial concept to precision delivery, we ensure 100% satisfaction at every stage.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-6 sm:pt-2 lg:grid-cols-4">
            {STEPS.map(({ no, title, text, tone }) => (
              <div
                key={no}
                className="flex items-start gap-3 rounded-xl border border-slate-800/80 bg-slate-950/60 p-3.5 sm:block sm:space-y-2 sm:rounded-2xl sm:p-4"
              >
                <span className={`shrink-0 text-2xl font-black leading-none ${tone}`}>{no}</span>
                <div className="min-w-0 space-y-1 sm:space-y-2">
                  <h3 className="text-sm font-bold text-white sm:text-base">{title}</h3>
                  <p className="text-xs leading-relaxed text-slate-400">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Custom design CTA */}
      <section className={SECTION}>
        <div className="relative overflow-hidden rounded-2xl border border-purple-800/50 bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 p-4 shadow-2xl shadow-purple-950/40 sm:rounded-3xl sm:p-10 md:p-12">
          {/* Artwork is hidden on mobile so it never sits behind the text */}
        <picture>
        <source media="(max-width: 768px)" srcSet={mobCreative} />
        <img
          src={creative}
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-bottom opacity-30 md:opacity-100 md:object-contain md:object-right"
        />
      </picture>

          <div className="pointer-events-none absolute inset-0 opacity-20">
            <div className="absolute right-0 top-0 h-56 w-56 -translate-y-1/2 translate-x-1/2 rounded-full bg-purple-500 blur-3xl sm:h-80 sm:w-80" />
            <div className="absolute bottom-0 left-0 h-48 w-48 -translate-x-1/2 translate-y-1/2 rounded-full bg-indigo-500 blur-3xl sm:h-64 sm:w-64" />
          </div>

          <div className="relative z-10 max-w-2xl space-y-3 sm:space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-900/60 px-3 py-1 text-[11px] font-bold text-purple-300 sm:text-xs">
              <Sparkles className="h-3.5 w-3.5 text-purple-400" />
              <span>In-House Prepress & Design Desk</span>
            </div>

            <h2 className="text-xl font-black leading-tight tracking-tight text-white sm:text-3xl md:text-4xl">
              Don't Have Print-Ready Artwork? We've Got You Covered!
            </h2>

            <p className="text-xs leading-relaxed text-slate-300 sm:text-sm">
              Submit your rough concept, logo, text, or photos to our design specialists. We will compose custom
              artwork and send you digital proofs for online approval before we print a single page.
            </p>

            <div className="flex flex-col gap-2.5 pt-1 sm:flex-row sm:items-center sm:gap-3 sm:pt-2">
              <Link
                to="/custom-design"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-black text-slate-950 shadow-lg transition-all hover:-translate-y-0.5 hover:bg-slate-100 active:translate-y-0 sm:px-6 sm:py-3.5"
              >
                <Sparkles className="h-4 w-4 text-purple-600" />
                <span>Submit Custom Design Request</span>
              </Link>

              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900/80 px-5 py-3 text-sm font-bold text-slate-200 transition-all hover:border-slate-600 hover:bg-slate-800 hover:text-white sm:py-3.5"
              >
                <span>Talk to Print Specialist</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}