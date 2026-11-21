import Order from '../models/Order.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import DesignRequest from '../models/DesignRequest.js';
import { exportSalesToCsv } from '../utils/salesExporter.js';

export const getDashboardAnalytics = async (req, res) => {
  try {
    const orders = await Order.find().populate('customer', 'name email').sort({ createdAt: -1 });
    const customersCount = await User.countDocuments({ role: 'customer' });
    const pendingProofsCount = await DesignRequest.countDocuments({ status: 'pending_proof' });
    const totalProductsCount = await Product.countDocuments();

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((acc, order) => acc + (order.finalAmount || 0), 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const statusCounts = {
      Pending: 0,
      'Design Review': 0,
      Printing: 0,
      Shipped: 0,
      Delivered: 0,
      Cancelled: 0
    };

    orders.forEach(order => {
      if (statusCounts[order.orderStatus] !== undefined) {
        statusCounts[order.orderStatus]++;
      }
    });

    const salesByDate = {};
    orders.forEach(order => {
      const dateKey = new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (!salesByDate[dateKey]) {
        salesByDate[dateKey] = { date: dateKey, revenue: 0, orders: 0 };
      }
      salesByDate[dateKey].revenue += order.finalAmount;
      salesByDate[dateKey].orders += 1;
    });

    const revenueChartData = Object.values(salesByDate).slice(-7);

    const productSalesMap = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        const pName = item.title;
        if (!productSalesMap[pName]) {
          productSalesMap[pName] = { name: pName, quantity: 0, totalRevenue: 0 };
        }
        productSalesMap[pName].quantity += item.quantity;
        productSalesMap[pName].totalRevenue += item.calculatedPrice;
      });
    });

    const topProducts = Object.values(productSalesMap)
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 5);

    return res.json({
      success: true,
      data: {
        metrics: {
          totalRevenue: Number(totalRevenue.toFixed(2)),
          totalOrders,
          customersCount,
          avgOrderValue: Number(avgOrderValue.toFixed(2)),
          pendingProofsCount,
          totalProductsCount
        },
        statusDistribution: Object.entries(statusCounts).map(([name, value]) => ({ name, value })),
        revenueTrend: revenueChartData,
        topProducts,
        recentOrders: orders.slice(0, 6)
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const exportSalesReport = async (req, res) => {
  try {
    const orders = await Order.find().populate('customer', 'name email').sort({ createdAt: -1 });
    const csvData = exportSalesToCsv(orders);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=ColorLex_Sales_Report_${Date.now()}.csv`);
    return res.status(200).send(csvData);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
