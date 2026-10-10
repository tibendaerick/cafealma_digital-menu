const crypto = require('crypto');
const MENU = require('../menu-data.js');

const WA = process.env.WHATSAPP_NUMBER || '256751120144';
const SECRET = process.env.SIGNING_SECRET || 'change-this-secret';
const FEES = { DELIVERY: 5000, 'VIP Balcony': 5000, PICKUP: 0 };
const FREE_FROM = 25000;
const OFFER_END = new Date('2026-12-01T00:00:00+03:00');
const LOCS = new Set([...Array.from({ length: 6 }, (_, i) => 'Table ' + String(i + 1).padStart(2, '0')), 'VIP Balcony', 'PICKUP', 'DELIVERY']);
const ITEMS = {};
Object.values(MENU).forEach(list => list.forEach(i => (ITEMS[i.id] = i)));

const hits = new Map();
const limited = ip => {
  const now = Date.now();
  const a = (hits.get(ip) || []).filter(t => now - t < 60000);
  a.push(now); hits.set(ip, a);
  if (hits.size > 5000) hits.clear();
  return a.length > 30;
};
const clean = (s, n) => String(s || '').replace(/[*_~`]/g, '').replace(/\s+/g, ' ').trim().slice(0, n);
const fmt = n => n.toLocaleString('en-US');
const sign = s => crypto.createHmac('sha256', SECRET).update(s).digest('hex');
const fail = (res, code, message) => res.status(code).json({ success: false, message });

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return fail(res, 405, 'Method not allowed');
  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'x';
  if (limited(ip)) return fail(res, 429, 'Too many requests. Please wait a minute.');

  try {
    const b = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    if (b.hp) return fail(res, 400, 'Request rejected.');
    if (!LOCS.has(b.location)) return fail(res, 400, 'Please choose your table or delivery.');
    if (!Array.isArray(b.items) || !b.items.length || b.items.length > 40) return fail(res, 400, 'Your cart is empty.');

    let sub = 0;
    const lines = [];
    for (const it of b.items) {
      const item = ITEMS[it && it.id];
      const qty = Number(it && it.qty);
      if (!item || !Number.isInteger(qty) || qty < 1 || qty > 50) return fail(res, 400, 'An item in your cart is no longer available.');
      sub += item.price * qty;
      lines.push(`• ${qty}x ${item.name} @ UGX ${fmt(item.price)} = *UGX ${fmt(item.price * qty)}*`);
    }

    const loc = b.location;
    const isDel = loc === 'DELIVERY';
    const isPick = loc === 'PICKUP';
    const inTown = b.area === 'in';
    const fee = isDel && inTown && sub >= FREE_FROM && new Date() < OFFER_END ? 0 : (FEES[loc] || 0);
    const total = sub + fee;
    const pay = b.payment === 'Mobile Money' ? 'Mobile Money' : isPick ? 'Cash on pickup' : isDel ? 'Cash on delivery' : 'Cash';
    const notes = clean(b.notes, 300);
    let name, phone, address;
    if (isDel || isPick) {
      name = clean(b.name, 60); phone = clean(b.phone, 20); address = isDel ? clean(b.address, 120) : '';
      if (!name || !phone || (isDel && !address)) return fail(res, 400, isPick ? 'Please fill in your name and phone number.' : 'Please fill in your name, phone and address.');
    }

    const orderId = `CA-${Date.now().toString(36).slice(-4).toUpperCase()}${crypto.randomInt(10, 100)}`;
    const time = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Kampala' });
    const L = '------------------------------------';

    const out = [
      isDel ? '🛵 *NEW DELIVERY ORDER*' : isPick ? '🛍️ *NEW PICKUP ORDER*' : `🍽️ *NEW TABLE ORDER - ${loc.replace('Table ', 'Table #')}*`,
      '*CAFE ALMA FOODS - MUBENDE*',
      `🆔 *Order:* ${orderId}   🕒 ${time}`, L
    ];
    if (isDel || isPick) out.push(`👤 *Customer:* ${name}`, `📞 *Phone:* ${phone}`, ...(isDel ? [`📍 *Address:* ${address}`, `🗺️ *Area:* ${inTown ? 'Within Mubende Municipality' : 'Outside Mubende Municipality'}`] : ['⏱️ *Ready in:* about 5–10 minutes']), L);
    out.push(...lines, L);
    if (isDel) out.push(fee ? `Delivery fee: UGX ${fmt(fee)}` : 'Delivery fee: *FREE* (offer)');
    else if (fee) out.push(`VIP charge: UGX ${fmt(fee)}`);
    out.push(`💰 *TOTAL PAYABLE:* UGX ${fmt(total)}`, `💳 *Payment Method:* ${pay}`);
    if (notes) out.push(`📝 *Special Instructions:* ${notes}`);
    out.push(L, '_Sent via Digital Table Menu_');

    return res.status(200).json({
      success: true,
      orderId,
      total,
      token: sign(`${orderId}|${loc}|${total}`),
      waUrl: `https://wa.me/${WA}?text=${encodeURIComponent(out.join('\n'))}`
    });
  } catch (err) {
    console.error('create-order error:', err);
    return fail(res, 500, 'Something went wrong. Please try again.');
  }
};