import mongoose from 'mongoose';

const variantOptionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  priceModifier: { type: Number, default: 0 }
});

const bulkPriceSchema = new mongoose.Schema({
  minQty: { type: Number, required: true },
  discountPercentage: { type: Number, default: 0 },
  pricePerUnit: { type: Number, default: 0 }
});

const turnaroundSchema = new mongoose.Schema({
  name: { type: String, required: true },
  extraFee: { type: Number, default: 0 },
  estimatedDays: { type: String, default: '2-3 Business Days' }
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    sku: { type: String, required: true, unique: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    description: { type: String, required: true },
    images: [{ type: String }],
    isFeatured: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    basePrice: { type: Number, required: true, default: 10.0 },
    variants: {
      sizes: [variantOptionSchema],
      materials: [variantOptionSchema],
      finishes: [variantOptionSchema]
    },
    bulkPricing: [bulkPriceSchema],
    turnaroundOptions: [turnaroundSchema],
    specifications: [{ key: String, value: String }],
    rating: { type: Number, default: 4.9 },
    reviewCount: { type: Number, default: 0 },
    reviews: [
      {
        author: { type: String, required: true },
        rating: { type: Number, default: 5 },
        comment: { type: String, required: true },
        date: { type: String, default: 'Recent' },
        verified: { type: Boolean, default: true },
        sizePurchased: { type: String }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model('Product', productSchema);
