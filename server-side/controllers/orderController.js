import Order from '../models/Order.js';
import Coupon from '../models/Coupon.js';
import Product from '../models/Product.js';
import { calculateProductPrice } from '../utils/priceCalculator.js';
import { generateInvoiceHtml } from '../utils/invoiceGenerator.js';

export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, couponCode, guestInfo } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart items cannot be empty' });
    }

    let calculatedItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) continue;

      const calc = calculateProductPrice({
        product,
        selectedSize: item.variantSelections?.size,
        selectedMaterial: item.variantSelections?.material,
        selectedFinish: item.variantSelections?.finish,
        selectedTurnaround: item.variantSelections?.turnaround,
        quantity: item.quantity
      });

      calculatedItems.push({
        product: product._id,
        title: product.name,
        variantSelections: item.variantSelections || {},
        quantity: item.quantity,
        unitPrice: calc.finalUnitPrice,
        calculatedPrice: calc.totalPrice,
        artworkUrl: item.artworkUrl || '',
        designRequestId: item.designRequestId || null
      });

      totalAmount += calc.totalPrice;
    }

    let discountAmount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (coupon && new Date() <= new Date(coupon.validUntil) && totalAmount >= coupon.minOrderAmount) {
        if (coupon.discountType === 'percentage') {
          discountAmount = (totalAmount * coupon.discountValue) / 100;
          if (coupon.maxDiscount > 0 && discountAmount > coupon.maxDiscount) {
            discountAmount = coupon.maxDiscount;
          }
        } else {
          discountAmount = coupon.discountValue;
        }
        coupon.usedCount += 1;
        await coupon.save();
      }
    }

    const shippingAmount = totalAmount > 2000 ? 0 : 150;
    const taxAmount = (totalAmount - discountAmount) * 0.18;
    const finalAmount = Math.max(0, totalAmount - discountAmount + shippingAmount + taxAmount);

    const orderNumber = 'CLX-' + Date.now().toString().substring(3) + Math.floor(Math.random() * 100);

    const order = await Order.create({
      orderNumber,
      customer: req.user ? req.user._id : null,
      guestInfo: req.user ? undefined : guestInfo,
      items: calculatedItems,
      totalAmount,
      discountAmount,
      taxAmount,
      shippingAmount,
      finalAmount,
      couponCode: couponCode || '',
      shippingAddress,
      paymentMethod: paymentMethod || 'stripe_mock',
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      orderStatus: 'Pending'
    });

    return res.status(201).json({ success: true, data: order });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 });
    return res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email phone')
      .populate('items.product', 'name images slug');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (req.user && req.user.role === 'customer' && order.customer?._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized to view this order' });
    }

    return res.json({ success: true, data: order });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = {};

    if (status) {
      query.orderStatus = status;
    }

    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'shippingAddress.city': { $regex: search, $options: 'i' } }
      ];
    }

    const orders = await Order.find(query)
      .populate('customer', 'name email phone')
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 });

    return res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['Pending', 'Design Review', 'Printing', 'Shipped', 'Delivered', 'Cancelled'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid order status' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.orderStatus = status;
    if (status === 'Delivered') {
      order.paymentStatus = 'paid';
    }

    await order.save();

    return res.json({
      success: true,
      message: `Order status updated to ${status}`,
      data: order
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTrackingInfo = async (req, res) => {
  try {
    const { carrier, trackingNumber, estimatedDelivery } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.trackingInfo = {
      carrier: carrier || 'BlueDart / FedEx Express',
      trackingNumber: trackingNumber || 'TRK-' + Math.floor(Math.random() * 900000 + 100000),
      shippedAt: new Date(),
      estimatedDelivery: estimatedDelivery || '2-3 Business Days'
    };
    order.orderStatus = 'Shipped';

    await order.save();
    return res.json({ success: true, message: 'Tracking information updated', data: order });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrderInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('customer', 'name email phone');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    const html = generateInvoiceHtml(order);
    return res.send(html);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
