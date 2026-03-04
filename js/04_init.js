// ═══════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════
async function init() {
  const purDateEl = document.getElementById('pur_date');
  if(purDateEl) purDateEl.value = new Date().toISOString().split('T')[0];
  document.addEventListener('keydown', e => {
    if (e.key==='Escape') {
      closeSidebar();
      closeRepProfile();
      document.querySelectorAll('.modal.open').forEach(m=>m.classList.remove('open'));
    }
    if (e.key==='Enter' && document.getElementById('loginOverlay').style.display==='flex') doLogin();
  });

  // إغلاق panel المندوب عند الضغط خارجه
  document.getElementById('repProfilePanel').addEventListener('click', e=>{
    if(e.target===e.currentTarget) closeRepProfile();
  });

  if (window._fbReady) { fbReady=true; }
  else {
    await new Promise(res => document.addEventListener('fbReady', res, {once:true}));
    fbReady = true;
  }
  setFbStatus(true, 'متصل');
  document.getElementById('loadSub').textContent = 'جاري تحميل البيانات...';

  await Promise.all([loadUsers(), loadProducts(), loadOrders(), loadOffers(), loadNotifications()]);

  try {
    const saved = localStorage.getItem('bjUser');
    if (saved) {
      const parsed = JSON.parse(saved);
      const fresh  = users.find(u => u.username === parsed.username);
      if (fresh) CU = { ...fresh };
    }
  } catch(e) {}

  setTimeout(() => {
    const ls = document.getElementById('loadScreen');
    ls.style.opacity = '0';
    setTimeout(() => ls.style.display='none', 400);
  }, 900);

  buildUI();
  // توجيه المندوب لصفحته المخصصة
  if(CU?.type==='rep') showPage('pageRepHome');
  startRealtimeListeners();

  setInterval(async () => {
    await Promise.all([loadUsers(), loadOrders()]);
    if (CU) {
      const fresh = users.find(u=>u.username===CU.username);
      if (fresh) CU={...fresh};
      updateWalletBar();
    }
    buildDashboard();
    renderNotifBadge();
  }, 90000);
}
