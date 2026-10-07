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
    const { tableNumber, requestType } = req.body;

    if (!tableNumber) {
      return res.status(400).json({ success: false, message: 'Table number is required.' });
    }

    const type = requestType || 'Bill / Waiter Assistance';
    let message = `*WAITER ALERT / BILL REQUEST*\n`;
    message += `----------------------------\n`;
    message += `*Table:* ${tableNumber}\n`;
    message += `*Request:* ${type}\n`;
    message += `*Time:* ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}\n`;

    const encodedText = encodeURIComponent(message);

    return res.status(200).json({
      success: true,
      message: 'Request generated successfully.',
      whatsappPayload: encodedText
    });

  } catch (error) {
    console.error('Bill request error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message
    });
  }
};