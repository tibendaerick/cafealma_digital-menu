const crypto = require('crypto');

const WA = process.env.WHATSAPP_NUMBER || '256751120144';
const SECRET = process.env.SIGNING_SECRET || 'change-this-secret';
const sign = s => crypto.createHmac('sha256', SECRET).update(s).digest('hex');
const fail = (res, code, message) => res.status(code).json({ success: false, message });

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return fail(res, 405, 'Method not allowed');
  try {
    const b = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const { orderId, location, total, token } = b;
    if (!orderId || !location || !Number.isInteger(total) || typeof token !== 'string') return fail(res, 400, 'Invalid bill request.');

    const good = Buffer.from(sign(`${orderId}|${location}|${total}`));
    const got = Buffer.from(token);
    if (good.length !== got.length || !crypto.timingSafeEqual(good, got)) return fail(res, 403, 'This order could not be verified.');

    const time = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Kampala' });
    const L = '------------------------------------';
    const msg = [
      `🧾 *BILL REQUEST - ${String(location).replace('Table ', 'Table #')}*`,
      '*CAFE ALMA FOODS - MUBENDE*', L,
      `🆔 *Order:* ${orderId}`,
      `💰 *Amount due:* UGX ${total.toLocaleString('en-US')}`,
      `🕒 ${time}`, L,
      '_Sent via Digital Table Menu_'
    ].join('\n');

    return res.status(200).json({ success: true, waUrl: `https://wa.me/${WA}?text=${encodeURIComponent(msg)}` });
  } catch (err) {
    console.error('request-bill error:', err);
    return fail(res, 500, 'Something went wrong. Please try again.');
  }
};