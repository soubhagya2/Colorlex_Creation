import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  title: { type: String, required: true },
  variantSelections: {
    size: { type: String, default: '' },
    material: { type: String, default: '' },
    finish: { type: String, default: '' },
    turnaround: { type: String, default: 'Standard' }
  },
  quantity: { type: Number, required: true, default: 1 },
  unitPrice: { type: Number, required: true },
  calculatedPrice: { type: Number, required: true },
  artworkUrl: { type: String, default: '' },
  designRequestId: { type: mongoose.Schema.Types.ObjectId, ref: 'DesignRequest', default: null }
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    guestInfo: {
      name: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' }
    },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    discountAmount: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    shippingAmount: { type: Number, default: 0 },
    finalAmount: { type: Number, required: true },
    couponCode: { type: String, default: '' },
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, default: 'India' }
    },
    paymentMethod: {
      type: String,
      enum: ['stripe_mock', 'razorpay_mock', 'razorpay', 'stripe', 'cod', 'upi'],
      default: 'razorpay_mock'
    },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'paid' },
    orderStatus: {
      type: String,
      enum: ['Pending', 'Design Review', 'Printing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending'
    },
    trackingInfo: {
      carrier: { type: String, default: '' },
      trackingNumber: { type: String, default: '' },
      shippedAt: { type: Date, default: null },
      estimatedDelivery: { type: String, default: '' }
    },
    invoiceUrl: { type: String, default: '' }
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model('Order', orderSchema);
