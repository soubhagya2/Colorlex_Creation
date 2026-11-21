import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search, ChevronRight, Printer, Image, Layers, Tag, Star, Award, BookOpen,
  Gift, Scissors, Palette, BookMarked, X, Sparkles,
} from 'lucide-react';
import { apiFetch } from '../services/api';

/* Same horizontal margin as Home and Footer */
const WRAP = 'mx-8';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=400&q=80';

/* One place for each category's icon and color */
const CATEGORY_META = {
  'Business Printing':            { icon: Printer,    color: 'purple' },
  'Marketing & Promotional':      { icon: Layers,     color: 'blue' },
  'Wedding & Event Printing':     { icon: Sparkles,   color: 'pink' },
  'Photo Printing':               { icon: Image,      color: 'amber' },
  'Large Format Printing':        { icon: Tag,        color: 'emerald' },
  'Signs & Display':              { icon: Award,      color: 'cyan' },
  'Stickers & Labels':            { icon: Tag,        color: 'orange' },
  'School & College Printing':    { icon: BookOpen,   color: 'indigo' },
  'Personalized Gifts':           { icon: Gift,       color: 'rose' },
  'Laser Cutting & Engraving':    { icon: Scissors,   color: 'red' },
  'Graphic Design Services':      { icon: Palette,    color: 'violet' },
  'Finishing & Binding Services': { icon: BookMarked, color: 'slate' },
};

/* Dark-theme tints: translucent backgrounds with light text */
const COLOR_CLASSES = {
  purple:  { bg: 'bg-purple-500/10',  text: 'text-purple-300',  border: 'border-purple-500/30',  badge: 'bg-purple-500/20 text-purple-200' },
  blue:    { bg: 'bg-blue-500/10',    text: 'text-blue-300',    border: 'border-blue-500/30',    badge: 'bg-blue-500/20 text-blue-200' },
  pink:    { bg: 'bg-pink-500/10',    text: 'text-pink-300',    border: 'border-pink-500/30',    badge: 'bg-pink-500/20 text-pink-200' },
  amber:   { bg: 'bg-amber-500/10',   text: 'text-amber-300',   border: 'border-amber-500/30',   badge: 'bg-amber-500/20 text-amber-200' },
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-300', border: 'border-emerald-500/30', badge: 'bg-emerald-500/20 text-emerald-200' },
  cyan:    { bg: 'bg-cyan-500/10',    text: 'text-cyan-300',    border: 'border-cyan-500/30',    badge: 'bg-cyan-500/20 text-cyan-200' },
  orange:  { bg: 'bg-orange-500/10',  text: 'text-orange-300',  border: 'border-orange-500/30',  badge: 'bg-orange-500/20 text-orange-200' },
  indigo:  { bg: 'bg-indigo-500/10',  text: 'text-indigo-300',  border: 'border-indigo-500/30',  badge: 'bg-indigo-500/20 text-indigo-200' },
  rose:    { bg: 'bg-rose-500/10',    text: 'text-rose-300',    border: 'border-rose-500/30',    badge: 'bg-rose-500/20 text-rose-200' },
  red:     { bg: 'bg-red-500/10',     text: 'text-red-300',     border: 'border-red-500/30',     badge: 'bg-red-500/20 text-red-200' },
  violet:  { bg: 'bg-violet-500/10',  text: 'text-violet-300',  border: 'border-violet-500/30',  badge: 'bg-violet-500/20 text-violet-200' },
  slate:   { bg: 'bg-slate-500/10',   text: 'text-slate-300',   border: 'border-slate-500/30',   badge: 'bg-slate-500/20 text-slate-200' },
};

