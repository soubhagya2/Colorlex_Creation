export const exportSalesToCsv = (orders) => {
  const headers = [
    'Order Number',
    'Customer Name',
    'Customer Email',
    'Date',
    'Items Count',
    'Status',
    'Payment Method',
    'Payment Status',
    'Total Amount (₹)'
  ];

  const rows = orders.map(order => [
    order.orderNumber,
    `"${order.customer?.name || order.guestInfo?.name || 'Guest'}"`,
    `"${order.customer?.email || order.guestInfo?.email || 'N/A'}"`,
    new Date(order.createdAt).toISOString().split('T')[0],
    order.items?.length || 0,
    order.orderStatus,
    order.paymentMethod,
    order.paymentStatus,
    order.finalAmount.toFixed(2)
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
};
