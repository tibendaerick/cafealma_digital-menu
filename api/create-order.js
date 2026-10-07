module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const { items, orderType, location, customerName, phone, notes, totalAmount } = req.body;

    // Validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart items cannot be empty.' });
    }

    if (!location) {
      return res.status(400).json({ success: false, message: 'Table number or delivery address is required.' });
    }

    // Format Order ID
    const orderId = `CA-${Math.floor(1000 + Math.random() * 9000)}`;

    // Build WhatsApp formatted message string
    let whatsappText = `*NEW ORDER: ${orderId}*\n`;
    whatsappText += `----------------------------\n`;
    whatsappText += `*Type:* ${orderType === 'dine-in' ? '🍽️ Dine-In' : '🛵 Home Delivery'}\n`;
    whatsappText += `*Location/Table:* ${location}\n`;

    if (customerName) whatsappText += `*Customer:* ${customerName}\n`;
    if (phone) whatsappText += `*Phone:* ${phone}\n`;
    
    whatsappText += `----------------------------\n`;
    whatsappText += `*ITEMS ORDERED:*\n`;

    items.forEach((item, index) => {
      whatsappText += `${index + 1}. ${item.name} x${item.quantity} - UGX ${(item.price * item.quantity).toLocaleString()}\n`;
    });

    whatsappText += `----------------------------\n`;
    whatsappText += `*TOTAL:* UGX ${Number(totalAmount).toLocaleString()}\n`;

    if (notes) {
      whatsappText += `*Notes:* ${notes}\n`;
    }

    // Encoded URL for WhatsApp dispatching
    const encodedText = encodeURIComponent(whatsappText);

    return res.status(200).json({
      success: true,
      orderId: orderId,
      message: 'Order created successfully.',
      whatsappPayload: encodedText
    });

  } catch (error) {
    console.error('Order creation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message
    });
  }
};