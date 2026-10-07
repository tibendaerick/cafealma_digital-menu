(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const WA = '256751120144';
  const FEES = { DELIVERY: 3000, 'VIP Balcony': 5000 };
  const PH = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23f3e3d3'/%3E%3C/svg%3E";

  const ITEMS = {};
  Object.values(MENU_DATA).forEach(list => list.forEach(i => (ITEMS[i.id] = i)));

  const get = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) || d; } catch (e) { return d; } };
  const put = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  const fmt = n => Number(n).toLocaleString('en-US');

  let cart = get('alma_cart', {});
  Object.keys(cart).forEach(id => { if (!ITEMS[id] || !(cart[id] > 0)) delete cart[id]; });
  let orders = get('alma_orders', []).filter(o => Date.now() - o.t < 8 * 36e5);
  let cat = 'all', q = '', timer;

  /* ---------- helpers ---------- */
  const open = id => { $('#' + id).classList.add('open'); document.body.style.overflow = 'hidden'; };
  const close = id => {
    $('#' + id).classList.remove('open');
    if (!document.querySelector('.overlay.open')) document.body.style.overflow = '';
  };
  const toast = m => {
    const t = $('#toast');
    t.textContent = m; t.classList.remove('hidden');
    clearTimeout(t._t); t._t = setTimeout(() => t.classList.add('hidden'), 3200);
  };
  const sub = () => Object.entries(cart).reduce((s, [id, n]) => s + ITEMS[id].price * n, 0);
  const count = () => Object.values(cart).reduce((s, n) => s + n, 0);
  const fee = () => FEES[$('#loc').value] || 0;

  /* ---------- location dropdown ---------- */
  const LOCS = [...Array.from({ length: 12 }, (_, i) => 'Table ' + String(i + 1).padStart(2, '0')), 'VIP Balcony', 'DELIVERY'];
  const LBL = { 'VIP Balcony': 'VIP Balcony (+5,000)', DELIVERY: 'Home / Office Delivery (+3,000)' };
  $('#loc').innerHTML = '<option value="">📍 Choose table or delivery</option>' +
    LOCS.map(l => `<option value="${l}">${LBL[l] || l}</option>`).join('');

  (function fromUrl() {
    const p = new URLSearchParams(location.search);
    const v = (p.get('table') || p.get('location') || '').trim();
    if (!v) return;
    let t = /^vip/i.test(v) ? 'VIP Balcony' : /^deliver/i.test(v) ? 'DELIVERY' : 'Table ' + v.replace(/\D/g, '').padStart(2, '0');
    if (LOCS.includes(t)) $('#loc').value = t;
  })();

  /* ---------- menu ---------- */
  const ctl = id => cart[id]
    ? `<button class="q" data-a="dec" data-id="${id}" aria-label="Remove one">−</button><span class="n">${cart[id]}</span><button class="q" data-a="inc" data-id="${id}" aria-label="Add one">+</button>`
    : `<button class="add" data-a="inc" data-id="${id}">+ Add</button>`;

  const card = i => `<article class="card" data-id="${i.id}">
    <div class="img"><img src="${encodeURI(i.img)}" alt="${i.name}" loading="lazy" decoding="async" width="400" height="300">${i.badge ? `<span class="badge">${i.badge}</span>` : ''}</div>
    <div class="info"><h4>${i.name}</h4><p>${i.desc}</p>
      <div class="foot"><b>UGX ${fmt(i.price)}</b><span class="ctl">${ctl(i.id)}</span></div></div></article>`;

  function renderMenu() {
    const pool = cat === 'all' ? Object.values(MENU_DATA).flat() : MENU_DATA[cat] || [];
    const list = pool.filter(i => !q || i.name.toLowerCase().includes(q) || i.desc.toLowerCase().includes(q));
    $('#menu').innerHTML = list.length ? list.map(card).join('') : '<div class="empty">No menu items matched your search.</div>';
  }
  $('#menu').addEventListener('error', e => {
    if (e.target.tagName === 'IMG' && !e.target.src.startsWith('data:')) e.target.src = PH;
  }, true);

  /* ---------- cart ---------- */
  function change(id, d) {
    if (!ITEMS[id]) return;
    const n = Math.min(50, (cart[id] || 0) + d);
    if (n <= 0) delete cart[id]; else cart[id] = n;
    document.querySelectorAll(`.card[data-id="${id}"] .ctl`).forEach(el => (el.innerHTML = ctl(id)));
    refresh();
    if ($('#cartSheet').classList.contains('open')) renderCart();
  }

  function refresh() {
    const c = count();
    $('#cartBar').classList.toggle('hidden', !c);
    $('#cartCount').textContent = c;
    $('#cartTotal').textContent = 'UGX ' + fmt(sub() + fee());
    put('alma_cart', cart);
    if (!c) close('cartSheet');
  }

  function renderCart() {
    const loc = $('#loc').value;
    $('#cartList').innerHTML = Object.entries(cart).map(([id, n]) => {
      const i = ITEMS[id];
      return `<div class="row"><div><b>${i.name}</b><br><small class="mut">UGX ${fmt(i.price)} × ${n} = UGX ${fmt(i.price * n)}</small></div>
        <div class="ctl"><button class="q" data-a="dec" data-id="${id}">−</button><span class="n">${n}</span><button class="q" data-a="inc" data-id="${id}">+</button></div></div>`;
    }).join('');
    $('#delivery').classList.toggle('hidden', loc !== 'DELIVERY');
    $('#sFeeLbl').textContent = loc === 'DELIVERY' ? 'Delivery fee' : loc === 'VIP Balcony' ? 'VIP charge' : 'Service fee';
    $('#sSub').textContent = 'UGX ' + fmt(sub());
    $('#sFee').textContent = 'UGX ' + fmt(fee());
    $('#sTot').textContent = 'UGX ' + fmt(sub() + fee());
    $('#placeBtn').textContent = 'Place order · UGX ' + fmt(sub() + fee());
  }

  async function place() {
    const loc = $('#loc').value;
    if (!loc) { close('cartSheet'); toast('Please choose your table or delivery first.'); $('#loc').focus(); return; }
    const body = {
      items: Object.entries(cart).map(([id, qty]) => ({ id, qty })),
      location: loc, notes: $('#notes').value.trim(), payment: $('#pay').value, hp: $('#hp').value
    };
    if (loc === 'DELIVERY') {
      body.name = $('#dName').value.trim(); body.phone = $('#dPhone').value.trim(); body.address = $('#dAddr').value.trim();
      if (!body.name || !body.phone || !body.address) return toast('Please fill in your name, phone and address.');
    }
    const btn = $('#placeBtn'); btn.disabled = true; btn.textContent = 'Preparing your order…';
    try {
      const r = await fetch('/api/create-order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const d = await r.json().catch(() => ({}));
      if (!r.ok || !d.success) throw new Error(d.message || 'Could not place your order.');
      orders.push({ id: d.orderId, loc, total: d.total, token: d.token, t: Date.now() });
      put('alma_orders', orders);
      cart = {}; $('#notes').value = '';
      renderMenu(); refresh(); syncBill();
      close('cartSheet');
      $('#sentId').textContent = d.orderId; $('#waLink').href = d.waUrl;
      open('sentSheet');
    } catch (e) {
      toast(e.message === 'Failed to fetch' ? 'No connection. Please try again.' : e.message);
    } finally { btn.disabled = false; renderCart(); }
  }

  /* ---------- bill ---------- */
  const billOrders = () => { const l = $('#loc').value; return l && l !== 'DELIVERY' ? orders.filter(o => o.loc === l) : []; };
  function syncBill() {
    const ok = billOrders().length > 0;
    $('#billBtn').classList.toggle('locked', !ok);
    $('#billIcon').textContent = ok ? '✅' : '🔒';
  }
  function openBill() {
    const list = billOrders();
    if (!list.length) return toast('Place an order first to unlock your bill.');
    $('#billList').innerHTML = list.map(o => `<div class="row"><div><b>${o.id}</b><br><small class="mut">UGX ${fmt(o.total)} · ${new Date(o.t).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</small></div>
      <button class="cta sm" data-bill="${o.id}">Request bill</button></div>`).join('');
    open('billSheet');
  }
  async function requestBill(id, el) {
    const o = orders.find(x => x.id === id); if (!o) return;
    el.disabled = true;
    try {
      const r = await fetch('/api/request-bill', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: o.id, location: o.loc, total: o.total, token: o.token }) });
      const d = await r.json().catch(() => ({}));
      if (!r.ok || !d.success) throw new Error(d.message || 'Could not request the bill.');
      el.outerHTML = `<a class="cta sm" href="${d.waUrl}" target="_blank" rel="noopener">Send on WhatsApp</a>`;
    } catch (e) { toast(e.message === 'Failed to fetch' ? 'No connection. Please try again.' : e.message); el.disabled = false; }
  }

  /* ---------- waiter ---------- */
  function callWaiter(reason) {
    const loc = $('#loc').value;
    close('waiterSheet');
    const msg = `🔔 *WAITER CALL - ${loc.replace('Table ', 'Table #')}*\n*CAFE ALMA FOODS - MUBENDE*\n------------------------------------\n📝 *Request:* ${reason}\n------------------------------------\n_Sent via Digital Table Menu_`;
    location.href = `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
  }

  /* ---------- events ---------- */
  document.addEventListener('click', e => {
    const t = e.target;
    const a = t.closest('[data-a]'); if (a) return change(a.dataset.id, a.dataset.a === 'inc' ? 1 : -1);
    const w = t.closest('[data-w]'); if (w) return callWaiter(w.dataset.w);
    const b = t.closest('[data-bill]'); if (b) return requestBill(b.dataset.bill, b);
    const x = t.closest('[data-close]'); if (x) return close(x.closest('.overlay').id);
    if (t.classList.contains('overlay')) close(t.id);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') document.querySelectorAll('.overlay.open').forEach(o => close(o.id));
  });

  $('#cats').addEventListener('click', e => {
    const b = e.target.closest('.cat'); if (!b) return;
    document.querySelectorAll('.cat').forEach(x => x.classList.toggle('active', x === b));
    cat = b.dataset.cat; renderMenu();
  });
  $('#search').addEventListener('input', e => {
    clearTimeout(timer);
    timer = setTimeout(() => { q = e.target.value.toLowerCase().trim(); renderMenu(); }, 150);
  });
  $('#loc').addEventListener('change', () => {
    refresh(); syncBill();
    if ($('#cartSheet').classList.contains('open')) renderCart();
  });
  $('#cartBar').addEventListener('click', () => { renderCart(); open('cartSheet'); });
  $('#placeBtn').addEventListener('click', place);
  $('#billBtn').addEventListener('click', openBill);
  $('#waiterBtn').addEventListener('click', () => {
    const l = $('#loc').value;
    if (!l || l === 'DELIVERY') return toast('Choose your table first.');
    open('waiterSheet');
  });

  const setTheme = t => {
    document.documentElement.dataset.theme = t;
    $('#themeBtn').textContent = t === 'dark' ? '☀️' : '🌙';
    try { localStorage.setItem('alma_theme', t); } catch (e) {}
  };
  $('#themeBtn').addEventListener('click', () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));
  setTheme(document.documentElement.dataset.theme);

  renderMenu(); refresh(); syncBill();
  if ('serviceWorker' in navigator) addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
})();