import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Sparkles, Upload, ShoppingBag, Layers, Star, CheckCircle2, ShieldCheck, Truck,
  MessageCircle, Eye, ArrowRight, ThumbsUp, ChevronRight
} from 'lucide-react';
import { apiFetch } from '../services/api';
import { useCart } from '../context/CartContext';

/* Same shared horizontal margin as Home and Services. Change it in all three together. */
const SECTION = 'mx-8';

/* Shared look for selectable option buttons */
const optionClass = (selected) =>
  `rounded-xl border text-left transition-all ${
    selected
      ? 'border-purple-500 bg-purple-600/20 text-white shadow-md shadow-purple-600/20'
      : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700 hover:text-white'
  }`;

const PANEL = 'rounded-3xl border border-slate-800/90 bg-slate-900/70 shadow-xl';
const LABEL = 'block text-xs font-bold uppercase tracking-wider text-slate-300';

// Default rich product data fallback for instant load of photo-frame-printing
const PHOTO_FRAME_SEED = {
  _id: 'prod_photo_frame_01',
  name: 'Premium Handcrafted Photo Frames',
  slug: 'photo-frame-printing',
  sku: 'CLX-PH-004',
  category: { name: 'Photo Printing', slug: 'photo-printing' },
  description:
    'Transform your cherished memories into museum-grade framed artwork. Featuring crystal-clear shatterproof acrylic glass, precision-cut wooden frames, and 300 DPI archival luster photo printing. Perfect for wall galleries, tabletop displays, and memorable gifts.',
  images: [
    '/images/banner-6.png',
    'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1000&q=80'
  ],
  isFeatured: true,
  isBestSeller: true,
  basePrice: 299,
  variants: {
    sizes: [
      { name: '4" x 6" (Desk / Tabletop)', priceModifier: 0, dimensions: '10 x 15 cm' },
      { name: '5" x 7" (Classic Portrait)', priceModifier: 100, dimensions: '13 x 18 cm' },
      { name: '6" x 8" (Compact Wall/Desk)', priceModifier: 180, dimensions: '15 x 20 cm' },
      { name: '8" x 10" (Standard Wall Frame)', priceModifier: 300, dimensions: '20 x 25 cm' },
      { name: '10" x 12" (Showcase Portrait)', priceModifier: 450, dimensions: '25 x 30 cm' },
      { name: '12" x 16" (Large Gallery Frame)', priceModifier: 700, dimensions: '30 x 40 cm' }
    ],
    materials: [
      { name: 'Matte Charcoal Black Wood', priceModifier: 0, colorCode: '#1e293b' },
      { name: 'Warm Teak Natural Oak', priceModifier: 50, colorCode: '#b45309' },
      { name: 'Pure Gallery White', priceModifier: 30, colorCode: '#f8fafc' },
      { name: 'Luxury Royal Walnut', priceModifier: 80, colorCode: '#451a03' },
      { name: 'Modern Floating Acrylic', priceModifier: 150, colorCode: '#38bdf8' }
    ],
    finishes: [
      { name: 'Ultra-HD Glossy + Crystal Glass', priceModifier: 0, desc: 'Vibrant punchy colors with high-gloss reflection' },
      { name: 'Velvet Matte + Anti-Glare Glass', priceModifier: 60, desc: 'Soft-touch glare-free viewing under any indoor light' },
      { name: 'Textured Canvas Print (Framed)', priceModifier: 120, desc: 'Museum cotton canvas with deep rich texture' }
    ]
  },
  bulkPricing: [
    { minQty: 1, discountPercentage: 0, pricePerUnit: 299 },
    { minQty: 2, discountPercentage: 10, pricePerUnit: 269 },
    { minQty: 3, discountPercentage: 15, pricePerUnit: 254 },
    { minQty: 5, discountPercentage: 20, pricePerUnit: 239 },
    { minQty: 10, discountPercentage: 30, pricePerUnit: 209 }
  ],
  turnaroundOptions: [
    { name: 'Standard Delivery (2-3 Business Days)', extraFee: 0, estimatedDays: '2-3 Days' },
    { name: 'Express Rush Delivery (24 Hours)', extraFee: 149, estimatedDays: '1 Day' }
  ],
  specifications: [
    { key: 'Frame Profile', value: '1-Inch Solid Eco-Wood with Precision Mitered Corners' },
    { key: 'Front Protection', value: '2mm Shatter-Resistant Anti-Glare Acrylic Glass' },
    { key: 'Print Paper', value: '300 DPI 280 GSM Archival Luster Photo Paper' },
    { key: 'Backing System', value: 'MDF Back with Kickstand & Dual Hanging Hooks' },
    { key: 'Orientation', value: 'Supports both Horizontal & Vertical Display' },
    { key: 'Packaging', value: 'Shock-Absorbing Multi-Layer Bubble Wrap in Heavy Box' }
  ],
  rating: 4.9,
  reviewCount: 128,
  reviews: [
    { id: 'rev_1', author: 'Aarav Mehta', rating: 5, date: '2 days ago', verified: true, sizePurchased: '12" x 16" (Large Gallery Frame)', framePurchased: 'Warm Teak Natural Oak', comment: 'The frame quality exceeded my expectations! The teak wood texture is rich, and the 300 DPI print clarity brought our wedding photo to life. Highly recommend ColorLex!' },
    { id: 'rev_2', author: 'Sneha Patel', rating: 5, date: '1 week ago', verified: true, sizePurchased: '8" x 10" (Standard Wall Frame)', framePurchased: 'Matte Charcoal Black Wood', comment: 'Ordered via WhatsApp because I needed help resizing and retouching an old family portrait. The ColorLex design team sent me a digital proof within 2 hours. Super impressed!' },
    { id: 'rev_3', author: 'Vikram Sengupta', rating: 5, date: '2 weeks ago', verified: true, sizePurchased: '5" x 7" (Classic Portrait)', framePurchased: 'Pure Gallery White', comment: 'Bought 3 frames as gifts. Packed extremely securely, zero scratches on the glass. Anti-glare finish looks very premium on my desk.' },
    { id: 'rev_4', author: 'Ananya Sharma', rating: 5, date: '3 weeks ago', verified: true, sizePurchased: '10" x 12" (Showcase Portrait)', framePurchased: 'Luxury Royal Walnut', comment: 'Sturdy build and the matte finish looks gorgeous against our gallery wall. The WhatsApp design support for proof approval was flawless.' }
  ]
};

