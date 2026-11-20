// Target Client Configuration
const CONFIG = {
  restaurantName: "Café Alma Foods - Mubende",
  whatsappNumber: "256766845860", // Replace your cafe manager number
  currency: "UGX"
};

// Menu Inventory Data
const MENU_DATA = [
  {
    id: 101,
    name: "Classic English BreakFast",
    category: "fastfood",
    price: 25000,
    badge: "Popular",
    desc: "100% classic breakfast, farm-fresh eggs cooked any style paired with warm toasted bread, breakfast sausage with choice of melted cheese.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 102,
    name: "Chicken Luch Box",
    category: "mains",
    price: 25000,
    badge: "Chef Pick",
    desc: "Golden crunchy battered chicken pieces served with spicy garlic dip.",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 103,
    name: "Crispy Deep-Fried Chicken Wings(3pcs)",
    category: "fastfood",
    price: 20000,
    badge: null,
    desc: "Golden crunchy battered chicken wings served with spicy tomato dip.",
    image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 104,
    name: "Fresh Passion Fruit Juice (1L)",
    category: "drinks",
    price: 7000,
    badge: "Fresh",
    desc: "Naturally extracted organic local fruit choice juice served ice-cold.",
    image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 105,
    name: "Special Beef Pilau Rice",
    category: "specials",
    price: 15000,
    badge: "Limited",
    desc: "Aromatic spiced beef pilau served with kachumbari salad & banana.",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 106,
    name: "Creamy Chocolate Milkshake",
    category: "drinks",
    price: 12000,
    badge: null,
    desc: "Rich chocolate ice cream blend topped with whipped cream & cocoa dusting.",
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=300&q=80"
  }
];

// Active State
let cart = {}; // Key: itemId, Value: quantity
let currentCategory = "all";

// Helper: Format Currency
function formatMoney(amount) {
  return `${CONFIG.currency} ${amount.toLocaleString()}`;
}

