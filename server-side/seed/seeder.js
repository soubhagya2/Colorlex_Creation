import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';
import CMS from '../models/CMS.js';
import Order from '../models/Order.js';
import DesignRequest from '../models/DesignRequest.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

// ─── Cloudinary fetch helper ──────────────────────────────────────────────────
const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || 'e5gwgkw9';
const cld = (url, w = 800) =>
  `https://res.cloudinary.com/${CLOUD_NAME}/image/fetch/f_auto,q_auto,w_${w}/${encodeURIComponent(url)}`;

// ─── Stock image library ──────────────────────────────────────────────────────
const IMG = {
  // Business Printing
  visitingCard:    cld('https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&w=800&q=80'),
  visitingCard2:   cld('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80'),
  letterhead:      cld('https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&w=800&q=80'),
  envelope:        cld('https://images.unsplash.com/photo-1569097360710-bec2da70bfe5?auto=format&fit=crop&w=800&q=80'),
  idCard:          cld('https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=800&q=80'),
  certificate:     cld('https://images.unsplash.com/photo-1606761568499-6d2451b23c66?auto=format&fit=crop&w=800&q=80'),

  // Marketing & Promotional
  flyer:           cld('https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=800&q=80'),
  brochure:        cld('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80'),
  poster:          cld('https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80'),
  standee:         cld('https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=800&q=80'),

  // Wedding & Event
  invitation:      cld('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80'),

  // Photo Printing
  photoprint:      cld('https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=800&q=80'),
  photoframe:      cld('https://images.unsplash.com/photo-1580128660010-fd027e1e587a?auto=format&fit=crop&w=800&q=80'),
  canvas:          cld('https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?auto=format&fit=crop&w=800&q=80'),

  // Large Format
  flex:            cld('https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80'),
  vinyl:           cld('https://images.unsplash.com/photo-1612838320302-4b3b3996e3a6?auto=format&fit=crop&w=800&q=80'),
  banner:          cld('https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?auto=format&fit=crop&w=800&q=80'),
  wallGraphics:    cld('https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80'),

  // Signs & Display
  acrylicSign:     cld('https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=800&q=80'),
  signboard:       cld('https://images.unsplash.com/photo-1563461660947-507ef49e9c47?auto=format&fit=crop&w=800&q=80'),
  ledSign:         cld('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'),
  pvcSign:         cld('https://images.unsplash.com/photo-1567604130959-7cdbb6de0e4c?auto=format&fit=crop&w=800&q=80'),

  // Stickers & Labels
  sticker:         cld('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'),

  // School & College
  studentId:       cld('https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80'),

  // Personalized Gifts
  tshirt:          cld('https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'),
  mug:             cld('https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=800&q=80'),
  cushion:         cld('https://images.unsplash.com/photo-1540746122696-dab30bd63f09?auto=format&fit=crop&w=800&q=80'),
  keychain:        cld('https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=800&q=80'),
  mobilecover:     cld('https://images.unsplash.com/photo-1601972599720-36938d4ecd31?auto=format&fit=crop&w=800&q=80'),
  hoodie:          cld('https://images.unsplash.com/photo-1556821840-3a63f15732ce?auto=format&fit=crop&w=800&q=80'),

  // Laser Cutting
  laserWedding:    cld('https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80'),
  laserEngraving:  cld('https://images.unsplash.com/photo-1558877385-da38e8e0ba76?auto=format&fit=crop&w=800&q=80'),

  // Graphic Design
  logoDesign:      cld('https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80'),
  designServices:  cld('https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=800&q=80'),

  // Finishing
  binding:         cld('https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=800&q=80'),
  lamination:      cld('https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&w=800&q=80'),
};

// ─── Bulk pricing helper ───────────────────────────────────────────────────────
const bulkTiers = (p1, p100, p500, p1000) => [
  { minQty: 1,    discountPercentage: 0,  pricePerUnit: p1    },
  { minQty: 100,  discountPercentage: 0,  pricePerUnit: p100  },
  { minQty: 500,  discountPercentage: 15, pricePerUnit: p500  },
  { minQty: 1000, discountPercentage: 25, pricePerUnit: p1000 },
];

const smallBulk = (p1, p10, p50, p100) => [
  { minQty: 1,  discountPercentage: 0,  pricePerUnit: p1   },
  { minQty: 10, discountPercentage: 0,  pricePerUnit: p10  },
  { minQty: 50, discountPercentage: 10, pricePerUnit: p50  },
  { minQty: 100,discountPercentage: 20, pricePerUnit: p100 },
];

const singleItem = (price) => [{ minQty: 1, discountPercentage: 0, pricePerUnit: price }];

const stdTurnaround = [
  { name: 'Standard (2-3 Business Days)', extraFee: 0,   estimatedDays: '2-3 Days' },
  { name: 'Express (24 Hours)',            extraFee: 150, estimatedDays: '1 Day'    },
];

const largeTurnaround = [
  { name: 'Standard (3-5 Business Days)', extraFee: 0,   estimatedDays: '3-5 Days' },
  { name: 'Rush (48 Hours)',               extraFee: 300, estimatedDays: '2 Days'   },
];

const slug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const sku  = (prefix, n) => `CLX-${prefix}-${String(n).padStart(3, '0')}`;