const getMeta = (name) => CATEGORY_META[name] || { icon: Printer, color: 'slate' };
const getColor = (name) => COLOR_CLASSES[getMeta(name).color];

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const selectedCategory = searchParams.get('category') || '';
  const urlSearch = searchParams.get('search') || '';
  const [searchTerm, setSearchTerm] = useState(urlSearch);
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || '');
  const [onlyBestSellers, setOnlyBestSellers] = useState(searchParams.get('bestSeller') === 'true');

  /* Keep searchTerm in sync with URL query param (e.g. from navbar navigation or browser history) */
  useEffect(() => {
    setSearchTerm(urlSearch);
  }, [urlSearch]);

  /* Categories: load once */
  useEffect(() => {
    let ignore = false;
    apiFetch('/categories')
      .then((res) => {
        if (ignore || !res?.success) return;
        setCategories([...res.data].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)));
      })
      .catch((err) => console.error(err));
    return () => {
      ignore = true;
    };
  }, []);

  /* Products: reload when filters change */
  useEffect(() => {
    let ignore = false;

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCategory) params.set('category', selectedCategory);
        if (urlSearch) params.set('search', urlSearch);
        if (sortBy) params.set('sort', sortBy);
        if (onlyBestSellers) params.set('bestSeller', 'true');
        const qs = params.toString();

        const res = await apiFetch(`/products${qs ? `?${qs}` : ''}`);
        if (!ignore && res?.success) setProducts(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchProducts();
    return () => {
      ignore = true;
    };
  }, [selectedCategory, urlSearch, sortBy, onlyBestSellers]);

  const handleCategorySelect = (slug) => {
    const nextParams = new URLSearchParams(searchParams);
    if (slug) {
      nextParams.set('category', slug);
    } else {
      nextParams.delete('category');
    }
    setSearchParams(nextParams);
  };

  const handleSearchChange = (val) => {
    setSearchTerm(val);
    const nextParams = new URLSearchParams(searchParams);
    if (val.trim()) {
      nextParams.set('search', val);
    } else {
      nextParams.delete('search');
    }
    setSearchParams(nextParams, { replace: true });
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSortBy('');
    setOnlyBestSellers(false);
    setSearchParams({});
  };

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return products;
    return products.filter((p) => {
      const nameMatch = p.name?.toLowerCase().includes(term);
      const descMatch = p.description?.toLowerCase().includes(term);
      const catMatch = (typeof p.category === 'object' ? p.category?.name : '')?.toLowerCase().includes(term);
      const skuMatch = p.sku?.toLowerCase().includes(term);
      const specMatch = p.specifications?.some(
        (s) => s.value?.toLowerCase().includes(term) || s.key?.toLowerCase().includes(term)
      );
      const variantMatch =
        p.variants?.materials?.some((m) => m.name?.toLowerCase().includes(term)) ||
        p.variants?.sizes?.some((s) => s.name?.toLowerCase().includes(term)) ||
        p.variants?.finishes?.some((f) => f.name?.toLowerCase().includes(term));

      return nameMatch || descMatch || catMatch || skuMatch || specMatch || variantMatch;
    });
  }, [products, searchTerm]);

  const selectedCategoryName = categories.find((c) => c.slug === selectedCategory)?.name || '';

  return (
    <div className={`${WRAP} py-6 sm:py-10`}>
      {/* Header */}
      <div className="mb-6 space-y-2 sm:mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-400">
          <Printer className="h-3.5 w-3.5" />
          <span>Full Service Print Studio</span>
        </div>
        <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl md:text-4xl">
          Printing Services Catalog
        </h1>
        <p className="max-w-2xl text-xs text-slate-400 sm:text-sm">
          {loading ? 'Loading services…' : `${filteredProducts.length} services available`} — browse by
          category, search by name, or configure your product for live pricing.
        </p>
      </div>

      <div className="flex gap-8">
        {/* Sidebar (desktop) */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24 space-y-1 rounded-2xl border border-slate-800/90 bg-slate-900/70 p-4 shadow-lg shadow-slate-950/40">
            <p className="mb-3 px-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Service Categories
            </p>

            <button
              type="button"
              onClick={() => handleCategorySelect('')}
              className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
                !selectedCategory
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-950/50'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Layers className="h-4 w-4 shrink-0" />
              All Services
            </button>

            {categories.map((cat) => {
              const { icon: Icon } = getMeta(cat.name);
              const color = getColor(cat.name);
              const active = selectedCategory === cat.slug;

              return (
                <button
                  type="button"
                  key={cat._id}
                  onClick={() => handleCategorySelect(cat.slug)}
                  className={`flex w-full items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left text-sm font-semibold transition-all ${
                    active
                      ? `${color.bg} ${color.text} ${color.border}`
                      : 'border-transparent text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${active ? color.text : 'text-slate-500'}`} />
                  <span className="truncate text-xs">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Main content */}
        <div className="min-w-0 flex-1 space-y-4 sm:space-y-6">
          {/* Filter bar */}
          <div className="space-y-3 rounded-2xl border border-slate-800/90 bg-slate-900/70 p-3 shadow-lg shadow-slate-950/40">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search services, products, materials..."
                className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 pl-10 pr-9 text-sm text-slate-200 placeholder-slate-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => handleSearchChange('')}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Options */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <label className="flex cursor-pointer items-center gap-2 whitespace-nowrap text-xs font-semibold text-slate-300">
                <input
                  type="checkbox"
                  checked={onlyBestSellers}
                  onChange={(e) => setOnlyBestSellers(e.target.checked)}
                  className="rounded border-slate-600 bg-slate-950 text-purple-600 [color-scheme:dark] focus:ring-purple-500 focus:ring-offset-slate-900"
                />
                <Star className="h-3.5 w-3.5 text-amber-400" />
                Best Sellers
              </label>

              {selectedCategory && (
                <div className="flex items-center gap-1.5 rounded-xl border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 text-xs font-semibold text-purple-300">
                  <span className="max-w-[140px] truncate">{selectedCategoryName}</span>
                  <button
                    type="button"
                    onClick={() => handleCategorySelect('')}
                    aria-label="Remove category filter"
                    className="shrink-0 hover:text-white"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort products"
                className="ml-auto rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold text-slate-200 [color-scheme:dark] focus:border-purple-500 focus:outline-none"
              >
                <option value="">Sort: Featured</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name">Name A–Z</option>
              </select>
            </div>
          </div>

          {/* Category chips (mobile and tablet) */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide lg:hidden">
            <button
              type="button"
              onClick={() => handleCategorySelect('')}
              className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 py-2 text-xs font-bold transition-all ${
                !selectedCategory
                  ? 'border-purple-600 bg-purple-600 text-white'
                  : 'border-slate-700 bg-slate-900/70 text-slate-300 hover:border-slate-500 hover:text-white'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              All
            </button>

            {categories.map((cat) => {
              const { icon: Icon } = getMeta(cat.name);
              const active = selectedCategory === cat.slug;
              return (
                <button
                  type="button"
                  key={cat._id}
                  onClick={() => handleCategorySelect(cat.slug)}
                  className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 py-2 text-xs font-bold transition-all ${
                    active
                      ? 'border-purple-600 bg-purple-600 text-white'
                      : 'border-slate-700 bg-slate-900/70 text-slate-300 hover:border-slate-500 hover:text-white'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {cat.name}
                </button>
              );
            })}
          </div>

          {/* Product grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3">
            {loading ? (
              Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse overflow-hidden rounded-2xl border border-slate-800/90 bg-slate-900/70"
                >
                  <div className="aspect-[4/3] bg-slate-800" />
                  <div className="space-y-3 p-3 sm:p-4">
                    <div className="h-4 w-3/4 rounded bg-slate-800" />
                    <div className="hidden h-3 w-full rounded bg-slate-800 sm:block" />
                    <div className="flex items-center justify-between pt-2">
                      <div className="h-5 w-16 rounded bg-slate-800" />
                      <div className="h-8 w-8 rounded-xl bg-slate-800" />
                    </div>
                  </div>
                </div>
              ))
            ) : filteredProducts.length === 0 ? (
              <div className="col-span-full space-y-4 py-16 text-center text-slate-400 sm:py-20">
                <Printer className="mx-auto h-12 w-12 text-slate-600" />
                <div className="space-y-1">
                  <p className="text-base font-bold text-slate-200">No products found</p>
                  <p className="text-xs text-slate-400">
                    {searchTerm ? (
                      <>
                        No items matching &ldquo;
                        <span className="font-semibold text-purple-300">{searchTerm}</span>
                        &rdquo;
                        {selectedCategoryName ? ` in "${selectedCategoryName}"` : ''}.
                      </>
                    ) : (
                      'No products available in this selection.'
                    )}
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  {selectedCategory && (
                    <button
                      type="button"
                      onClick={() => handleCategorySelect('')}
                      className="rounded-xl border border-purple-500/30 bg-purple-500/10 px-3.5 py-1.5 text-xs font-semibold text-purple-300 hover:bg-purple-500/20"
                    >
                      Search across all categories
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white"
                  >
                    Reset all filters
                  </button>
                </div>
              </div>
            ) : (
              filteredProducts.map((prod) => {
                const catName = prod.category?.name || '';
                const { icon: CatIcon } = getMeta(catName);
                const color = getColor(catName);
                const minBulk = prod.bulkPricing?.reduce(
                  (min, t) => (t.pricePerUnit && t.pricePerUnit < min ? t.pricePerUnit : min),
                  prod.basePrice
                );
                const hasBulkDiscount = prod.bulkPricing?.some((t) => t.discountPercentage > 0);
                const sizes = prod.variants?.sizes || [];

                return (
                  <Link
                    key={prod._id}
                    to={`/product/${prod.slug}`}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-slate-800/90 bg-slate-900/70 shadow-lg shadow-slate-950/40 transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/60 hover:shadow-xl hover:shadow-purple-950/40"
                  >
                    {/* Image */}
                    <div className="relative aspect-[4/3] shrink-0 overflow-hidden bg-slate-950">
                      <img
                        src={prod.images?.[0] || FALLBACK_IMAGE}
                        alt={prod.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {catName && (
                        <div
                          className={`absolute left-2 top-2 hidden items-center gap-1 rounded-lg px-2 py-0.5 text-[10px] font-bold backdrop-blur-md sm:flex ${color.badge}`}
                        >
                          <CatIcon className="h-3 w-3" />
                          <span className="max-w-[120px] truncate">{catName}</span>
                        </div>
                      )}

                      {prod.isBestSeller && (
                        <span className="absolute right-2 top-2 flex items-center gap-1 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-1.5 py-0.5 text-[9px] font-extrabold uppercase text-white shadow-md sm:px-2 sm:text-[10px]">
                          <Star className="h-2.5 w-2.5" />
                          <span className="hidden sm:inline">Best Seller</span>
                          <span className="sm:hidden">Best</span>
                        </span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
                      <h3 className="line-clamp-2 text-xs font-bold leading-snug text-white transition-colors group-hover:text-purple-300 sm:text-sm">
                        {prod.name}
                      </h3>

                      <p className="hidden flex-1 line-clamp-2 text-[11px] leading-relaxed text-slate-400 sm:block">
                        {prod.description}
                      </p>

                      {sizes.length > 0 && (
                        <div className="hidden flex-wrap gap-1 sm:flex">
                          {sizes.slice(0, 2).map((s) => (
                            <span
                              key={s.name}
                              className="max-w-[80px] truncate rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-semibold text-slate-300"
                            >
                              {s.name.split(' ')[0]}
                            </span>
                          ))}
                          {sizes.length > 2 && (
                            <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">
                              +{sizes.length - 2} more
                            </span>
                          )}
                        </div>
                      )}

                      <div className="mt-auto flex items-end justify-between gap-2 border-t border-slate-800/80 pt-2.5">
                        <div className="min-w-0">
                          <span className="mb-0.5 block text-[9px] font-bold uppercase leading-none text-slate-400 sm:text-[10px]">
                            Starting from
                          </span>
                          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
                            <span className="text-base font-black leading-none text-white sm:text-lg">
                              ₹{minBulk || prod.basePrice}
                            </span>
                            {hasBulkDiscount && (
                              <span className="hidden rounded border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-300 sm:inline">
                                Bulk Savings
                              </span>
                            )}
                          </div>
                        </div>

                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border transition-all group-hover:border-purple-500 group-hover:bg-purple-600 group-hover:text-white ${color.bg} ${color.text} ${color.border}`}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>

          {!loading && filteredProducts.length > 0 && (
            <p className="pt-2 text-center text-xs text-slate-500 sm:pt-4">
              Showing {filteredProducts.length} service{filteredProducts.length !== 1 ? 's' : ''}
              {selectedCategoryName ? ` in "${selectedCategoryName}"` : ''}
              {searchTerm ? ` matching "${searchTerm}"` : ''}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}