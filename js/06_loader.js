// ═══════════════════════════════════════════════════════
// DATA LOADING
// ═══════════════════════════════════════════════════════
async function loadUsers() {
  const raw = await fbGet('users');
  users = raw.map(u => ({
    _id:      u._id,
    name:     u.name||'',
    username: u.username||'',
    password: u.password||'',
    type:     u.accountType||u.type||'rep',
    phone:    u.phone||'',
    email:    u.email||'',
    commPct:  parseFloat(u.commPct)||0,
    status:   u.status||'active',
    balance:  parseFloat(u.balance)||0,
    totalBuys:parseFloat(u.totalBuys)||0,
    transactions: u.transactions||[]
  })).filter(u=>u.username);
}

async function loadProducts() {
  const raw = await fbGet('products');
  products = raw.map((p,i) => ({
    idx: i, _id: p._id,
    name:     p.name||'',
    cat:      p.category||'عام',
    price:    parseFloat(p.price)||0,
    img:      fixDrive(p.image||''),
    stock:    p.stock===undefined ? 999 : parseInt(p.stock)||0,
    minStock: parseInt(p.minStock)||10,
    status:   p.status||'active',
    detail:   p.detail||''
  })).filter(p=>p.name&&p.price>0);
  renderStore('الكل'); renderCats();
}

async function loadOrders() {
  const raw = await fbGet('orders');
  orders = raw.map(o => parseOrder(o)).filter(o => o.date && o.date !== '—');
}

async function loadOffers() {
  const raw = await fbGet('offers');
  offers = raw.map(o => ({
    _id:o._id, title:o.title||'', desc:o.description||'',
    type:o.discountType||'percent', value:parseFloat(o.value)||0,
    from:o.startDate||'', to:o.endDate||'', status:o.status||'active'
  }));
  renderOffers();
}

async function loadNotifications() {
  const raw = await fbGet('notifications');
  notifications = raw.map(n => ({
    _id:n._id, title:n.title||'', body:n.body||n.message||'',
    type:n.type||'info', read:n.read||false,
    date:tsToStr(n.date || n.createdAt), target:n.targetUser||'all'
  }));
  renderNotifBadge();
}