// ─── Main Seeder ──────────────────────────────────────────────────────────────
const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/printing';
    console.log('🔌 Connecting to MongoDB:', mongoUri);
    await mongoose.connect(mongoUri);

    // ─── Clear ────────────────────────────────────────────────────────────────
    console.log('🗑️  Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Product.deleteMany({}),
      Coupon.deleteMany({}),
      CMS.deleteMany({}),
      Order.deleteMany({}),
      DesignRequest.deleteMany({}),
    ]);

    // ─── Users ────────────────────────────────────────────────────────────────
    const salt = await bcrypt.genSalt(10);
    const admin    = await User.create({ name: 'Super Admin',  email: 'admin@colorlex.com',    password: await bcrypt.hash('admin123',    salt), role: 'super_admin', phone: '+91 98765 00001' });
    const staff    = await User.create({ name: 'Priya Staff',  email: 'staff@colorlex.com',    password: await bcrypt.hash('staff123',    salt), role: 'staff',       phone: '+91 98765 00002' });
    const customer = await User.create({
      name: 'Rahul Sharma', email: 'customer@colorlex.com',
      password: await bcrypt.hash('customer123', salt),
      role: 'customer', phone: '+91 98765 00003',
      addresses: [{ street: '45 MG Road', city: 'Bengaluru', state: 'Karnataka', zipCode: '560001', country: 'India', isDefault: true }]
    });
    console.log('✅ Users seeded');

    // ─── Categories ───────────────────────────────────────────────────────────
    const catDefs = [
      { name: 'Business Printing',               description: 'Visiting cards, letterheads, envelopes, ID cards & office stationery for corporate needs.',      image: IMG.visitingCard,  isFeatured: true  },
      { name: 'Marketing & Promotional',         description: 'Flyers, brochures, posters and standees for impactful marketing campaigns.',                     image: IMG.flyer,         isFeatured: true  },
      { name: 'Wedding & Event Printing',        description: 'Elegant invitation cards and event stationery for weddings and special occasions.',               image: IMG.invitation,    isFeatured: true  },
      { name: 'Photo Printing',                  description: 'High-quality photo prints, frames, canvases and professional photo editing services.',            image: IMG.photoprint,    isFeatured: true  },
      { name: 'Large Format Printing',           description: 'Flex, vinyl, banners and display printing for outdoor advertising and hoardings.',                image: IMG.banner,        isFeatured: true  },
      { name: 'Signs & Display',                 description: 'Acrylic signs, ACP boards, PVC displays, LED & glow sign boards for shops and offices.',          image: IMG.acrylicSign,   isFeatured: true  },
      { name: 'Stickers & Labels',               description: 'Paper, vinyl, transparent, waterproof and reflective stickers for every purpose.',                image: IMG.sticker,       isFeatured: false },
      { name: 'School & College Printing',       description: 'Student ID cards, admit cards, certificates and mark sheets for educational institutions.',       image: IMG.studentId,     isFeatured: false },
      { name: 'Personalized Gifts',              description: 'Custom t-shirts, mugs, cushions, phone covers and photo gifts for every occasion.',               image: IMG.tshirt,        isFeatured: true  },
      { name: 'Laser Cutting & Engraving',       description: 'Precision laser cut decorations, wedding props, name cutouts and custom engraving services.',    image: IMG.laserWedding,  isFeatured: false },
      { name: 'Graphic Design Services',         description: 'Logo design, brand identity, brochure, flyer, social media and photo editing services.',          image: IMG.logoDesign,    isFeatured: false },
      { name: 'Finishing & Binding Services',    description: 'Glossy & matte lamination, spiral, soft and hard binding services for all print projects.',       image: IMG.binding,       isFeatured: false },
    ];

    const catDocs = await Category.insertMany(
      catDefs.map((c, index) => ({ ...c, slug: slug(c.name), displayOrder: index + 1 }))
    );
    const C = {};
    catDocs.forEach(c => { C[c.name] = c._id; });
    console.log('✅ Categories seeded:', catDocs.length);

    // ─── Products ─────────────────────────────────────────────────────────────
    const products = [];

    // ════════════════════════════════════════════════════════════
    // 1. BUSINESS PRINTING
    // ════════════════════════════════════════════════════════════

    // 1.1 Visiting Cards
    products.push({
      name: 'Standard Visiting Card',
      slug: 'standard-visiting-card',
      sku: sku('BC', 1),
      category: C['Business Printing'],
      description: 'Classic 3.5" x 2" business cards on 300 GSM art paper with single or double-sided full-colour print. Sharp CMYK 300 DPI reproduction for a professional first impression.',
      images: [IMG.visitingCard, IMG.visitingCard2],
      isFeatured: true, isBestSeller: true,
      basePrice: 150,
      variants: {
        sizes: [{ name: '3.5" x 2" Standard', priceModifier: 0 }, { name: '2.5" x 2.5" Square', priceModifier: 30 }, { name: '3.5" x 1.5" Slim', priceModifier: 20 }],
        materials: [{ name: '300 GSM Art Paper', priceModifier: 0 }, { name: '350 GSM Matt Coated', priceModifier: 50 }, { name: '400 GSM Premium Board', priceModifier: 100 }],
        finishes: [{ name: 'Standard Matt Finish', priceModifier: 0 }, { name: 'Glossy UV Coating', priceModifier: 40 }, { name: 'Soft Touch Velvet', priceModifier: 80 }]
      },
      bulkPricing: bulkTiers(null, 150, 120, 100),
      turnaroundOptions: stdTurnaround,
      specifications: [{ key: 'Size', value: '3.5" x 2"' }, { key: 'Print', value: 'CMYK 300 DPI' }, { key: 'Bleed', value: '3mm Standard Bleed' }]
    });

    products.push({
      name: 'Premium Visiting Card',
      slug: 'premium-visiting-card',
      sku: sku('BC', 2),
      category: C['Business Printing'],
      description: 'Luxury business cards on extra-thick 450 GSM board with Spot UV highlights, embossed finishing and metallic foil accenting for a standout corporate identity.',
      images: [IMG.visitingCard2, IMG.visitingCard],
      isFeatured: true, isBestSeller: true,
      basePrice: 350,
      variants: {
        sizes: [{ name: '3.5" x 2" Standard', priceModifier: 0 }, { name: '2.5" x 2.5" Square', priceModifier: 50 }],
        materials: [{ name: '450 GSM Premium Board', priceModifier: 0 }, { name: '400 GSM Silk', priceModifier: -50 }],
        finishes: [{ name: 'Spot UV Raised Coating', priceModifier: 0 }, { name: 'Metallic Gold Foil', priceModifier: 100 }, { name: 'Hot Stamping + Emboss', priceModifier: 150 }]
      },
      bulkPricing: bulkTiers(null, 350, 280, 220),
      turnaroundOptions: stdTurnaround,
      specifications: [{ key: 'Thickness', value: '450 GSM Ultra Thick' }, { key: 'Finishing', value: 'Spot UV / Foil' }, { key: 'MOQ', value: '100 Cards' }]
    });

    products.push({
      name: 'Textured Visiting Card',
      slug: 'textured-visiting-card',
      sku: sku('BC', 3),
      category: C['Business Printing'],
      description: 'Tactile linen or canvas textured business cards that create a memorable sensory experience. Available in premium cotton paper and recycled kraft finishes.',
      images: [IMG.visitingCard],
      isFeatured: false, isBestSeller: false,
      basePrice: 280,
      variants: {
        sizes: [{ name: '3.5" x 2" Standard', priceModifier: 0 }],
        materials: [{ name: 'Linen Texture 350 GSM', priceModifier: 0 }, { name: 'Kraft Brown 300 GSM', priceModifier: -30 }, { name: 'Cotton Rag 400 GSM', priceModifier: 50 }],
        finishes: [{ name: 'Natural Uncoated', priceModifier: 0 }, { name: 'Satin Matte', priceModifier: 30 }]
      },
      bulkPricing: bulkTiers(null, 280, 230, 180),
      turnaroundOptions: stdTurnaround,
      specifications: [{ key: 'Texture', value: 'Linen / Canvas / Kraft' }, { key: 'Print Side', value: 'Single or Double' }]
    });

    // 1.2 Letterheads
    products.push({
      name: 'Standard Letterhead',
      slug: 'standard-letterhead',
      sku: sku('LH', 1),
      category: C['Business Printing'],
      description: 'A4 corporate letterhead on 90 GSM premium bond paper with full-colour CMYK header and footer printing for professional business correspondence.',
      images: [IMG.letterhead],
      isFeatured: false, isBestSeller: false,
      basePrice: 500,
      variants: {
        sizes: [{ name: 'A4 (210 x 297mm)', priceModifier: 0 }, { name: 'A5 (148 x 210mm)', priceModifier: -100 }],
        materials: [{ name: '90 GSM Bond Paper', priceModifier: 0 }, { name: '100 GSM Premium Writing', priceModifier: 80 }],
        finishes: [{ name: 'Single Side Print', priceModifier: 0 }, { name: 'Double Side Print', priceModifier: 150 }]
      },
      bulkPricing: [{ minQty: 100, discountPercentage: 0, pricePerUnit: 5 }, { minQty: 500, discountPercentage: 10, pricePerUnit: 4.5 }, { minQty: 1000, discountPercentage: 20, pricePerUnit: 4 }],
      turnaroundOptions: stdTurnaround,
      specifications: [{ key: 'Size', value: 'A4 / A5' }, { key: 'Paper', value: '90–100 GSM Bond' }, { key: 'Print', value: 'Full Colour CMYK' }]
    });

    products.push({
      name: 'Premium Letterhead',
      slug: 'premium-letterhead',
      sku: sku('LH', 2),
      category: C['Business Printing'],
      description: 'Executive-grade A4 letterhead on 120 GSM coated paper with Spot UV logo treatment for a superior corporate look.',
      images: [IMG.letterhead],
      isFeatured: false, isBestSeller: false,
      basePrice: 800,
      variants: {
        sizes: [{ name: 'A4 (210 x 297mm)', priceModifier: 0 }],
        materials: [{ name: '120 GSM Coated Paper', priceModifier: 0 }, { name: '160 GSM Premium Art', priceModifier: 150 }],
        finishes: [{ name: 'Spot UV Logo', priceModifier: 0 }, { name: 'Embossed Logo + Spot UV', priceModifier: 200 }]
      },
      bulkPricing: [{ minQty: 100, discountPercentage: 0, pricePerUnit: 8 }, { minQty: 500, discountPercentage: 15, pricePerUnit: 6.8 }],
      turnaroundOptions: stdTurnaround,
      specifications: [{ key: 'Paper', value: '120 GSM Coated' }, { key: 'Finish', value: 'Spot UV / Emboss' }]
    });

    // 1.3 Envelopes
    products.push({
      name: 'Standard Envelope',
      slug: 'standard-envelope',
      sku: sku('EN', 1),
      category: C['Business Printing'],
      description: 'DL and C5 self-sealing white envelopes in bulk quantities. Pre-cut, gummed flap with crisp folding for professional mailing.',
      images: [IMG.envelope],
      isFeatured: false, isBestSeller: false,
      basePrice: 200,
      variants: {
        sizes: [{ name: 'DL (110 x 220mm)', priceModifier: 0 }, { name: 'C5 (162 x 229mm)', priceModifier: 50 }, { name: 'C4 (229 x 324mm)', priceModifier: 100 }],
        materials: [{ name: '90 GSM White Bond', priceModifier: 0 }, { name: '100 GSM Ivory', priceModifier: 40 }],
        finishes: [{ name: 'Plain White', priceModifier: 0 }, { name: 'Single Colour Logo', priceModifier: 80 }]
      },
      bulkPricing: [{ minQty: 50, discountPercentage: 0, pricePerUnit: 4 }, { minQty: 200, discountPercentage: 10, pricePerUnit: 3.6 }, { minQty: 500, discountPercentage: 20, pricePerUnit: 3.2 }],
      turnaroundOptions: stdTurnaround,
      specifications: [{ key: 'Size', value: 'DL / C5 / C4' }, { key: 'Seal', value: 'Self-Gummed Flap' }]
    });

    products.push({
      name: 'Custom Printed Envelope',
      slug: 'custom-printed-envelope',
      sku: sku('EN', 2),
      category: C['Business Printing'],
      description: 'Full-colour custom printed envelopes with brand logo, return address and design. Available in multiple sizes and premium paper stocks.',
      images: [IMG.envelope],
      isFeatured: false, isBestSeller: false,
      basePrice: 350,
      variants: {
        sizes: [{ name: 'DL (110 x 220mm)', priceModifier: 0 }, { name: 'C5 (162 x 229mm)', priceModifier: 80 }, { name: 'A4 Open (320 x 230mm)', priceModifier: 120 }],
        materials: [{ name: '100 GSM White Wove', priceModifier: 0 }, { name: '120 GSM Kraft Brown', priceModifier: 30 }],
        finishes: [{ name: 'Full Colour CMYK Print', priceModifier: 0 }, { name: 'CMYK + Inside Print', priceModifier: 100 }]
      },
      bulkPricing: [{ minQty: 50, discountPercentage: 0, pricePerUnit: 7 }, { minQty: 200, discountPercentage: 10, pricePerUnit: 6.3 }, { minQty: 500, discountPercentage: 20, pricePerUnit: 5.6 }],
      turnaroundOptions: stdTurnaround,
      specifications: [{ key: 'Print', value: 'Full Colour CMYK' }, { key: 'Inside Print', value: 'Optional' }]
    });

    // 1.5 Office Stationery
    products.push({
      name: 'Employee ID Card',
      slug: 'employee-id-card',
      sku: sku('ID', 1),
      category: C['Business Printing'],
      description: 'Double-sided full colour employee ID cards on premium 760 micron white PVC. Includes slot punch and optional lamination. Photo-accurate printing.',
      images: [IMG.idCard],
      isFeatured: false, isBestSeller: false,
      basePrice: 25,
      variants: {
        sizes: [{ name: 'CR80 Standard (85.6 x 54mm)', priceModifier: 0 }],
        materials: [{ name: '760 Micron White PVC', priceModifier: 0 }, { name: 'Frosted PVC', priceModifier: 5 }],
        finishes: [{ name: 'Glossy Laminate', priceModifier: 0 }, { name: 'Matte Laminate', priceModifier: 2 }, { name: 'Hologram Overlay', priceModifier: 8 }]
      },
      bulkPricing: smallBulk(25, 22, 18, 15),
      turnaroundOptions: stdTurnaround,
      specifications: [{ key: 'Material', value: '760 Micron PVC' }, { key: 'Size', value: 'CR80 85.6 x 54mm' }, { key: 'Print', value: 'Double Sided CMYK' }]
    });

    products.push({
      name: 'PVC ID Card',
      slug: 'pvc-id-card',
      sku: sku('ID', 2),
      category: C['Business Printing'],
      description: 'Heavy duty PVC ID cards with magnetic stripe, barcode and QR code options. Suitable for access control, membership and loyalty cards.',
      images: [IMG.idCard],
      isFeatured: false, isBestSeller: false,
      basePrice: 35,
      variants: {
        sizes: [{ name: 'CR80 Standard', priceModifier: 0 }],
        materials: [{ name: 'Standard White PVC', priceModifier: 0 }, { name: 'Hi-Co Magnetic Stripe PVC', priceModifier: 15 }],
        finishes: [{ name: 'Glossy', priceModifier: 0 }, { name: 'Barcode / QR Code Print', priceModifier: 5 }]
      },
      bulkPricing: smallBulk(35, 30, 25, 20),
      turnaroundOptions: stdTurnaround,
      specifications: [{ key: 'Options', value: 'Magnetic Stripe, Barcode, QR' }, { key: 'Material', value: 'Heavy Duty PVC' }]
    });

    products.push({
      name: 'Certificate Printing',
      slug: 'certificate-printing',
      sku: sku('CT', 1),
      category: C['Business Printing'],
      description: 'Premium A4 certificates on 200 GSM art paper with gold border design. Suitable for awards, achievement recognition and corporate events.',
      images: [IMG.certificate],
      isFeatured: false, isBestSeller: false,
      basePrice: 20,
      variants: {
        sizes: [{ name: 'A4 (210 x 297mm)', priceModifier: 0 }, { name: 'A3 (297 x 420mm)', priceModifier: 15 }],
        materials: [{ name: '200 GSM Art Paper', priceModifier: 0 }, { name: '250 GSM Premium Board', priceModifier: 10 }],
        finishes: [{ name: 'Standard Print', priceModifier: 0 }, { name: 'Gold Foil Border', priceModifier: 20 }, { name: 'Embossed Seal', priceModifier: 30 }]
      },
      bulkPricing: smallBulk(20, 17, 14, 12),
      turnaroundOptions: stdTurnaround,
      specifications: [{ key: 'Paper', value: '200–250 GSM Art Paper' }, { key: 'Design', value: 'Custom or Template Available' }]
    });

    // ════════════════════════════════════════════════════════════
    // 2. MARKETING & PROMOTIONAL PRINTING
    // ════════════════════════════════════════════════════════════

    products.push({
      name: 'A4 Flyer Printing',
      slug: 'a4-flyer-printing',
      sku: sku('FL', 1),
      category: C['Marketing & Promotional'],
      description: 'Vibrant A4 full-colour flyers on 130 GSM glossy art paper. Perfect for promotions, product launches, events and restaurant menus. CMYK 300 DPI print quality.',
      images: [IMG.flyer],
      isFeatured: true, isBestSeller: true,
      basePrice: 400,
      variants: {
        sizes: [{ name: 'A4 (210 x 297mm)', priceModifier: 0 }, { name: 'A5 (148 x 210mm)', priceModifier: -100 }, { name: 'A6 (105 x 148mm)', priceModifier: -150 }, { name: 'DL (99 x 210mm)', priceModifier: -80 }],
        materials: [{ name: '130 GSM Gloss Art', priceModifier: 0 }, { name: '150 GSM Matt Coated', priceModifier: 80 }, { name: '170 GSM Gloss', priceModifier: 120 }],
        finishes: [{ name: 'Single Side', priceModifier: 0 }, { name: 'Double Side', priceModifier: 150 }]
      },
      bulkPricing: bulkTiers(null, 400, 320, 260),
      turnaroundOptions: stdTurnaround,
      specifications: [{ key: 'Paper', value: '130–170 GSM Gloss Art' }, { key: 'Bleed', value: '3mm' }, { key: 'Color', value: 'Full Colour CMYK' }]
    });

    products.push({
      name: 'Leaflet & Promotional Leaflet',
      slug: 'leaflet-promotional',
      sku: sku('FL', 2),
      category: C['Marketing & Promotional'],
      description: 'Compact promotional leaflets for door-to-door campaigns, retail promotions and event handouts. Available folded or flat in DL and A5 sizes.',
      images: [IMG.flyer],
      isFeatured: false, isBestSeller: false,
      basePrice: 300,
      variants: {
        sizes: [{ name: 'DL Flat (99 x 210mm)', priceModifier: 0 }, { name: 'A5 Flat (148 x 210mm)', priceModifier: 80 }, { name: 'DL Tri-Folded', priceModifier: 50 }],
        materials: [{ name: '115 GSM Gloss', priceModifier: 0 }, { name: '130 GSM Silk', priceModifier: 50 }],
        finishes: [{ name: 'Single Side', priceModifier: 0 }, { name: 'Double Side', priceModifier: 100 }]
      },
      bulkPricing: bulkTiers(null, 300, 240, 200),
      turnaroundOptions: stdTurnaround,
      specifications: [{ key: 'Fold Options', value: 'Flat / Tri-Fold / Roll-Fold' }]
    });

    products.push({
      name: 'Bi-Fold Brochure',
      slug: 'bi-fold-brochure',
      sku: sku('BR', 1),
      category: C['Marketing & Promotional'],
      description: 'A4 bi-fold (A5 finished) full-colour brochures on premium silk art paper. Ideal for product catalogues, company profiles and service menus.',
      images: [IMG.brochure],
      isFeatured: true, isBestSeller: false,
      basePrice: 600,
      variants: {
        sizes: [{ name: 'A4 Bi-Fold (A5 Finished)', priceModifier: 0 }, { name: 'A3 Bi-Fold (A4 Finished)', priceModifier: 200 }],
        materials: [{ name: '150 GSM Silk Art Paper', priceModifier: 0 }, { name: '170 GSM Gloss Art', priceModifier: 100 }],
        finishes: [{ name: 'Gloss Lamination Cover', priceModifier: 0 }, { name: 'Matte Lamination Cover', priceModifier: 50 }, { name: 'Spot UV Cover', priceModifier: 150 }]
      },
      bulkPricing: bulkTiers(null, 600, 480, 380),
      turnaroundOptions: stdTurnaround,
      specifications: [{ key: 'Pages', value: '4 Pages (A5 finished)' }, { key: 'Paper', value: '150 GSM Silk' }]
    });

    products.push({
      name: 'Tri-Fold Brochure',
      slug: 'tri-fold-brochure',
      sku: sku('BR', 2),
      category: C['Marketing & Promotional'],
      description: 'Classic tri-fold brochures with 6-panel layout on premium coated paper. Popular choice for hotels, real estate, restaurants and healthcare.',
      images: [IMG.brochure],
      isFeatured: false, isBestSeller: true,
      basePrice: 700,
      variants: {
        sizes: [{ name: 'A4 Tri-Fold (DL Finished)', priceModifier: 0 }, { name: 'A3 Tri-Fold (A4 Finished)', priceModifier: 250 }],
        materials: [{ name: '150 GSM Silk', priceModifier: 0 }, { name: '170 GSM Gloss', priceModifier: 120 }],
        finishes: [{ name: 'Gloss Laminate', priceModifier: 0 }, { name: 'Matte Laminate + Spot UV', priceModifier: 200 }]
      },
      bulkPricing: bulkTiers(null, 700, 560, 450),
      turnaroundOptions: stdTurnaround,
      specifications: [{ key: 'Panels', value: '6 Panels (DL Finished)' }]
    });

    products.push({
      name: 'Poster Printing',
      slug: 'poster-printing',
      sku: sku('PS', 1),
      category: C['Marketing & Promotional'],
      description: 'Eye-catching full-colour posters in A4 to A1 sizes on premium semi-gloss or matte paper. Great for retail, events, cinema and office decoration.',
      images: [IMG.poster],
      isFeatured: true, isBestSeller: true,
      basePrice: 50,
      variants: {
        sizes: [{ name: 'A4 (210 x 297mm)', priceModifier: 0 }, { name: 'A3 (297 x 420mm)', priceModifier: 30 }, { name: 'A2 (420 x 594mm)', priceModifier: 80 }, { name: 'A1 (594 x 841mm)', priceModifier: 180 }, { name: 'Custom Size', priceModifier: 50 }],
        materials: [{ name: '150 GSM Semi-Gloss', priceModifier: 0 }, { name: '200 GSM Gloss Art', priceModifier: 20 }, { name: '200 GSM Matte', priceModifier: 20 }],
        finishes: [{ name: 'Standard Print', priceModifier: 0 }, { name: 'Laminated', priceModifier: 30 }]
      },
      bulkPricing: smallBulk(50, 45, 38, 32),
      turnaroundOptions: stdTurnaround,
      specifications: [{ key: 'Sizes', value: 'A4 to A1 & Custom' }, { key: 'Paper', value: '150–200 GSM Gloss/Matte' }]
    });

    products.push({
      name: 'Roll-Up Standee',
      slug: 'roll-up-standee',
      sku: sku('SD', 1),
      category: C['Marketing & Promotional'],
      description: 'Premium retractable roll-up standee banner with steel base, carry bag and print. Ideal for trade shows, exhibitions, retail and corporate events.',
      images: [IMG.standee],
      isFeatured: true, isBestSeller: true,
      basePrice: 1200,
      variants: {
        sizes: [{ name: '85cm x 200cm Standard', priceModifier: 0 }, { name: '100cm x 200cm Wide', priceModifier: 300 }, { name: '150cm x 200cm XL', priceModifier: 700 }],
        materials: [{ name: 'Economy Standee', priceModifier: 0 }, { name: 'Premium Standee with Carry Bag', priceModifier: 400 }],
        finishes: [{ name: 'Gloss Print', priceModifier: 0 }, { name: 'Matte Premium Print', priceModifier: 150 }]
      },
      bulkPricing: singleItem(1200),
      turnaroundOptions: largeTurnaround,
      specifications: [{ key: 'Width', value: '85cm / 100cm / 150cm' }, { key: 'Height', value: '200cm' }, { key: 'Includes', value: 'Print + Steel Base + Carry Bag' }]
    });

    products.push({
      name: 'L-Banner Standee',
      slug: 'l-banner-standee',
      sku: sku('SD', 2),
      category: C['Marketing & Promotional'],
      description: 'Lightweight L-shaped banner stand with vivid flex/vinyl print. Easy assembly, portable and ideal for indoor promotions and retail display.',
      images: [IMG.standee],
      isFeatured: false, isBestSeller: false,
      basePrice: 700,
      variants: {
        sizes: [{ name: '60cm x 160cm', priceModifier: 0 }, { name: '80cm x 180cm', priceModifier: 200 }],
        materials: [{ name: 'Vinyl Print + L-Stand', priceModifier: 0 }],
        finishes: [{ name: 'Gloss Vinyl', priceModifier: 0 }, { name: 'Matte Vinyl', priceModifier: 50 }]
      },
      bulkPricing: singleItem(700),
      turnaroundOptions: stdTurnaround,
      specifications: [{ key: 'Stand Type', value: 'L-Frame Aluminium' }, { key: 'Print', value: 'Vinyl / Flex' }]
    });

    // ════════════════════════════════════════════════════════════
    // 3. WEDDING & EVENT PRINTING
    // ════════════════════════════════════════════════════════════

    products.push({
      name: 'Wedding Invitation Card',
      slug: 'wedding-invitation-card',
      sku: sku('WE', 1),
      category: C['Wedding & Event Printing'],
      description: 'Elegant wedding invitation cards designed and printed on premium 350 GSM art board with custom envelope. Choose from offset print, foil stamping or digital print options.',
      images: [IMG.invitation],
      isFeatured: true, isBestSeller: true,
      basePrice: 12,
      variants: {
        sizes: [{ name: 'A5 (148 x 210mm)', priceModifier: 0 }, { name: '5" x 7" US Standard', priceModifier: 2 }, { name: 'A4 (210 x 297mm)', priceModifier: 5 }, { name: 'Custom Size', priceModifier: 5 }],
        materials: [{ name: '350 GSM Art Board', priceModifier: 0 }, { name: '400 GSM Premium Artboard', priceModifier: 3 }, { name: '300 GSM Linen Texture', priceModifier: 5 }],
        finishes: [{ name: 'Digital Print', priceModifier: 0 }, { name: 'Gold Foil Stamping', priceModifier: 8 }, { name: 'Emboss + Foil', priceModifier: 15 }, { name: 'Laser Cut Insert', priceModifier: 20 }]
      },
      bulkPricing: [{ minQty: 50, discountPercentage: 0, pricePerUnit: 12 }, { minQty: 100, discountPercentage: 5, pricePerUnit: 11.4 }, { minQty: 300, discountPercentage: 15, pricePerUnit: 10.2 }],
      turnaroundOptions: largeTurnaround,
      specifications: [{ key: 'Stock', value: '350–400 GSM Art Board' }, { key: 'Envelope', value: 'Included Standard' }, { key: 'MOQ', value: '50 Cards' }]
    });

    // ════════════════════════════════════════════════════════════
    // 4. PHOTO PRINTING
    // ════════════════════════════════════════════════════════════

    products.push({
      name: 'Passport Photo Printing',
      slug: 'passport-photo-printing',
      sku: sku('PH', 1),
      category: C['Photo Printing'],
      description: 'Instant same-day passport, visa and ID photographs. Government specification compliant with proper background colour, dimensions and print quality.',
      images: [IMG.photoprint],
      isFeatured: false, isBestSeller: false,
      basePrice: 50,
      variants: {
        sizes: [{ name: 'Passport 2" x 2" (Set of 4)', priceModifier: 0 }, { name: 'Visa Photo Set (Set of 6)', priceModifier: 30 }],
        materials: [{ name: 'Glossy Photo Paper', priceModifier: 0 }, { name: 'Matte Photo Paper', priceModifier: 10 }],
        finishes: [{ name: 'Standard Print', priceModifier: 0 }, { name: 'With Photo Editing', priceModifier: 30 }]
      },
      bulkPricing: singleItem(50),
      turnaroundOptions: [{ name: 'Same Day (Walk-In)', extraFee: 0, estimatedDays: 'Same Day' }],
      specifications: [{ key: 'Standard', value: 'Govt / Visa Compliant' }, { key: 'Background', value: 'White / Cream' }]
    });

    products.push({
      name: 'Photo Print (4×6 to 12×18)',
      slug: 'photo-print-4x6-to-12x18',
      sku: sku('PH', 2),
      category: C['Photo Printing'],
      description: 'Lab-quality photo prints on Fuji Crystal Archive or Kodak Endura paper. Available in all standard sizes from wallet prints to large display sizes.',
      images: [IMG.photoprint],
      isFeatured: true, isBestSeller: true,
      basePrice: 15,
      variants: {
        sizes: [{ name: '4" x 6"', priceModifier: 0 }, { name: '5" x 7"', priceModifier: 8 }, { name: '6" x 8"', priceModifier: 15 }, { name: '8" x 10"', priceModifier: 30 }, { name: '10" x 12"', priceModifier: 60 }, { name: '12" x 18"', priceModifier: 120 }, { name: 'Custom Size', priceModifier: 50 }],
        materials: [{ name: 'Glossy Fuji Crystal', priceModifier: 0 }, { name: 'Matte Fuji Crystal', priceModifier: 5 }, { name: 'Satin / Pearl Finish', priceModifier: 5 }],
        finishes: [{ name: 'Standard Photo Print', priceModifier: 0 }, { name: 'With Basic Editing', priceModifier: 30 }]
      },
      bulkPricing: smallBulk(15, 12, 10, 8),
      turnaroundOptions: [{ name: 'Same Day Print', extraFee: 0, estimatedDays: 'Same Day' }, { name: 'Bulk Order 24 Hours', extraFee: 0, estimatedDays: '1 Day' }],
      specifications: [{ key: 'Paper', value: 'Fuji Crystal / Kodak Endura' }, { key: 'Sizes', value: '4x6 to 12x18 & Custom' }]
    });

    products.push({
      name: 'Canvas Photo Print',
      slug: 'canvas-photo-print',
      sku: sku('PH', 3),
      category: C['Photo Printing'],
      description: 'Gallery-quality canvas prints stretched on solid wood frame. Fade-resistant inkjet print with UV protective coating. Perfect for home and office décor.',
      images: [IMG.canvas],
      isFeatured: true, isBestSeller: false,
      basePrice: 600,
      variants: {
        sizes: [{ name: '12" x 16"', priceModifier: 0 }, { name: '16" x 20"', priceModifier: 300 }, { name: '20" x 24"', priceModifier: 600 }, { name: '24" x 36"', priceModifier: 1000 }],
        materials: [{ name: 'Satin Canvas 280 GSM', priceModifier: 0 }, { name: 'Fine Art Canvas 300 GSM', priceModifier: 200 }],
        finishes: [{ name: 'Gallery Wrap', priceModifier: 0 }, { name: 'Gallery Wrap + UV Coat', priceModifier: 150 }]
      },
      bulkPricing: singleItem(600),
      turnaroundOptions: largeTurnaround,
      specifications: [{ key: 'Frame', value: '1.5" Solid Wood Stretcher' }, { key: 'Ink', value: 'Pigment Inkjet UV Resistant' }]
    });

    products.push({
      name: 'Premium Handcrafted Photo Frames',
      slug: 'photo-frame-printing',
      sku: sku('PH', 4),
      category: C['Photo Printing'],
      description: 'Capture your special moments with premium handcrafted photo frames. Available in 6 versatile sizes with crystal-clear shatterproof acrylic glass, precision-cut wooden frames, and 300 DPI archival luster photo printing. Perfect for wall galleries, tabletop displays, and memorable gifts.',
      images: [
        '/images/banner-6.png',
        'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80'
      ],
      isFeatured: true,
      isBestSeller: true,
      basePrice: 299,
      variants: {
        sizes: [
          { name: '4" x 6" (Desk / Tabletop)', priceModifier: 0 },
          { name: '5" x 7" (Classic Portrait)', priceModifier: 100 },
          { name: '6" x 8" (Compact Wall/Desk)', priceModifier: 180 },
          { name: '8" x 10" (Standard Wall Frame)', priceModifier: 300 },
          { name: '10" x 12" (Showcase Portrait)', priceModifier: 450 },
          { name: '12" x 16" (Large Gallery Frame)', priceModifier: 700 }
        ],
        materials: [
          { name: 'Matte Charcoal Black Wood', priceModifier: 0 },
          { name: 'Warm Teak Natural Oak', priceModifier: 50 },
          { name: 'Pure Gallery White', priceModifier: 30 },
          { name: 'Luxury Royal Walnut', priceModifier: 80 },
          { name: 'Modern Frameless Floating Acrylic', priceModifier: 150 }
        ],
        finishes: [
          { name: 'Ultra-HD Glossy + Crystal Glass', priceModifier: 0 },
          { name: 'Velvet Matte + Anti-Glare Acrylic Glass', priceModifier: 60 },
          { name: 'Textured Canvas Print (Glassless Frame)', priceModifier: 120 }
        ]
      },
      bulkPricing: smallBulk(299, 269, 239, 209),
      turnaroundOptions: [
        { name: 'Standard Delivery (2-3 Business Days)', extraFee: 0, estimatedDays: '2-3 Days' },
        { name: 'Express Rush Delivery (24 Hours)', extraFee: 149, estimatedDays: '1 Day' }
      ],
      specifications: [
        { key: 'Frame Profile', value: '1-Inch Solid Eco-Wood with Precision Mitered Corners' },
        { key: 'Front Protection', value: '2mm Shatter-Resistant Anti-Glare Acrylic Glass' },
        { key: 'Print Paper', value: '300 DPI 280 GSM Archival Luster Photo Paper' },
        { key: 'Backing System', value: 'MDF Back with Kickstand & Dual Hanging Hooks' },
        { key: 'Orientation', value: 'Portrait & Landscape Ready' },
        { key: 'Packaging', value: 'Shock-Absorbing Bubble Wrap in Heavy Corrugated Box' }
      ],
      rating: 4.9,
      reviewCount: 128,
      reviews: [
        {
          author: 'Aarav Mehta',
          rating: 5,
          date: '2 days ago',
          verified: true,
          sizePurchased: '12" x 16" (Large Gallery Frame)',
          comment: 'The frame quality exceeded my expectations! The teak wood texture is rich, and the 300 DPI print clarity brought our wedding photo to life.'
        },
        {
          author: 'Sneha Patel',
          rating: 5,
          date: '1 week ago',
          verified: true,
          sizePurchased: '8" x 10" (Standard Wall Frame)',
          comment: 'Ordered via WhatsApp because I needed help resizing an old family portrait. The ColorLex design team sent me a digital proof within 2 hours. Super impressed!'
        },
        {
          author: 'Vikram Sengupta',
          rating: 5,
          date: '2 weeks ago',
          verified: true,
          sizePurchased: '5" x 7" (Classic Portrait)',
          comment: 'Bought 3 frames as gifts. Packed extremely securely, zero scratches on the glass. Anti-glare finish looks very premium on my desk.'
        },
        {
          author: 'Ananya Sharma',
          rating: 5,
          date: '3 weeks ago',
          verified: true,
          sizePurchased: '10" x 12" (Showcase Portrait)',
          comment: 'Sturdy build and the matte black finish looks gorgeous against a white wall. The WhatsApp support for proof approval was flawless.'
        }
      ]
    });

    products.push({
      name: 'Photo Editing Services',
      slug: 'photo-editing-services',
      sku: sku('PE', 1),
      category: C['Photo Printing'],
      description: 'Professional photo editing including background removal, background change, photo restoration of old damaged photos, retouching and colour correction.',
      images: [IMG.photoprint],
      isFeatured: false, isBestSeller: false,
      basePrice: 100,
      variants: {
        sizes: [{ name: 'Basic Edit (1 Photo)', priceModifier: 0 }, { name: 'Advanced Edit (1 Photo)', priceModifier: 150 }, { name: 'Restoration (1 Old Photo)', priceModifier: 300 }],
        materials: [{ name: 'Digital Delivery Only', priceModifier: 0 }, { name: 'Digital + Print', priceModifier: 100 }],
        finishes: [{ name: 'JPG Delivery', priceModifier: 0 }, { name: 'JPG + PSD Source', priceModifier: 50 }]
      },
      bulkPricing: singleItem(100),
      turnaroundOptions: [{ name: 'Standard 24 Hours', extraFee: 0, estimatedDays: '1 Day' }, { name: 'Express 2-3 Hours', extraFee: 100, estimatedDays: 'Same Day' }],
      specifications: [{ key: 'Services', value: 'BG Remove, Retouch, Restoration' }, { key: 'Delivery', value: 'Digital / Print' }]
    });

    // ════════════════════════════════════════════════════════════
    // 5. LARGE FORMAT PRINTING
    // ════════════════════════════════════════════════════════════

    products.push({
      name: 'Frontlit Flex Printing',
      slug: 'frontlit-flex-printing',
      sku: sku('LF', 1),
      category: C['Large Format Printing'],
      description: '440 GSM frontlit flex banner for outdoor advertising hoardings, shop signage and event displays. UV-resistant inks with bright daylight visibility.',
      images: [IMG.flex],
      isFeatured: true, isBestSeller: true,
      basePrice: 35,
      variants: {
        sizes: [{ name: 'Per Sq Ft (Standard Flex)', priceModifier: 0 }, { name: 'Per Sq Ft (Star Flex Premium)', priceModifier: 10 }, { name: 'Per Sq Ft (Backlit Flex)', priceModifier: 15 }],
        materials: [{ name: '440 GSM Standard Frontlit', priceModifier: 0 }, { name: '440 GSM Star Flex', priceModifier: 8 }, { name: '500 GSM Premium Frontlit', priceModifier: 12 }],
        finishes: [{ name: 'Standard Print', priceModifier: 0 }, { name: 'With Rope Eyelets (Per Metre)', priceModifier: 5 }]
      },
      bulkPricing: [{ minQty: 10, discountPercentage: 0, pricePerUnit: 35 }, { minQty: 50, discountPercentage: 10, pricePerUnit: 31 }, { minQty: 100, discountPercentage: 20, pricePerUnit: 28 }],
      turnaroundOptions: [{ name: 'Standard (1-2 Days)', extraFee: 0, estimatedDays: '1-2 Days' }, { name: 'Same Day Rush', extraFee: 200, estimatedDays: 'Same Day' }],
      specifications: [{ key: 'Material', value: '440–500 GSM Frontlit Flex' }, { key: 'Pricing', value: 'Per Square Foot' }, { key: 'Inks', value: 'Eco-Solvent UV Resistant' }]
    });

    products.push({
      name: 'Vinyl Sticker / Decal Printing',
      slug: 'vinyl-sticker-decal-printing',
      sku: sku('LF', 2),
      category: C['Large Format Printing'],
      description: 'Self-adhesive vinyl printing for shop windows, vehicle graphics, wall stickers and display boards. Available in glossy, matte, transparent and reflective vinyl.',
      images: [IMG.vinyl],
      isFeatured: true, isBestSeller: false,
      basePrice: 45,
      variants: {
        sizes: [{ name: 'Per Sq Ft (Glossy Vinyl)', priceModifier: 0 }, { name: 'Per Sq Ft (Matte Vinyl)', priceModifier: 5 }, { name: 'Per Sq Ft (Transparent Vinyl)', priceModifier: 8 }, { name: 'Per Sq Ft (Reflective Vinyl)', priceModifier: 20 }],
        materials: [{ name: 'Glossy Vinyl 80 Micron', priceModifier: 0 }, { name: 'Matte Vinyl 80 Micron', priceModifier: 5 }, { name: 'Transparent Clear Vinyl', priceModifier: 8 }, { name: 'Reflective Vinyl 3M', priceModifier: 20 }],
        finishes: [{ name: 'Standard Cut', priceModifier: 0 }, { name: 'Die Cut (Custom Shape)', priceModifier: 15 }]
      },
      bulkPricing: [{ minQty: 1, discountPercentage: 0, pricePerUnit: 45 }, { minQty: 10, discountPercentage: 10, pricePerUnit: 40 }],
      turnaroundOptions: stdTurnaround,
      specifications: [{ key: 'Types', value: 'Gloss / Matte / Transparent / Reflective' }, { key: 'Application', value: 'Indoor & Outdoor' }]
    });

    products.push({
      name: 'Event & Shop Banner',
      slug: 'event-shop-banner',
      sku: sku('LF', 3),
      category: C['Large Format Printing'],
      description: 'Durable PVC vinyl banners with welded hems and metal eyelets for outdoor events, shops and political campaigns. Weather-resistant with vivid colour output.',
      images: [IMG.banner],
      isFeatured: true, isBestSeller: true,
      basePrice: 60,
      variants: {
        sizes: [{ name: '2ft x 4ft', priceModifier: 0 }, { name: '3ft x 6ft', priceModifier: 100 }, { name: '4ft x 8ft', priceModifier: 250 }, { name: '5ft x 10ft', priceModifier: 400 }, { name: 'Custom Size', priceModifier: 80 }],
        materials: [{ name: '270 GSM Matte Vinyl', priceModifier: 0 }, { name: '440 GSM Heavy Duty Vinyl', priceModifier: 30 }],
        finishes: [{ name: 'With Eyelets', priceModifier: 0 }, { name: 'With Pole Pockets', priceModifier: 50 }]
      },
      bulkPricing: [{ minQty: 1, discountPercentage: 0, pricePerUnit: 60 }, { minQty: 5, discountPercentage: 10, pricePerUnit: 54 }, { minQty: 10, discountPercentage: 20, pricePerUnit: 48 }],
      turnaroundOptions: [{ name: 'Standard (1-2 Days)', extraFee: 0, estimatedDays: '1-2 Days' }, { name: 'Same Day', extraFee: 250, estimatedDays: 'Same Day' }],
      specifications: [{ key: 'Material', value: '270–440 GSM PVC Vinyl' }, { key: 'Eyelets', value: 'Every 2ft Standard' }, { key: 'UV Resistance', value: '3+ Years Outdoor' }]
    });

    products.push({
      name: 'Wall Graphics & Wall Stickers',
      slug: 'wall-graphics-wall-stickers',
      sku: sku('LF', 4),
      category: C['Large Format Printing'],
      description: 'Removable or permanent wall graphics and wall stickers for office branding, home décor, retail and hospitality interiors. One-way vision also available.',
      images: [IMG.wallGraphics],
      isFeatured: false, isBestSeller: false,
      basePrice: 55,
      variants: {
        sizes: [{ name: 'Per Sq Ft (Wall Sticker)', priceModifier: 0 }, { name: 'Per Sq Ft (One-Way Vision)', priceModifier: 15 }, { name: 'Per Sq Ft (Backlit Film)', priceModifier: 20 }],
        materials: [{ name: 'Removable Wall Sticker Vinyl', priceModifier: 0 }, { name: 'Permanent Wall Vinyl', priceModifier: 5 }, { name: 'One-Way Vision Perforated', priceModifier: 15 }],
        finishes: [{ name: 'Gloss', priceModifier: 0 }, { name: 'Matte', priceModifier: 5 }]
      },
      bulkPricing: [{ minQty: 1, discountPercentage: 0, pricePerUnit: 55 }, { minQty: 20, discountPercentage: 10, pricePerUnit: 49 }],
      turnaroundOptions: largeTurnaround,
      specifications: [{ key: 'Application', value: 'Indoor Wall / Glass' }, { key: 'Removal', value: 'Removable or Permanent' }]
    });

    products.push({
      name: 'Vehicle & Hoarding Graphics',
      slug: 'vehicle-hoarding-graphics',
      sku: sku('LF', 5),
      category: C['Large Format Printing'],
      description: 'Full-vehicle wraps, partial wraps and hoarding prints using premium cast vinyl and eco-solvent inks. Perfect for advertising vehicles and large outdoor hoardings.',
      images: [IMG.vinyl],
      isFeatured: false, isBestSeller: false,
      basePrice: 80,
      variants: {
        sizes: [{ name: 'Per Sq Ft (Vehicle Wrap Vinyl)', priceModifier: 0 }, { name: 'Per Sq Ft (Hoarding Frontlit)', priceModifier: -10 }],
        materials: [{ name: 'Cast Vinyl 120 Micron', priceModifier: 0 }, { name: 'Premium 3M Cast Vinyl', priceModifier: 30 }],
        finishes: [{ name: 'Gloss', priceModifier: 0 }, { name: 'Matte', priceModifier: 8 }]
      },
      bulkPricing: [{ minQty: 1, discountPercentage: 0, pricePerUnit: 80 }],
      turnaroundOptions: largeTurnaround,
      specifications: [{ key: 'Vinyl', value: 'Cast / Calendered 3M Compatible' }, { key: 'Durability', value: '5+ Years UV Rated' }]
    });

    // ════════════════════════════════════════════════════════════
    // 6. SIGNS & DISPLAY
    // ════════════════════════════════════════════════════════════

    products.push({
      name: 'Acrylic Sign Board & Name Plate',
      slug: 'acrylic-sign-board-name-plate',
      sku: sku('SG', 1),
      category: C['Signs & Display'],
      description: 'Premium clear or coloured acrylic sign boards with UV print or laser engraving. Ideal for office name plates, shop boards, logos and door signs.',
      images: [IMG.acrylicSign],
      isFeatured: true, isBestSeller: true,
      basePrice: 500,
      variants: {
        sizes: [{ name: '6" x 4" Name Plate', priceModifier: 0 }, { name: '12" x 8" Door Sign', priceModifier: 200 }, { name: '24" x 12" Shop Board', priceModifier: 800 }, { name: 'Custom Size', priceModifier: 300 }],
        materials: [{ name: '5mm Clear Acrylic', priceModifier: 0 }, { name: '8mm Clear Acrylic', priceModifier: 150 }, { name: '5mm Frosted Acrylic', priceModifier: 100 }],
        finishes: [{ name: 'UV Printed', priceModifier: 0 }, { name: 'Laser Engraved + UV', priceModifier: 200 }, { name: 'Gold/Silver Foil Letters', priceModifier: 300 }]
      },
      bulkPricing: singleItem(500),
      turnaroundOptions: largeTurnaround,
      specifications: [{ key: 'Thickness', value: '5mm / 8mm Acrylic' }, { key: 'Print', value: 'UV / Laser Engrave' }, { key: 'Mounting', value: 'Studs Included' }]
    });

    products.push({
      name: 'Acrylic QR Code & Logo Board',
      slug: 'acrylic-qr-code-logo-board',
      sku: sku('SG', 2),
      category: C['Signs & Display'],
      description: 'Acrylic QR code display boards for restaurants, retail and payments. Custom acrylic logos and 3D acrylic letters for premium brand displays.',
      images: [IMG.acrylicSign],
      isFeatured: false, isBestSeller: false,
      basePrice: 350,
      variants: {
        sizes: [{ name: 'A5 QR Board', priceModifier: 0 }, { name: 'A4 QR Board', priceModifier: 150 }, { name: 'A3 QR Board', priceModifier: 300 }],
        materials: [{ name: '5mm Clear Acrylic', priceModifier: 0 }, { name: '5mm Gold Acrylic', priceModifier: 100 }],
        finishes: [{ name: 'UV Print', priceModifier: 0 }, { name: 'Laser Engrave', priceModifier: 100 }]
      },
      bulkPricing: singleItem(350),
      turnaroundOptions: stdTurnaround,
      specifications: [{ key: 'Use', value: 'QR / Logo / 3D Letters' }]
    });

    products.push({
      name: 'ACP Sign Board & Shop Board',
      slug: 'acp-sign-board-shop-board',
      sku: sku('SG', 3),
      category: C['Signs & Display'],
      description: 'Aluminium Composite Panel (ACP) sign boards for shops, offices and directional signage. Lightweight, weather-resistant with vivid print or vinyl application.',
      images: [IMG.signboard],
      isFeatured: true, isBestSeller: false,
      basePrice: 120,
      variants: {
        sizes: [{ name: 'Per Sq Ft (ACP Board)', priceModifier: 0 }, { name: '2ft x 1ft Board', priceModifier: 0 }, { name: '4ft x 2ft Board', priceModifier: 0 }],
        materials: [{ name: '3mm ACP Standard', priceModifier: 0 }, { name: '4mm ACP Premium Alucobond', priceModifier: 30 }],
        finishes: [{ name: 'Vinyl Lettering', priceModifier: 0 }, { name: 'UV Direct Print', priceModifier: 30 }, { name: 'Backlit Vinyl', priceModifier: 50 }]
      },
      bulkPricing: [{ minQty: 1, discountPercentage: 0, pricePerUnit: 120 }, { minQty: 10, discountPercentage: 10, pricePerUnit: 108 }],
      turnaroundOptions: largeTurnaround,
      specifications: [{ key: 'Panel', value: '3mm / 4mm ACP' }, { key: 'Application', value: 'Shop Boards, Direction Signs' }]
    });

    products.push({
      name: 'PVC Foam Board & Sunboard',
      slug: 'pvc-foam-board-sunboard',
      sku: sku('SG', 4),
      category: C['Signs & Display'],
      description: 'Lightweight PVC foam board (sunboard) with direct UV print for indoor displays, exhibition stands, notice boards and temporary signage.',
      images: [IMG.pvcSign],
      isFeatured: false, isBestSeller: false,
      basePrice: 40,
      variants: {
        sizes: [{ name: 'Per Sq Ft (5mm PVC)', priceModifier: 0 }, { name: 'Per Sq Ft (10mm PVC)', priceModifier: 10 }, { name: 'A4 Board', priceModifier: 0 }, { name: 'A3 Board', priceModifier: 40 }, { name: 'A2 Board', priceModifier: 100 }],
        materials: [{ name: '5mm White PVC Foam', priceModifier: 0 }, { name: '10mm White PVC Foam', priceModifier: 10 }],
        finishes: [{ name: 'UV Direct Print', priceModifier: 0 }, { name: 'Vinyl Laminated', priceModifier: 15 }]
      },
      bulkPricing: [{ minQty: 1, discountPercentage: 0, pricePerUnit: 40 }, { minQty: 10, discountPercentage: 15, pricePerUnit: 34 }],
      turnaroundOptions: stdTurnaround,
      specifications: [{ key: 'Thickness', value: '5mm / 10mm PVC Foam' }, { key: 'Weight', value: 'Lightweight – Easy Mount' }]
    });

    products.push({
      name: 'LED Glow Sign Board',
      slug: 'led-glow-sign-board',
      sku: sku('SG', 5),
      category: C['Signs & Display'],
      description: 'Energy-efficient LED illuminated sign boards for shops, restaurants and offices. Single or double-sided with premium flex face and aluminium frame.',
      images: [IMG.ledSign],
      isFeatured: true, isBestSeller: true,
      basePrice: 250,
      variants: {
        sizes: [{ name: 'Per Sq Ft (LED Sign)', priceModifier: 0 }, { name: '2ft x 1ft', priceModifier: 0 }, { name: '4ft x 2ft', priceModifier: 0 }, { name: '6ft x 2ft', priceModifier: 0 }],
        materials: [{ name: 'LED + Acrylic Face', priceModifier: 0 }, { name: 'LED + Flex Face Aluminium', priceModifier: 30 }],
        finishes: [{ name: 'Single Side', priceModifier: 0 }, { name: 'Double Side', priceModifier: 50 }]
      },
      bulkPricing: [{ minQty: 1, discountPercentage: 0, pricePerUnit: 250 }],
      turnaroundOptions: largeTurnaround,
      specifications: [{ key: 'Type', value: 'LED Backlit / Glow Sign' }, { key: 'Frame', value: 'Aluminium Profile' }, { key: 'Power', value: 'Low Watt Energy Saving LED' }]
    });

    // ════════════════════════════════════════════════════════════
    // 7. STICKERS & LABELS
    // ════════════════════════════════════════════════════════════

    products.push({
      name: 'Custom Vinyl & Paper Stickers',
      slug: 'custom-vinyl-paper-stickers',
      sku: sku('ST', 1),
      category: C['Stickers & Labels'],
      description: 'Custom die-cut stickers in any shape — paper, vinyl, transparent, waterproof, glossy, matte and reflective. Perfect for product labels, packaging and promotions.',
      images: [IMG.sticker],
      isFeatured: true, isBestSeller: true,
      basePrice: 400,
      variants: {
        sizes: [{ name: 'A4 Sheet (Mix Stickers)', priceModifier: 0 }, { name: '2" x 2" Round (50 pcs)', priceModifier: 0 }, { name: '3" x 3" Square (50 pcs)', priceModifier: 100 }, { name: 'Custom Die Cut', priceModifier: 150 }],
        materials: [{ name: 'White Paper Sticker', priceModifier: 0 }, { name: 'Glossy Vinyl Waterproof', priceModifier: 100 }, { name: 'Matte Vinyl', priceModifier: 100 }, { name: 'Transparent Clear Vinyl', priceModifier: 120 }, { name: 'Reflective Vinyl', priceModifier: 200 }],
        finishes: [{ name: 'Standard Cut', priceModifier: 0 }, { name: 'Die Cut (Custom Shape)', priceModifier: 100 }, { name: 'Kiss Cut on Sheet', priceModifier: 80 }]
      },
      bulkPricing: bulkTiers(null, 400, 320, 260),
      turnaroundOptions: stdTurnaround,
      specifications: [{ key: 'Materials', value: 'Paper / Vinyl / Transparent / Reflective' }, { key: 'Waterproof', value: 'Yes (Vinyl Options)' }]
    });

    // ════════════════════════════════════════════════════════════
    // 8. SCHOOL & COLLEGE PRINTING
    // ════════════════════════════════════════════════════════════

    products.push({
      name: 'Student ID Card',
      slug: 'student-id-card',
      sku: sku('SC', 1),
      category: C['School & College Printing'],
      description: 'Durable PVC student ID cards with photo, name, class and school logo printing. Includes barcode or QR code for library and attendance management.',
      images: [IMG.studentId],
      isFeatured: false, isBestSeller: false,
      basePrice: 18,
      variants: {
        sizes: [{ name: 'CR80 Standard (85.6 x 54mm)', priceModifier: 0 }],
        materials: [{ name: '760 Micron White PVC', priceModifier: 0 }],
        finishes: [{ name: 'Single Side Print', priceModifier: 0 }, { name: 'Double Side Print', priceModifier: 5 }, { name: 'With Barcode / QR', priceModifier: 3 }]
      },
      bulkPricing: [{ minQty: 50, discountPercentage: 0, pricePerUnit: 18 }, { minQty: 200, discountPercentage: 10, pricePerUnit: 16 }, { minQty: 500, discountPercentage: 20, pricePerUnit: 14 }],
      turnaroundOptions: stdTurnaround,
      specifications: [{ key: 'Material', value: '760 Micron PVC' }, { key: 'Options', value: 'Barcode, QR, Photo' }]
    });

    products.push({
      name: 'Admit Card & Mark Sheet Printing',
      slug: 'admit-card-mark-sheet-printing',
      sku: sku('SC', 2),
      category: C['School & College Printing'],
      description: 'Bulk admit card and mark sheet printing on 150 GSM art paper. Custom design with institution branding, student details and exam information.',
      images: [IMG.certificate],
      isFeatured: false, isBestSeller: false,
      basePrice: 8,
      variants: {
        sizes: [{ name: 'A5 Admit Card', priceModifier: 0 }, { name: 'A4 Mark Sheet', priceModifier: 5 }],
        materials: [{ name: '150 GSM Art Paper', priceModifier: 0 }, { name: '120 GSM Writing Paper', priceModifier: -2 }],
        finishes: [{ name: 'Single Side', priceModifier: 0 }, { name: 'Double Side', priceModifier: 3 }]
      },
      bulkPricing: [{ minQty: 100, discountPercentage: 0, pricePerUnit: 8 }, { minQty: 500, discountPercentage: 10, pricePerUnit: 7.2 }, { minQty: 1000, discountPercentage: 20, pricePerUnit: 6.4 }],
      turnaroundOptions: stdTurnaround,
      specifications: [{ key: 'Paper', value: '150 GSM Art / Writing Paper' }]
    });

    products.push({
      name: 'Student Certificate Printing',
      slug: 'student-certificate-printing',
      sku: sku('SC', 3),
      category: C['School & College Printing'],
      description: 'Elegant achievement and completion certificates on 200 GSM textured paper with gold border and institution seal. Suitable for sports, academics and cultural events.',
      images: [IMG.certificate],
      isFeatured: false, isBestSeller: false,
      basePrice: 25,
      variants: {
        sizes: [{ name: 'A4 Certificate', priceModifier: 0 }, { name: 'A3 Certificate', priceModifier: 20 }],
        materials: [{ name: '200 GSM Matt Art', priceModifier: 0 }, { name: '250 GSM Premium Board', priceModifier: 15 }],
        finishes: [{ name: 'Standard Print', priceModifier: 0 }, { name: 'Gold Foil Border', priceModifier: 20 }]
      },
      bulkPricing: smallBulk(25, 22, 18, 15),
      turnaroundOptions: stdTurnaround,
      specifications: [{ key: 'Paper', value: '200–250 GSM Art Board' }]
    });

    // ════════════════════════════════════════════════════════════
    // 9. PERSONALIZED GIFTS
    // ════════════════════════════════════════════════════════════

    products.push({
      name: 'Custom Printed T-Shirt',
      slug: 'custom-printed-t-shirt',
      sku: sku('GF', 1),
      category: C['Personalized Gifts'],
      description: '100% cotton custom t-shirts with DTG (direct to garment) or screen print. Vivid, wash-resistant prints for corporate events, team uniforms and personal gifts.',
      images: [IMG.tshirt],
      isFeatured: true, isBestSeller: true,
      basePrice: 350,
      variants: {
        sizes: [{ name: 'Small (S)', priceModifier: 0 }, { name: 'Medium (M)', priceModifier: 0 }, { name: 'Large (L)', priceModifier: 0 }, { name: 'XL', priceModifier: 20 }, { name: '2XL', priceModifier: 40 }, { name: '3XL', priceModifier: 60 }],
        materials: [{ name: '180 GSM Cotton Round Neck', priceModifier: 0 }, { name: '220 GSM Heavyweight Cotton', priceModifier: 80 }, { name: '200 GSM Polo Collar', priceModifier: 100 }],
        finishes: [{ name: 'Single Side Front Print', priceModifier: 0 }, { name: 'Front + Back Print', priceModifier: 100 }, { name: 'All-Over Sublimation Print', priceModifier: 150 }]
      },
      bulkPricing: smallBulk(350, 320, 280, 240),
      turnaroundOptions: largeTurnaround,
      specifications: [{ key: 'Print', value: 'DTG / Screen Print / Sublimation' }, { key: 'Fabric', value: '180–220 GSM Cotton' }]
    });

    products.push({
      name: 'Custom Hoodie & Sweatshirt',
      slug: 'custom-hoodie-sweatshirt',
      sku: sku('GF', 2),
      category: C['Personalized Gifts'],
      description: 'Premium custom hoodies with zip or pullover style. Front and back custom print with screen or DTG printing. Popular for college fests, corporate and group orders.',
      images: [IMG.hoodie],
      isFeatured: false, isBestSeller: false,
      basePrice: 650,
      variants: {
        sizes: [{ name: 'Small (S)', priceModifier: 0 }, { name: 'Medium (M)', priceModifier: 0 }, { name: 'Large (L)', priceModifier: 0 }, { name: 'XL', priceModifier: 30 }, { name: '2XL', priceModifier: 60 }],
        materials: [{ name: '320 GSM Fleece Pullover', priceModifier: 0 }, { name: '300 GSM Zip Hoodie', priceModifier: 150 }],
        finishes: [{ name: 'Front Print Only', priceModifier: 0 }, { name: 'Front + Back Print', priceModifier: 120 }]
      },
      bulkPricing: smallBulk(650, 600, 540, 480),
      turnaroundOptions: largeTurnaround,
      specifications: [{ key: 'Fabric', value: '300–320 GSM Fleece' }, { key: 'Styles', value: 'Pullover / Zip Hoodie' }]
    });

    products.push({
      name: 'Custom Printed Cap',
      slug: 'custom-printed-cap',
      sku: sku('GF', 3),
      category: C['Personalized Gifts'],
      description: 'Custom branded caps with embroidery or print. Available in baseball, bucket and snapback styles. Ideal for corporate gifts, events and sports teams.',
      images: [IMG.tshirt],
      isFeatured: false, isBestSeller: false,
      basePrice: 200,
      variants: {
        sizes: [{ name: 'One Size Adjustable', priceModifier: 0 }],
        materials: [{ name: 'Cotton Canvas Cap', priceModifier: 0 }, { name: 'Polyester Sports Cap', priceModifier: 50 }],
        finishes: [{ name: 'Embroidery Logo (Front)', priceModifier: 0 }, { name: 'Sublimation Full Print', priceModifier: 80 }]
      },
      bulkPricing: smallBulk(200, 180, 160, 140),
      turnaroundOptions: largeTurnaround,
      specifications: [{ key: 'Styles', value: 'Baseball / Bucket / Snapback' }, { key: 'Print', value: 'Embroidery / Sublimation' }]
    });

    products.push({
      name: 'Personalized Magic Mug',
      slug: 'personalized-magic-mug',
      sku: sku('GF', 4),
      category: C['Personalized Gifts'],
      description: 'Custom ceramic magic mugs that reveal your design when filled with hot liquid. Perfect birthday, anniversary and corporate gifts with full-wrap sublimation print.',
      images: [IMG.mug],
      isFeatured: true, isBestSeller: true,
      basePrice: 250,
      variants: {
        sizes: [{ name: '11oz Standard Mug', priceModifier: 0 }, { name: '15oz Large Mug', priceModifier: 80 }],
        materials: [{ name: 'Magic Mug (Colour Change)', priceModifier: 0 }, { name: 'Plain White Ceramic', priceModifier: -50 }, { name: 'Stainless Steel Travel Mug', priceModifier: 150 }],
        finishes: [{ name: 'Full Wrap Sublimation', priceModifier: 0 }, { name: 'With Gift Box', priceModifier: 50 }]
      },
      bulkPricing: singleItem(250),
      turnaroundOptions: stdTurnaround,
      specifications: [{ key: 'Capacity', value: '11oz / 15oz' }, { key: 'Print', value: 'Full Wrap Sublimation' }, { key: 'Effect', value: 'Magic Colour-Change' }]
    });

    products.push({
      name: 'Personalized Photo Cushion & Frame',
      slug: 'personalized-photo-cushion-frame',
      sku: sku('GF', 5),
      category: C['Personalized Gifts'],
      description: 'Custom photo cushions and photo frames — perfect personalised gifts for birthdays, anniversaries and house warming occasions.',
      images: [IMG.cushion],
      isFeatured: false, isBestSeller: false,
      basePrice: 350,
      variants: {
        sizes: [{ name: '12" x 12" Cushion', priceModifier: 0 }, { name: '16" x 16" Cushion', priceModifier: 100 }, { name: '5" x 7" Photo Frame', priceModifier: -150 }, { name: '8" x 10" Photo Frame', priceModifier: 0 }],
        materials: [{ name: 'Satin Cushion Cover', priceModifier: 0 }, { name: 'Velvet Cushion Cover', priceModifier: 80 }],
        finishes: [{ name: 'With Cushion Filler', priceModifier: 0 }, { name: 'Cover Only', priceModifier: -100 }, { name: 'With Gift Box', priceModifier: 60 }]
      },
      bulkPricing: singleItem(350),
      turnaroundOptions: stdTurnaround,
      specifications: [{ key: 'Print', value: 'Sublimation Dye Print' }, { key: 'Filling', value: 'Premium Polyester Fill' }]
    });

    products.push({
      name: 'Custom Mobile Cover',
      slug: 'custom-mobile-cover',
      sku: sku('GF', 6),
      category: C['Personalized Gifts'],
      description: 'Personalised mobile covers with custom photo, name or design. Available for all major smartphone models including iPhone, Samsung and OnePlus.',
      images: [IMG.mobilecover],
      isFeatured: false, isBestSeller: true,
      basePrice: 199,
      variants: {
        sizes: [{ name: 'iPhone Models', priceModifier: 0 }, { name: 'Samsung Galaxy Models', priceModifier: 0 }, { name: 'OnePlus / Oppo / Vivo', priceModifier: 0 }],
        materials: [{ name: 'Soft Silicon TPU', priceModifier: 0 }, { name: 'Hard Plastic', priceModifier: 0 }, { name: 'Leather Texture', priceModifier: 100 }],
        finishes: [{ name: 'Sublimation Print', priceModifier: 0 }, { name: 'UV Print', priceModifier: 30 }]
      },
      bulkPricing: singleItem(199),
      turnaroundOptions: stdTurnaround,
      specifications: [{ key: 'Compatible', value: 'iPhone / Samsung / OnePlus / More' }, { key: 'Print', value: 'Sublimation / UV' }]
    });

    products.push({
      name: 'Personalized Mouse Pad & Keychain',
      slug: 'personalized-mouse-pad-keychain',
      sku: sku('GF', 7),
      category: C['Personalized Gifts'],
      description: 'Custom photo mouse pads with anti-slip rubber base and photo keychains. Ideal corporate gifts and personalised gift items for all occasions.',
      images: [IMG.keychain],
      isFeatured: false, isBestSeller: false,
      basePrice: 150,
      variants: {
        sizes: [{ name: 'Mouse Pad (22 x 18cm)', priceModifier: 0 }, { name: 'Mouse Pad (24 x 20cm)', priceModifier: 30 }, { name: 'Keychain (Acrylic)', priceModifier: -70 }, { name: 'Keychain (Metal)', priceModifier: -50 }],
        materials: [{ name: 'Photo Mouse Pad', priceModifier: 0 }, { name: 'Acrylic Keychain', priceModifier: -70 }, { name: 'Metal Keychain', priceModifier: -50 }],
        finishes: [{ name: 'Standard Print', priceModifier: 0 }, { name: 'With Gift Box', priceModifier: 40 }]
      },
      bulkPricing: singleItem(150),
      turnaroundOptions: stdTurnaround,
      specifications: [{ key: 'Mouse Pad', value: 'Anti-Slip Rubber Base' }, { key: 'Keychain', value: 'Acrylic / Metal' }]
    });

    // ════════════════════════════════════════════════════════════
    // 10. LASER CUTTING & ENGRAVING
    // ════════════════════════════════════════════════════════════

    products.push({
      name: 'Wedding Laser Cut Décor',
      slug: 'wedding-laser-cut-decor',
      sku: sku('LC', 1),
      category: C['Laser Cutting & Engraving'],
      description: 'Precision laser cut wedding decorations including cake toppers, name cutouts, table numbers, wedding signs and decorative inserts in MDF, acrylic and wood.',
      images: [IMG.laserWedding],
      isFeatured: true, isBestSeller: true,
      basePrice: 150,
      variants: {
        sizes: [{ name: 'Cake Topper (Custom Name)', priceModifier: 0 }, { name: 'Wedding Name Cutout (30cm)', priceModifier: 100 }, { name: 'Table Number Set (10 Pcs)', priceModifier: 300 }, { name: 'Wedding Sign (A4 Size)', priceModifier: 200 }],
        materials: [{ name: '3mm MDF Wood', priceModifier: 0 }, { name: '3mm Acrylic Clear', priceModifier: 50 }, { name: '3mm Acrylic Gold Mirror', priceModifier: 100 }],
        finishes: [{ name: 'Natural Wood / Clear', priceModifier: 0 }, { name: 'Spray Painted Gold', priceModifier: 80 }, { name: 'Spray Painted Rose Gold', priceModifier: 80 }]
      },
      bulkPricing: singleItem(150),
      turnaroundOptions: largeTurnaround,
      specifications: [{ key: 'Material', value: 'MDF / Acrylic / Wood' }, { key: 'Precision', value: 'Laser Cut ±0.1mm' }]
    });

    products.push({
      name: 'Custom Name Cutout',
      slug: 'custom-name-cutout',
      sku: sku('LC', 2),
      category: C['Laser Cutting & Engraving'],
      description: 'Personalised name and letter cutouts in MDF, acrylic or plywood for home décor, kids room, birthdays and events. Any font and size available.',
      images: [IMG.laserWedding],
      isFeatured: false, isBestSeller: false,
      basePrice: 80,
      variants: {
        sizes: [{ name: 'Per Letter (10cm Height)', priceModifier: 0 }, { name: 'Per Letter (20cm Height)', priceModifier: 50 }, { name: 'Per Letter (30cm Height)', priceModifier: 120 }],
        materials: [{ name: '3mm MDF', priceModifier: 0 }, { name: '5mm MDF', priceModifier: 20 }, { name: '3mm Acrylic', priceModifier: 40 }],
        finishes: [{ name: 'Natural Unfinished', priceModifier: 0 }, { name: 'Painted (Single Colour)', priceModifier: 30 }]
      },
      bulkPricing: singleItem(80),
      turnaroundOptions: stdTurnaround,
      specifications: [{ key: 'Material', value: 'MDF / Plywood / Acrylic' }, { key: 'Any Font', value: 'Yes — Custom Font Upload' }]
    });

    products.push({
      name: 'Laser Engraving Service',
      slug: 'laser-engraving-service',
      sku: sku('LC', 3),
      category: C['Laser Cutting & Engraving'],
      description: 'Professional laser engraving on wood, acrylic, leather, metal and stone. Name, logo, photo, QR code and text engraving for corporate gifts and personalized items.',
      images: [IMG.laserEngraving],
      isFeatured: false, isBestSeller: false,
      basePrice: 100,
      variants: {
        sizes: [{ name: 'Name Engraving (1 Line)', priceModifier: 0 }, { name: 'Logo Engraving', priceModifier: 100 }, { name: 'Photo Engraving', priceModifier: 300 }, { name: 'QR Code Engraving', priceModifier: 80 }],
        materials: [{ name: 'On Customer Item (Acrylic)', priceModifier: 0 }, { name: 'On Customer Item (Wood)', priceModifier: 0 }, { name: 'On Customer Item (Metal)', priceModifier: 50 }],
        finishes: [{ name: 'Standard Engrave', priceModifier: 0 }, { name: 'Deep Engrave', priceModifier: 80 }]
      },
      bulkPricing: singleItem(100),
      turnaroundOptions: stdTurnaround,
      specifications: [{ key: 'Materials', value: 'Wood, Acrylic, Leather, Metal, Stone' }, { key: 'Types', value: 'Name, Logo, Photo, QR, Text' }]
    });

    // ════════════════════════════════════════════════════════════
    // 11. GRAPHIC DESIGN SERVICES
    // ════════════════════════════════════════════════════════════

    products.push({
      name: 'Logo & Brand Identity Design',
      slug: 'logo-brand-identity-design',
      sku: sku('DS', 1),
      category: C['Graphic Design Services'],
      description: 'Professional logo design and complete brand identity package including business card design, letterhead, envelope and brand guidelines. 3 design concepts with revisions.',
      images: [IMG.logoDesign],
      isFeatured: true, isBestSeller: true,
      basePrice: 2500,
      variants: {
        sizes: [{ name: 'Logo Only (3 Concepts)', priceModifier: 0 }, { name: 'Logo + Brand Identity Pack', priceModifier: 2000 }, { name: 'Complete Brand Package', priceModifier: 5000 }],
        materials: [{ name: 'Digital Delivery (All Formats)', priceModifier: 0 }],
        finishes: [{ name: '2 Revision Rounds', priceModifier: 0 }, { name: 'Unlimited Revisions', priceModifier: 1500 }]
      },
      bulkPricing: singleItem(2500),
      turnaroundOptions: [{ name: 'Standard (5-7 Days)', extraFee: 0, estimatedDays: '5-7 Days' }, { name: 'Express (2-3 Days)', extraFee: 1000, estimatedDays: '2-3 Days' }],
      specifications: [{ key: 'Concepts', value: '3 Initial Concepts' }, { key: 'Delivery', value: 'AI, EPS, PNG, PDF, SVG' }, { key: 'Ownership', value: 'Full Rights Transferred' }]
    });

    products.push({
      name: 'Flyer & Poster Design',
      slug: 'flyer-poster-design',
      sku: sku('DS', 2),
      category: C['Graphic Design Services'],
      description: 'Professional flyer, leaflet and poster design for print and digital media. Creative layouts for events, promotions, restaurants and retail. Print-ready file delivery.',
      images: [IMG.designServices],
      isFeatured: false, isBestSeller: true,
      basePrice: 500,
      variants: {
        sizes: [{ name: 'Flyer Design (A5/A4)', priceModifier: 0 }, { name: 'Poster Design (A3/A2)', priceModifier: 200 }, { name: 'Menu Design', priceModifier: 500 }],
        materials: [{ name: 'Digital File Delivery', priceModifier: 0 }, { name: 'Design + Print Bundle', priceModifier: 300 }],
        finishes: [{ name: '2 Revisions', priceModifier: 0 }, { name: '5 Revisions', priceModifier: 300 }]
      },
      bulkPricing: singleItem(500),
      turnaroundOptions: [{ name: 'Standard (2-3 Days)', extraFee: 0, estimatedDays: '2-3 Days' }, { name: 'Express (Same Day)', extraFee: 300, estimatedDays: 'Same Day' }],
      specifications: [{ key: 'Delivery', value: 'Print-Ready PDF + JPG' }, { key: 'Software', value: 'Adobe Illustrator / Photoshop' }]
    });

    products.push({
      name: 'Brochure & Catalogue Design',
      slug: 'brochure-catalogue-design',
      sku: sku('DS', 3),
      category: C['Graphic Design Services'],
      description: 'Professionally designed bi-fold and tri-fold brochures, multi-page product catalogues and company profile design for print and digital use.',
      images: [IMG.designServices],
      isFeatured: false, isBestSeller: false,
      basePrice: 1500,
      variants: {
        sizes: [{ name: 'Bi-Fold Brochure (4 Pages)', priceModifier: 0 }, { name: 'Tri-Fold Brochure (6 Panels)', priceModifier: 500 }, { name: 'Product Catalogue (Up to 12 Pages)', priceModifier: 2000 }],
        materials: [{ name: 'Digital File Only', priceModifier: 0 }, { name: 'Design + Print Bundle', priceModifier: 800 }],
        finishes: [{ name: '2 Revisions', priceModifier: 0 }, { name: '5 Revisions', priceModifier: 500 }]
      },
      bulkPricing: singleItem(1500),
      turnaroundOptions: [{ name: 'Standard (3-5 Days)', extraFee: 0, estimatedDays: '3-5 Days' }, { name: 'Express (2 Days)', extraFee: 800, estimatedDays: '2 Days' }],
      specifications: [{ key: 'Formats', value: 'Print-Ready PDF + Editable File' }]
    });

    products.push({
      name: 'Wedding Card & Invitation Design',
      slug: 'wedding-card-invitation-design',
      sku: sku('DS', 4),
      category: C['Graphic Design Services'],
      description: 'Bespoke wedding invitation, birthday card and event invitation design. Includes inner matter design, envelope design and RSVP card. 3 theme concepts provided.',
      images: [IMG.invitation],
      isFeatured: false, isBestSeller: true,
      basePrice: 800,
      variants: {
        sizes: [{ name: 'Wedding Card Design Only', priceModifier: 0 }, { name: 'Wedding Card + RSVP + Envelope', priceModifier: 600 }, { name: 'Birthday Invitation Design', priceModifier: -300 }],
        materials: [{ name: 'Digital File Delivery', priceModifier: 0 }, { name: 'Design + Print Bundle', priceModifier: 500 }],
        finishes: [{ name: '3 Revisions', priceModifier: 0 }, { name: 'Unlimited Revisions', priceModifier: 500 }]
      },
      bulkPricing: singleItem(800),
      turnaroundOptions: [{ name: 'Standard (2-3 Days)', extraFee: 0, estimatedDays: '2-3 Days' }, { name: 'Express (1 Day)', extraFee: 400, estimatedDays: '1 Day' }],
      specifications: [{ key: 'Concepts', value: '3 Design Themes' }, { key: 'Delivery', value: 'Print-Ready PDF + Editable File' }]
    });

    products.push({
      name: 'Social Media & Digital Design',
      slug: 'social-media-digital-design',
      sku: sku('DS', 5),
      category: C['Graphic Design Services'],
      description: 'Custom social media graphics, Instagram posts, Facebook banners, YouTube thumbnails and digital marketing creatives for your brand.',
      images: [IMG.logoDesign],
      isFeatured: false, isBestSeller: false,
      basePrice: 300,
      variants: {
        sizes: [{ name: 'Single Post Design', priceModifier: 0 }, { name: '5 Post Pack', priceModifier: 1000 }, { name: '10 Post Pack', priceModifier: 1800 }],
        materials: [{ name: 'Digital JPG/PNG Delivery', priceModifier: 0 }],
        finishes: [{ name: '2 Revisions Per Post', priceModifier: 0 }]
      },
      bulkPricing: singleItem(300),
      turnaroundOptions: [{ name: 'Standard (1-2 Days)', extraFee: 0, estimatedDays: '1-2 Days' }, { name: 'Express (Same Day)', extraFee: 150, estimatedDays: 'Same Day' }],
      specifications: [{ key: 'Platforms', value: 'Instagram, Facebook, YouTube, Twitter' }]
    });

    // ════════════════════════════════════════════════════════════
    // 12. FINISHING & BINDING SERVICES
    // ════════════════════════════════════════════════════════════

    products.push({
      name: 'Glossy & Matte Lamination',
      slug: 'glossy-matte-lamination',
      sku: sku('FB', 1),
      category: C['Finishing & Binding Services'],
      description: 'Machine lamination service for posters, brochures, certificates, photos and ID documents. Glossy lamination enhances colours; matte lamination gives premium non-glare look.',
      images: [IMG.lamination],
      isFeatured: false, isBestSeller: false,
      basePrice: 5,
      variants: {
        sizes: [{ name: 'A4 Sheet', priceModifier: 0 }, { name: 'A3 Sheet', priceModifier: 8 }, { name: 'A2 Sheet', priceModifier: 20 }, { name: 'A1 Sheet', priceModifier: 40 }],
        materials: [{ name: 'Glossy Lamination', priceModifier: 0 }, { name: 'Matte Lamination', priceModifier: 2 }, { name: 'Soft Touch Velvet Lamination', priceModifier: 5 }],
        finishes: [{ name: 'Single Side', priceModifier: 0 }, { name: 'Double Side', priceModifier: 3 }]
      },
      bulkPricing: [{ minQty: 10, discountPercentage: 0, pricePerUnit: 5 }, { minQty: 50, discountPercentage: 10, pricePerUnit: 4.5 }, { minQty: 100, discountPercentage: 20, pricePerUnit: 4 }],
      turnaroundOptions: [{ name: 'Same Day', extraFee: 0, estimatedDays: 'Same Day' }],
      specifications: [{ key: 'Types', value: 'Glossy / Matte / Velvet' }, { key: 'Machine', value: 'Thermal Hot Lamination' }]
    });

    products.push({
      name: 'Spiral Binding',
      slug: 'spiral-binding',
      sku: sku('FB', 2),
      category: C['Finishing & Binding Services'],
      description: 'Spiral / coil binding for reports, presentations, calendars, notebooks and training manuals. Available in plastic coil and wire-o binding with clear or printed covers.',
      images: [IMG.binding],
      isFeatured: false, isBestSeller: false,
      basePrice: 50,
      variants: {
        sizes: [{ name: 'Up to 50 Pages', priceModifier: 0 }, { name: '51–100 Pages', priceModifier: 30 }, { name: '101–200 Pages', priceModifier: 60 }],
        materials: [{ name: 'Plastic Coil Spiral', priceModifier: 0 }, { name: 'Wire-O Double Loop', priceModifier: 30 }],
        finishes: [{ name: 'Clear PVC Cover + Back Board', priceModifier: 0 }, { name: 'Printed Cover + Back Board', priceModifier: 80 }]
      },
      bulkPricing: singleItem(50),
      turnaroundOptions: [{ name: 'Same Day', extraFee: 0, estimatedDays: 'Same Day' }],
      specifications: [{ key: 'Types', value: 'Plastic Coil / Wire-O' }, { key: 'Cover', value: 'Clear PVC / Printed' }]
    });

    products.push({
      name: 'Soft & Hard Binding',
      slug: 'soft-hard-binding',
      sku: sku('FB', 3),
      category: C['Finishing & Binding Services'],
      description: 'Perfect-bound soft cover and case-bound hard cover book binding for thesis, project reports, annual reports and corporate documents.',
      images: [IMG.binding],
      isFeatured: false, isBestSeller: false,
      basePrice: 120,
      variants: {
        sizes: [{ name: 'A4 Soft Binding (Up to 100 pages)', priceModifier: 0 }, { name: 'A4 Soft Binding (101–200 pages)', priceModifier: 60 }, { name: 'A4 Hard Binding', priceModifier: 180 }],
        materials: [{ name: 'Soft Bound (Perfect Bind)', priceModifier: 0 }, { name: 'Hard Bound (Case Bind)', priceModifier: 180 }],
        finishes: [{ name: 'Plain Cover', priceModifier: 0 }, { name: 'Printed Cover (Gloss)', priceModifier: 100 }, { name: 'Gold Lettering (Hard Bound)', priceModifier: 80 }]
      },
      bulkPricing: singleItem(120),
      turnaroundOptions: stdTurnaround,
      specifications: [{ key: 'Types', value: 'Soft / Hard Bound' }, { key: 'Use', value: 'Thesis / Report / Book' }]
    });

    // ─── Insert all products ──────────────────────────────────────────────────
    const productDocs = await Product.insertMany(products);
    console.log('✅ Products seeded:', productDocs.length);

    // ─── Coupons ─────────────────────────────────────────────────────────────
    await Coupon.insertMany([
      { code: 'PRINT15', discountType: 'percentage', discountValue: 15, minOrderAmount: 500, maxDiscount: 500, validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), usageLimit: 1000, isActive: true },
      { code: 'NEWORDER', discountType: 'fixed', discountValue: 200, minOrderAmount: 800, maxDiscount: 200, validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), usageLimit: 500, isActive: true },
      { code: 'BULK500', discountType: 'percentage', discountValue: 10, minOrderAmount: 5000, maxDiscount: 1000, validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), usageLimit: 200, isActive: true },
    ]);
    console.log('✅ Coupons seeded');

    // ─── CMS ─────────────────────────────────────────────────────────────────
    await CMS.create({
      banners: [
        { title: 'Premium Business Cards from ₹150', subtitle: 'Ultra-thick 450 GSM with Spot UV, Gold Foil & Soft Touch finishes', image: IMG.visitingCard, link: '/catalog?category=business-printing', buttonText: 'Order Visiting Cards' },
        { title: 'Shop Boards & Flex Printing', subtitle: 'Outdoor LED signs, ACP boards, flex banners from ₹35/sq ft', image: IMG.ledSign, link: '/catalog?category=large-format-printing', buttonText: 'Get a Quote' },
        { title: 'Wedding Invitations & Décor', subtitle: 'Laser cut cake toppers, foil stamped cards and premium invitations', image: IMG.invitation, link: '/catalog?category=wedding-event-printing', buttonText: 'Explore Collections' },
      ],
      testimonials: [
        { name: 'Arjun Mehta', company: 'Mehta & Co. Jewellers', rating: 5, comment: 'The acrylic shop board and visiting cards exceeded our expectations. Fast delivery, amazing quality!' },
        { name: 'Priya Nair', company: 'Wedding Planner', rating: 5, comment: 'Ordered laser cut wedding décor and invitation cards. The team was very professional and delivered on time.' },
        { name: 'Ravi Kumar', company: 'Tech Startup CEO', rating: 5, comment: 'Got our logo designed and company brochures printed. Great quality at very competitive rates.' },
      ],
      faqs: [
        { question: 'What file format do you accept for printing?', answer: 'We accept PDF (print-ready preferred), AI, EPS, PSD, high-resolution PNG and TIFF. Minimum 300 DPI for clear print output.' },
        { question: 'What is the minimum order quantity (MOQ)?', answer: 'MOQ varies by product. Visiting cards start at 100 pcs, stickers at 50 pcs, and single-piece items like ID cards and standees have no MOQ.' },
        { question: 'Do you provide design services?', answer: 'Yes! Our graphic design team offers logo design, brochure design, flyer design and all print design services. Check our Graphic Design Services category.' },
        { question: 'How long does delivery take?', answer: 'Standard production is 2-3 business days. Express and same-day options are available at an additional rush fee for most products.' },
      ],
      announcementBar: { text: '🎉 Use code PRINT15 for 15% OFF on all orders above ₹500 | Free Design Consultation Available!', isActive: true, link: '/catalog' }
    });
    console.log('✅ CMS seeded');

    // ─── Sample Order ─────────────────────────────────────────────────────────
    const bcProd = productDocs.find(p => p.slug === 'standard-visiting-card');
    if (bcProd) {
      await Order.create({
        orderNumber: 'CLX-001001',
        customer: customer._id,
        items: [{ product: bcProd._id, title: bcProd.name, variantSelections: { size: '3.5" x 2" Standard', material: '300 GSM Art Paper', finish: 'Glossy UV Coating', turnaround: 'Standard (2-3 Business Days)' }, quantity: 500, unitPrice: 120, calculatedPrice: 60000 }],
        totalAmount: 60000, discountAmount: 9000, taxAmount: 9180, shippingAmount: 0, finalAmount: 60180,
        couponCode: 'PRINT15',
        shippingAddress: customer.addresses[0],
        paymentMethod: 'razorpay', paymentStatus: 'paid', orderStatus: 'Printing'
      });
    }
    console.log('✅ Sample order seeded');

    console.log('\n🎉 Full printing store catalog seeded successfully!');
    console.log(`   📦 ${catDocs.length} categories`);
    console.log(`   🛍️  ${productDocs.length} products`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedData();
