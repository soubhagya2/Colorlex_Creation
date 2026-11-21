export const generateInvoiceHtml = (order) => {
  const customerName = order.customer?.name || order.guestInfo?.name || 'Valued Customer';
  const customerEmail = order.customer?.email || order.guestInfo?.email || 'N/A';
  const customerPhone = order.customer?.phone || order.guestInfo?.phone || 'N/A';
  const orderDate = new Date(order.createdAt || Date.now()).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const itemsRows = order.items
    .map(
      (item, idx) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${idx + 1}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        <strong>${item.title}</strong><br/>
        <small style="color: #666;">
          Size: ${item.variantSelections?.size || 'Standard'} | 
          Material: ${item.variantSelections?.material || 'Standard'} | 
          Finish: ${item.variantSelections?.finish || 'None'}
        </small>
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.unitPrice.toFixed(2)}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.calculatedPrice.toFixed(2)}</td>
    </tr>
  `
    )
    .join('');

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Invoice #${order.orderNumber}</title>
    <style>
      body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #333; margin: 0; padding: 20px; }
      .invoice-box { max-width: 800px; margin: auto; padding: 30px; border: 1px solid #eee; box-shadow: 0 0 10px rgba(0, 0, 0, 0.15); border-radius: 8px; }
      .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #7c3aed; padding-bottom: 20px; margin-bottom: 20px; }
      .company-title { font-size: 28px; font-weight: bold; color: #7c3aed; }
      .table { width: 100%; border-collapse: collapse; text-align: left; }
      .table th { background: #f5f3ff; color: #5b21b6; padding: 10px; font-size: 14px; }
      .totals { margin-top: 20px; float: right; width: 300px; }
      .totals table { width: 100%; }
      .totals td { padding: 5px 0; }
      .footer { margin-top: 50px; text-align: center; color: #888; font-size: 12px; }
    </style>
  </head>
  <body>
    <div class="invoice-box">
      <div class="header">
        <div>
          <div class="company-title">ColorLex Creation</div>
          <div>Premium Printing & Packaging Solutions</div>
          <small>Support: colorlexcreation@gmail.com | Phone: +91 77352 49873</small>
        </div>
        <div style="text-align: right;">
          <h2 style="margin: 0; color: #4c1d95;">INVOICE</h2>
          <p style="margin: 5px 0 0 0; color: #666;">#${order.orderNumber}</p>
          <small>Date: ${orderDate}</small>
        </div>
      </div>

      <table style="width: 100%; margin-bottom: 25px;">
        <tr>
          <td style="width: 50%; vertical-align: top;">
            <strong>Billed To:</strong><br/>
            ${customerName}<br/>
            ${customerEmail}<br/>
            Phone: ${customerPhone}
          </td>
          <td style="width: 50%; vertical-align: top;">
            <strong>Shipping Address:</strong><br/>
            ${order.shippingAddress?.street || ''}, ${order.shippingAddress?.city || ''}<br/>
            ${order.shippingAddress?.state || ''} - ${order.shippingAddress?.zipCode || ''}<br/>
            Payment Method: <strong>${(order.paymentMethod || 'Stripe').toUpperCase()}</strong> (${order.paymentStatus})
          </td>
        </tr>
      </table>

      <table class="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Item & Specifications</th>
            <th style="text-align: center;">Qty</th>
            <th style="text-align: right;">Unit Price</th>
            <th style="text-align: right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsRows}
        </tbody>
      </table>

      <div class="totals">
        <table>
          <tr>
            <td>Subtotal:</td>
            <td style="text-align: right;">₹${order.totalAmount.toFixed(2)}</td>
          </tr>
          ${
            order.discountAmount > 0
              ? `<tr><td>Discount:</td><td style="text-align: right; color: #dc2626;">-₹${order.discountAmount.toFixed(2)}</td></tr>`
              : ''
          }
          <tr>
            <td>Shipping:</td>
            <td style="text-align: right;">₹${(order.shippingAmount || 0).toFixed(2)}</td>
          </tr>
          <tr style="font-weight: bold; font-size: 18px; border-top: 1px solid #ccc; color: #7c3aed;">
            <td>Total Paid:</td>
            <td style="text-align: right;">₹${order.finalAmount.toFixed(2)}</td>
          </tr>
        </table>
      </div>
      <div style="clear: both;"></div>

      <div class="footer">
        <p>Thank you for choosing ColorLex Creation! For order status updates visit colorlex.com</p>
      </div>
    </div>
  </body>
  </html>
  `;
};