// Render Menu Items
function renderMenu() {
  const container = document.getElementById('menuGrid');
  container.innerHTML = '';

  const filtered = currentCategory === 'all' 
    ? MENU_DATA 
    : MENU_DATA.filter(item => item.category === currentCategory);

  filtered.forEach(item => {
    const qty = cart[item.id] || 0;

    const card = document.createElement('div');
    card.className = 'item-card';
    card.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="item-img" loading="lazy">
      <div class="item-details">
        <div>
          <div class="item-header">
            <h3 class="item-name">${item.name}</h3>
            ${item.badge ? `<span class="item-badge">${item.badge}</span>` : ''}
          </div>
          <p class="item-desc">${item.desc}</p>
        </div>
        <div class="item-bottom">
          <span class="item-price">${formatMoney(item.price)}</span>
          ${qty > 0 ? `
            <div class="qty-control">
              <button class="qty-btn" onclick="updateQty(${item.id}, -1)">-</button>
              <span class="qty-count">${qty}</span>
              <button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
            </div>
          ` : `
            <button class="add-btn" onclick="updateQty(${item.id}, 1)">+ Add</button>
          `}
        </div>
      </div>
    `;
    container.appendChild(card);
  });

  updateCartBar();
}

// Update Cart State
function updateQty(itemId, change) {
  const current = cart[itemId] || 0;
  const next = current + change;

  if (next <= 0) {
    delete cart[itemId];
  } else {
    cart[itemId] = next;
  }

  renderMenu();
}

// Update Bottom Floating Cart Indicator
function updateCartBar() {
  const cartBar = document.getElementById('cartBar');
  const cartBadge = document.getElementById('cartBadge');
  const cartBarTotal = document.getElementById('cartBarTotal');

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);

  if (totalItems > 0) {
    cartBar.classList.remove('hidden');
    cartBadge.textContent = totalItems;
    
    let totalPrice = 0;
    Object.keys(cart).forEach(id => {
      const item = MENU_DATA.find(i => i.id == id);
      if (item) totalPrice += item.price * cart[id];
    });

    cartBarTotal.textContent = formatMoney(totalPrice);
  } else {
    cartBar.classList.add('hidden');
  }
}

// Render Order Summary in Modal Sheet
function renderCartModal() {
  const list = document.getElementById('cartItemsList');
  const subtotalEl = document.getElementById('summarySubtotal');
  const totalEl = document.getElementById('summaryTotal');
  const tableNum = document.getElementById('tableSelect').value;
  document.getElementById('modalTableNum').textContent = `#${tableNum}`;

  list.innerHTML = '';
  let totalPrice = 0;

  Object.keys(cart).forEach(id => {
    const item = MENU_DATA.find(i => i.id == id);
    if (!item) return;

    const qty = cart[id];
    const itemTotal = item.price * qty;
    totalPrice += itemTotal;

    const row = document.createElement('div');
    row.className = 'cart-item-row';
    row.innerHTML = `
      <div>
        <div class="cart-item-title">${item.name}</div>
        <div class="cart-item-sub">${qty} x ${formatMoney(item.price)}</div>
      </div>
      <div style="display:flex; align-items:center; gap:10px;">
        <span style="font-weight:700; font-size:0.85rem;">${formatMoney(itemTotal)}</span>
        <button class="qty-btn" onclick="updateQty(${item.id}, -1)">&times;</button>
      </div>
    `;
    list.appendChild(row);
  });

  subtotalEl.textContent = formatMoney(totalPrice);
  totalEl.textContent = formatMoney(totalPrice);
}

// Dispatch Structured Order Message to WhatsApp
function dispatchWhatsAppOrder() {
  const tableNum = document.getElementById('tableSelect').value;
  const notes = document.getElementById('orderNotes').value.trim();
  const paymentMethod = document.querySelector('input[name="payment"]:checked').value;

  let message = `🍽️ *NEW TABLE ORDER - Table #${tableNum}*\n`;
  message += `------------------------------------\n`;

  let totalPrice = 0;
  Object.keys(cart).forEach(id => {
    const item = MENU_DATA.find(i => i.id == id);
    if (!item) return;

    const qty = cart[id];
    const lineTotal = item.price * qty;
    totalPrice += lineTotal;
    message += `• ${qty}x ${item.name} @ ${formatMoney(item.price)} = *${formatMoney(lineTotal)}*\n`;
  });

  message += `------------------------------------\n`;
  message += `💰 *TOTAL PAYABLE:* ${formatMoney(totalPrice)}\n`;
  message += `💳 *Payment Method:* ${paymentMethod}\n`;
  if (notes) {
    message += `📝 *Kitchen Notes:* ${notes}\n`;
  }
  message += `------------------------------------\n`;
  message += `_Sent via Digital Table Menu_`;

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodedMessage}`;
  
  window.open(whatsappUrl, '_blank');
}

// Dispatch Call Waiter / Request Bill Quick Alerts
function dispatchQuickAlert(type) {
  const tableNum = document.getElementById('tableSelect').value;
  let message = "";

  if (type === 'waiter') {
    message = `🔔 *ATTENTION WAITER - Table #${tableNum}*\nCustomer is requesting assistance at Table #${tableNum}.`;
  } else if (type === 'bill') {
    message = `🧾 *BILL REQUEST - Table #${tableNum}*\nCustomer at Table #${tableNum} is ready to settle their bill.`;
  }

  const encodedMessage = encodeURIComponent(message);
  window.open(`https://wa.me/${CONFIG.whatsappNumber}?text=${encodedMessage}`, '_blank');
}

// Event Listeners Initialization
document.addEventListener('DOMContentLoaded', () => {
  renderMenu();

  // Category Filtering
  document.querySelectorAll('.cat-pill').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.cat-pill').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      currentCategory = e.target.dataset.category;
      renderMenu();
    });
  });

  // Modal Open/Close Controls
  document.getElementById('btnOpenCart').addEventListener('click', () => {
    renderCartModal();
    document.getElementById('cartModal').classList.remove('hidden');
  });

  document.getElementById('btnCloseCart').addEventListener('click', () => {
    document.getElementById('cartModal').classList.add('hidden');
  });

  // Dispatch Actions
  document.getElementById('btnDispatchOrder').addEventListener('click', dispatchWhatsAppOrder);
  document.getElementById('btnCallWaiter').addEventListener('click', () => dispatchQuickAlert('waiter'));
  document.getElementById('btnRequestBill').addEventListener('click', () => dispatchQuickAlert('bill'));
});