const GALLERY = [
  { src: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80', alt: 'Teak Desktop Frame', title: 'Desktop & Tabletop (5" x 7" & 6" x 8")', text: 'Dual-angle kickstand for office tables and bedside stands.' },
  { src: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80', alt: 'Living Room Wall Gallery', title: 'Living Room Wall Grid (8" x 10" & 10" x 12")', text: 'Symmetrical wall collage with seamless hanging hooks.' },
  { src: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=600&q=80', alt: 'Large Statement Frame', title: 'Statement Artwork (12" x 16")', text: 'Centerpiece framing with anti-glare acrylic protection.' }
];

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // Variant selections
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [selectedFinish, setSelectedFinish] = useState('');
  const [selectedTurnaround, setSelectedTurnaround] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Artwork & Design
  const [artworkOption, setArtworkOption] = useState('we_make_design'); // 'upload' | 'we_make_design'
  const [artworkFileUrl, setArtworkFileUrl] = useState('');
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [customInstructions] = useState('');

  const [priceCalculation, setPriceCalculation] = useState(null);
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const suggestionsRef = useRef(null);

  const initProductData = (prod) => {
    setProduct(prod);
    setSelectedSize(prod.variants?.sizes?.[0]?.name || '');
    setSelectedMaterial(prod.variants?.materials?.[0]?.name || '');
    setSelectedFinish(prod.variants?.finishes?.[0]?.name || '');
    setSelectedTurnaround(prod.turnaroundOptions?.[0]?.name || '');
    setQuantity(1);
    setActiveImageIdx(0);
  };

  // Fetch product, falling back to seed data only for the photo frame slug
  useEffect(() => {
    let cancelled = false;
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await apiFetch(`/products/${slug}`);
        if (cancelled) return;
        if (res?.success && res.data) initProductData(res.data);
        else if (slug === PHOTO_FRAME_SEED.slug) initProductData(PHOTO_FRAME_SEED);
        else setProduct(null);
      } catch (err) {
        if (cancelled) return;
        if (slug === PHOTO_FRAME_SEED.slug) initProductData(PHOTO_FRAME_SEED);
        else setProduct(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchProduct();
    return () => { cancelled = true; };
  }, [slug]);

  // Live price calculation
  useEffect(() => {
    if (!product) return;

    const basePrice = product.basePrice || 299;
    const sizeMod = product.variants?.sizes?.find((s) => s.name === selectedSize)?.priceModifier || 0;
    const matMod = product.variants?.materials?.find((m) => m.name === selectedMaterial)?.priceModifier || 0;
    const finMod = product.variants?.finishes?.find((f) => f.name === selectedFinish)?.priceModifier || 0;
    const turnFee = product.turnaroundOptions?.find((t) => t.name === selectedTurnaround)?.extraFee || 0;

    const unitBase = basePrice + sizeMod + matMod + finMod;

    let discountPct = 0;
    if (product.bulkPricing?.length > 0) {
      const sorted = [...product.bulkPricing].sort((a, b) => b.minQty - a.minQty);
      const match = sorted.find((t) => quantity >= t.minQty);
      if (match) discountPct = match.discountPercentage || 0;
    }

    const discountedUnit = unitBase * (1 - discountPct / 100);
    const subtotal = discountedUnit * quantity;

    setPriceCalculation({
      rawUnitPrice: unitBase,
      finalUnitPrice: Number(discountedUnit.toFixed(2)),
      discountPercentage: discountPct,
      turnaroundFee: turnFee,
      subtotal: Number(subtotal.toFixed(2)),
      totalPrice: Number((subtotal + turnFee).toFixed(2))
    });
  }, [product, selectedSize, selectedMaterial, selectedFinish, selectedTurnaround, quantity]);

  // Fetch suggested products
  useEffect(() => {
    if (!product) return;
    let cancelled = false;

    const fetchSuggestions = async () => {
      try {
        const res = await apiFetch('/products');
        if (cancelled || !res?.success || !Array.isArray(res.data)) return;

        const catId = (p) => (typeof p.category === 'object' ? p.category?._id : p.category);
        const currentCatId = catId(product);
        const isSame = (p) => catId(p) && currentCatId && catId(p).toString() === currentCatId.toString();

        const others = res.data.filter((p) => p._id !== product._id && p.slug !== product.slug);
        setSuggestedProducts([...others.filter(isSame), ...others.filter((p) => !isSame(p))].slice(0, 6));
      } catch (err) {
        console.error('Failed to fetch suggestions:', err);
      }
    };

    fetchSuggestions();
    return () => { cancelled = true; };
  }, [product]);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFile(true);
    setUploadedFileName(file.name);
    setTimeout(() => {
      setArtworkFileUrl(`https://colorlex-cdn.com/artwork-uploads/${file.name}`);
      setUploadingFile(false);
    }, 800);
  };

  const handleAddToCart = () => {
    if (!product || !priceCalculation) return;
    addToCart({
      product: product._id,
      title: product.name,
      variantSelections: {
        size: selectedSize,
        material: selectedMaterial,
        finish: selectedFinish,
        turnaround: selectedTurnaround,
        artworkMode: artworkOption,
        instructions: customInstructions
      },
      quantity,
      unitPrice: priceCalculation.finalUnitPrice,
      calculatedPrice: priceCalculation.totalPrice,
      artworkUrl: artworkOption === 'upload' ? artworkFileUrl : 'COLORLEX_IN_HOUSE_DESIGN'
    });
    navigate('/cart');
  };

  const handleWhatsAppDesignOrder = () => {
    const phone = '917735249873';
    const message = encodeURIComponent(
      `👋 Hello ColorLex Creation!\n\nI want to order: *${product.name}*\n` +
        `• Size: ${selectedSize}\n` +
        `• Frame Material: ${selectedMaterial}\n` +
        `• Finish: ${selectedFinish}\n` +
        `• Quantity: ${quantity} Unit(s)\n` +
        `• Estimated Price: ₹${priceCalculation?.totalPrice || product.basePrice}\n\n` +
        `🎨 I need your team to *make the custom design/photo retouching* for me.\nPlease let me know how to send my photos!`
    );
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  if (loading) {
    return (
      <div className={`${SECTION} space-y-3 py-24 text-center text-slate-400`}>
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
        <p className="text-sm font-semibold">Loading product configurator...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={`${SECTION} space-y-4 py-24 text-center text-slate-400`}>
        <h2 className="text-xl font-bold text-white">Product Not Found</h2>
        <Link to="/catalog" className="inline-block text-sm font-semibold text-purple-400 underline">
          Return to Print Catalog
        </Link>
      </div>
    );
  }

  const reviews = product.reviews || PHOTO_FRAME_SEED.reviews;

  return (
    <div className="space-y-6 pb-8 pt-6 sm:space-y-8 sm:pt-8">
      {/* Breadcrumb */}
      <nav className={`${SECTION} flex min-w-0 items-center gap-2 text-xs font-semibold text-slate-400`}>
        <Link to="/" className="shrink-0 transition-colors hover:text-white">Home</Link>
        <ChevronRight className="h-3.5 w-3.5 shrink-0" />
        <Link to="/catalog" className="shrink-0 transition-colors hover:text-white">Catalog</Link>
        <ChevronRight className="h-3.5 w-3.5 shrink-0" />
        <span className="min-w-0 truncate text-purple-400">{product.name}</span>
      </nav>

      {/* Main configurator grid */}
      <section className={`${SECTION} grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-10`}>
        {/* Left: gallery & specs */}
        <div className="space-y-5 sm:space-y-6 lg:col-span-5">
          <div className="group relative overflow-hidden rounded-3xl border border-slate-800/90 bg-slate-900 shadow-2xl">
            <div className="relative aspect-[4/3] overflow-hidden bg-slate-950">
              <img
                src={product.images?.[activeImageIdx] || '/images/banner-6.png'}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
              <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                <span className="rounded-lg bg-purple-600/90 px-2.5 py-1 text-[9px] font-black uppercase text-white shadow-md backdrop-blur-md sm:text-[10px]">
                  Premium Photo Frame
                </span>
                <span className="rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-2.5 py-1 text-[9px] font-black uppercase text-white shadow-md sm:text-[10px]">
                  300 DPI Archival Print
                </span>
              </div>
            </div>
          </div>

          {product.images?.length > 1 && (
            <div className="space-y-2">
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                Sample Views ({product.images.length})
              </span>
              <div className="grid grid-cols-4 gap-2.5">
                {product.images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIdx(idx)}
                    className={`relative aspect-[4/3] overflow-hidden rounded-xl border-2 transition-all ${
                      activeImageIdx === idx
                        ? 'border-purple-500 shadow-md shadow-purple-500/30'
                        : 'border-slate-800 opacity-70 hover:border-slate-700 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt={`Sample ${idx + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.specifications?.length > 0 && (
            <div className={`${PANEL} space-y-3 p-4 sm:p-5`}>
              <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
                <Layers className="h-4 w-4 text-purple-400" />
                <span>Specifications & Materials</span>
              </h3>
              <div className="divide-y divide-slate-800/80 text-xs">
                {product.specifications.map((sp, idx) => (
                  <div key={idx} className="flex flex-col gap-0.5 py-2.5 sm:flex-row sm:justify-between sm:gap-3">
                    <span className="shrink-0 text-slate-400">{sp.key}</span>
                    <span className="font-semibold text-slate-200 sm:text-right">{sp.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-3 text-xs min-[400px]:grid-cols-2">
            <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-slate-300">
              <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-400" />
              <span>Shatter-Resistant Glass</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-slate-300">
              <Truck className="h-4 w-4 shrink-0 text-purple-400" />
              <span>Safe Transit Packing</span>
            </div>
          </div>
        </div>

        {/* Right: title & configurator */}
        <div className="min-w-0 space-y-5 sm:space-y-6 lg:col-span-7">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-xs font-bold text-white">{product.rating || 4.9}</span>
              <span className="text-xs text-slate-400">({product.reviewCount || 128} verified reviews)</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl">{product.name}</h1>
            <p className="text-xs leading-relaxed text-slate-300 sm:text-sm">{product.description}</p>
          </div>

          <div className={`${PANEL} space-y-6 p-4 sm:p-7`}>
            {/* 1. Size */}
            {product.variants?.sizes?.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className={LABEL}>1. Choose Frame Size</span>
                  <span className="shrink-0 text-[11px] font-semibold text-purple-400">
                    {product.variants.sizes.length} sizes
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                  {product.variants.sizes.map((s) => (
                    <button
                      key={s.name}
                      type="button"
                      onClick={() => setSelectedSize(s.name)}
                      className={`${optionClass(selectedSize === s.name)} p-3`}
                    >
                      <span className="block text-xs font-bold">{s.name}</span>
                      {s.dimensions && <span className="mt-0.5 block text-[10px] text-slate-400">{s.dimensions}</span>}
                      <span className="mt-1 block text-[11px] font-extrabold text-purple-400">
                        {s.priceModifier === 0 ? 'Base Price' : `+₹${s.priceModifier}`}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Material */}
            {product.variants?.materials?.length > 0 && (
              <div className="space-y-2.5">
                <span className={LABEL}>2. Frame Finish & Material</span>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {product.variants.materials.map((m) => (
                    <button
                      key={m.name}
                      type="button"
                      onClick={() => setSelectedMaterial(m.name)}
                      className={`${optionClass(selectedMaterial === m.name)} flex items-center justify-between gap-2 p-3`}
                    >
                      <span className="flex min-w-0 items-center gap-2.5">
                        {m.colorCode && (
                          <span
                            className="h-4 w-4 shrink-0 rounded-full border border-white/20"
                            style={{ backgroundColor: m.colorCode }}
                          />
                        )}
                        <span className="truncate text-xs font-bold">{m.name}</span>
                      </span>
                      {m.priceModifier > 0 && (
                        <span className="shrink-0 text-[10px] font-bold text-purple-400">+₹{m.priceModifier}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Finish */}
            {product.variants?.finishes?.length > 0 && (
              <div className="space-y-2.5">
                <span className={LABEL}>3. Glass & Print Finish</span>
                <div className="space-y-2">
                  {product.variants.finishes.map((f) => (
                    <button
                      key={f.name}
                      type="button"
                      onClick={() => setSelectedFinish(f.name)}
                      className={`${optionClass(selectedFinish === f.name)} flex w-full items-center justify-between gap-2 p-3`}
                    >
                      <span className="min-w-0">
                        <span className="block text-xs font-bold">{f.name}</span>
                        {f.desc && <span className="mt-0.5 block text-[11px] text-slate-400">{f.desc}</span>}
                      </span>
                      {f.priceModifier > 0 && (
                        <span className="shrink-0 text-xs font-bold text-purple-400">+₹{f.priceModifier}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Quantity */}
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className={LABEL}>4. Select Quantity</span>
                {priceCalculation?.discountPercentage > 0 && (
                  <span className="rounded-lg border border-emerald-500/40 bg-emerald-950/80 px-2 py-0.5 text-[11px] font-bold text-emerald-400">
                    Bulk Savings: {priceCalculation.discountPercentage}% OFF
                  </span>
                )}
              </div>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 5, 10].map((qty) => (
                  <button
                    key={qty}
                    type="button"
                    onClick={() => setQuantity(qty)}
                    className={`rounded-xl border py-2.5 text-center text-xs font-extrabold transition-all ${
                      quantity === qty
                        ? 'border-purple-500 bg-purple-600 text-white shadow-md shadow-purple-600/40'
                        : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    {qty}
                    <span className="hidden sm:inline"> {qty === 1 ? 'Frame' : 'Frames'}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Artwork */}
            <div className="space-y-3 border-t border-slate-800/80 pt-4">
              <span className={LABEL}>5. Photo & Design Arrangement</span>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setArtworkOption('we_make_design')}
                  className={`${optionClass(artworkOption === 'we_make_design')} space-y-1 p-3.5`}
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-400" />
                    <span className="text-xs font-bold">We Make The Design</span>
                  </span>
                  <span className="block text-[11px] leading-snug text-slate-400">
                    Send photos via WhatsApp or upload a rough idea; our artists handle cropping, layout & lighting.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setArtworkOption('upload')}
                  className={`${optionClass(artworkOption === 'upload')} space-y-1 p-3.5`}
                >
                  <span className="flex items-center gap-2">
                    <Upload className="h-4 w-4 text-blue-400" />
                    <span className="text-xs font-bold">I Have Ready Photo File</span>
                  </span>
                  <span className="block text-[11px] leading-snug text-slate-400">
                    Upload your high-res JPG, PNG, or PDF file ready for direct printing.
                  </span>
                </button>
              </div>

              {artworkOption === 'upload' && (
                <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-950 p-4 text-center">
                  <input
                    type="file"
                    id="artwork-input"
                    accept=".jpg,.jpeg,.png,.pdf,.tiff"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="artwork-input"
                    className="inline-flex max-w-full cursor-pointer items-center gap-2 rounded-xl border border-purple-800/60 bg-purple-950/60 px-4 py-2 text-xs font-bold text-purple-400 transition-all hover:text-purple-300"
                  >
                    <Upload className="h-4 w-4 shrink-0" />
                    <span className="min-w-0 truncate">
                      {uploadingFile
                        ? 'Uploading photo...'
                        : uploadedFileName
                        ? `Attached: ${uploadedFileName}`
                        : 'Choose Photo From Device'}
                    </span>
                  </label>
                  <p className="text-[10px] text-slate-400">Supports JPG, PNG up to 50MB</p>
                </div>
              )}

              {artworkOption === 'we_make_design' && (
                <div className="space-y-1.5 rounded-xl border border-purple-500/30 bg-purple-950/40 p-3.5 text-xs text-purple-200">
                  <div className="flex items-center gap-1.5 font-bold text-white">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                    <span>Free Color & Lighting Enhancement Included</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-300">
                    Finalize the order here or use the <strong>WhatsApp button</strong> below to chat with our design
                    team. We send a free digital proof before printing.
                  </p>
                </div>
              )}
            </div>

            {/* Price & actions */}
            <div className="space-y-4 border-t border-slate-800 pt-4">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <span className="block text-[11px] font-bold uppercase text-slate-400">Total Amount</span>
                  <div className="flex flex-wrap items-baseline gap-x-2 text-2xl font-black text-white sm:text-3xl">
                    <span>₹{priceCalculation?.totalPrice || product.basePrice}</span>
                    {priceCalculation && (
                      <span className="text-xs font-normal text-slate-400">
                        (₹{priceCalculation.finalUnitPrice} / frame)
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-[11px] text-slate-400">Includes all taxes & proofing</span>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3.5 text-sm font-extrabold text-white shadow-xl shadow-purple-600/30 transition-all hover:-translate-y-0.5 hover:from-purple-500 hover:to-indigo-500 active:translate-y-0"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>Add to Cart</span>
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppDesignOrder}
                  title="Chat directly on WhatsApp to design and order"
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-emerald-400/40 bg-emerald-600 px-5 py-3.5 text-sm font-extrabold text-white shadow-xl shadow-emerald-950/40 transition-all hover:-translate-y-0.5 hover:bg-emerald-500 active:translate-y-0"
                >
                  <MessageCircle className="h-4 w-4 fill-white" />
                  <span>Order on WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer gallery */}
      <section className={`${SECTION} space-y-6`}>
        <div className="mx-auto max-w-2xl space-y-2 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Real Customer Displays</span>
          <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
            How People Style Their ColorLex Frames
          </h2>
          <p className="text-xs text-slate-300 sm:text-sm">
            From modern gallery walls to desktop keepsakes, see real customer layouts across different sizes.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3 sm:gap-6">
          {GALLERY.map((g) => (
            <div key={g.alt} className="space-y-3 rounded-2xl border border-slate-800/90 bg-slate-900/70 p-3 shadow-lg shadow-slate-950/40 sm:p-4">
              <div className="aspect-[4/3] overflow-hidden rounded-xl bg-slate-950">
                <img
                  src={g.src}
                  alt={g.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="px-1">
                <h3 className="text-sm font-bold text-white">{g.title}</h3>
                <p className="mt-0.5 text-xs text-slate-400">{g.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section className={`${SECTION} space-y-6`}>
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end sm:gap-4">
          <div>
            <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-amber-400">
              Customer Feedback
            </span>
            <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">Verified Customer Reviews</h2>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 self-start rounded-2xl border border-slate-800/90 bg-slate-900/70 px-4 py-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-sm font-black text-white">{product.rating || 4.9} out of 5</span>
            <span className="text-xs text-slate-400">({reviews.length} verified)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3.5 sm:gap-6 md:grid-cols-2">
          {reviews.map((rev, idx) => (
            <div
              key={rev.id || idx}
              className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-800/90 bg-slate-900/70 p-4 shadow-lg shadow-slate-950/40 sm:p-5"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-white">{rev.author}</span>
                    {rev.verified && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-950/80 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Verified Buyer</span>
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400">{rev.date}</span>
                </div>

                <div className="flex items-center gap-1">
                  {[...Array(rev.rating || 5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {rev.sizePurchased && (
                  <div className="text-[11px] font-medium text-purple-300">
                    Purchased: <span className="font-semibold text-white">{rev.sizePurchased}</span>
                    {rev.framePurchased && <span> • {rev.framePurchased}</span>}
                  </div>
                )}

                <p className="text-xs leading-relaxed text-slate-300 sm:text-sm">{rev.comment}</p>
              </div>

              <div className="flex items-center justify-between border-t border-slate-800/80 pt-2.5 text-[11px] text-slate-400">
                <span className="inline-flex items-center gap-1">
                  <ThumbsUp className="h-3 w-3" />
                  <span>Helpful review</span>
                </span>
                <span>ColorLex Print Studio</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* You may also like */}
      {suggestedProducts.length > 0 && (
        <section className={`${SECTION} space-y-6`}>
          <div className="flex items-end justify-between gap-4">
            <div>
              <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-purple-400">
                More From ColorLex
              </span>
              <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">You May Also Like</h2>
              <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                Explore other premium print products curated for you.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => suggestionsRef.current?.scrollBy({ left: -320, behavior: 'smooth' })}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-300 transition-all hover:border-purple-500 hover:text-white"
                aria-label="Scroll left"
              >
                <ArrowRight className="h-4 w-4 rotate-180" />
              </button>
              <button
                type="button"
                onClick={() => suggestionsRef.current?.scrollBy({ left: 320, behavior: 'smooth' })}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-300 transition-all hover:border-purple-500 hover:text-white"
                aria-label="Scroll right"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div ref={suggestionsRef} className="scrollbar-hide flex gap-3.5 overflow-x-auto scroll-smooth pb-2 sm:gap-5">
            {suggestedProducts.map((sp) => {
              const catName = typeof sp.category === 'object' ? sp.category?.name : '';
              const heroImage = sp.images?.[0] || '/images/banner-6.png';

              return (
                <Link
                  key={sp._id || sp.slug}
                  to={`/product/${sp.slug}`}
                  className="group relative flex w-[72%] shrink-0 flex-col overflow-hidden rounded-2xl border border-slate-800/90 bg-slate-900/70 shadow-lg shadow-slate-950/40 transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/60 hover:shadow-xl sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-950">
                    <img
                      src={heroImage}
                      alt={sp.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                    {catName && (
                      <span className="absolute left-2.5 top-2.5 max-w-[60%] truncate rounded-md bg-purple-600/90 px-2 py-0.5 text-[9px] font-black uppercase text-white shadow-sm backdrop-blur-md">
                        {catName}
                      </span>
                    )}
                    {sp.isBestSeller && (
                      <span className="absolute right-2.5 top-2.5 rounded-md bg-gradient-to-r from-amber-500 to-orange-500 px-2 py-0.5 text-[9px] font-black uppercase text-white shadow-sm">
                        Best Seller
                      </span>
                    )}

                    {/* Hover overlay (desktop only) */}
                    <div className="absolute inset-0 hidden items-center justify-center bg-purple-900/40 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 md:flex">
                      <span className="flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-xs font-extrabold text-slate-900 shadow-lg">
                        <Eye className="h-3.5 w-3.5" />
                        <span>View Product</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col justify-between gap-2 p-3 sm:p-4">
                    <div>
                      <h3 className="line-clamp-2 text-sm font-bold leading-snug text-white transition-colors group-hover:text-purple-300">
                        {sp.name}
                      </h3>
                      {sp.description && (
                        <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-slate-400">{sp.description}</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-800/80 pt-2.5">
                      <div>
                        <span className="block text-[10px] font-bold uppercase text-slate-400">Starting at</span>
                        <span className="text-base font-black text-white">₹{sp.basePrice ?? '—'}</span>
                      </div>
                      <span className="flex h-7 w-7 items-center justify-center rounded-full border border-purple-500/40 bg-purple-600/20 text-purple-400 transition-all group-hover:bg-purple-600 group-hover:text-white">
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}