// ═══════════════════════════════════════════════════════
// REALTIME LISTENERS
// ═══════════════════════════════════════════════════════
function startRealtimeListeners() {
  if (!fbReady) return;
  fb().onSnapshot(fb().collection(db(), 'orders'), snap => {
    orders = snap.docs.map(d => parseOrder({_id:d.id,...d.data()}));
    buildDashboard();
    renderOrders();
    renderSalesList();
    renderReports();
  });
  fb().onSnapshot(fb().collection(db(), 'products'), snap => {
    const updated = snap.docs.map(d=>({_id:d.id,...d.data()}));
    if (updated.length) {
      products = updated.map((p,i)=>({
        idx:i, _id:p._id,
        name:p.name||'', cat:p.category||'عام',
        price:parseFloat(p.price)||0, img:fixDrive(p.image||''),
        stock:p.stock===undefined?999:parseInt(p.stock)||0,
        minStock:parseInt(p.minStock)||10,
        status:p.status||'active', detail:p.detail||''
      })).filter(p=>p.name&&p.price>0);
      renderStore('الكل'); renderCats(); renderInventory(); renderManageProds();
    }
  });
  fb().onSnapshot(fb().collection(db(), 'notifications'), snap => {
    notifications = snap.docs.map(d=>({_id:d.id,...d.data()}));
    renderNotifBadge();
    renderNotifications();
  });
}

function parseOrder(o) {
  return {
    _id:        o._id,
    id:         o.orderId || o._id || '',
    date:       tsToStr(o.date || o.createdAt),
    repUser:    o.repUsername || '',
    repName:    o.repName || '—',
    commPct:    parseFloat(o.commPct) || 0,
    shopName:   o.shopName || '',
    shopAddr:   o.shopAddress || o.shopAddr || '',
    note:       o.note || '',
    location:   o.location || '',
    products:   parseProducts(o.products || o.cartItems),
    total:      parseFloat(o.total) || 0,
    commission: parseFloat(o.commission) || 0,
    net:        parseFloat(o.net) || 0,
  };
}
