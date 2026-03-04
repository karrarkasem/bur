// ═══════════════════════════════════════════════════════
// BUILD UI
// ═══════════════════════════════════════════════════════
function buildUI() {
  buildSidebar(); buildDashboard(); renderInventory();
  renderManageProds(); renderUsersList(); renderPurchaseList();
  renderSalesList(); renderOrders(); renderReports();
  buildWalletPage(); updateTopLoginBtn(); renderOffers();
  renderRepTracking(); renderNotifications();
  if(CU?.type==='rep') buildRepHome();
}

function buildSidebar() {
  const p = PERMS[CU?.type||'guest'];
  document.getElementById('sbAv').textContent   = CU ? (ROLES[CU.type]?.charAt(0)||'👤') : '🌐';
  document.getElementById('sbName').textContent  = CU?.name||'زائر';
  document.getElementById('sbRole').textContent  = CU ? ROLES[CU.type] : 'تصفح حر';
  document.getElementById('sbOnline').style.display = CU ? 'flex':'none';
  document.getElementById('sbWalletBar').style.display = (CU&&p.wallet)?'block':'none';
  updateWalletBar();

  const nav=[
    {id:'pageRepHome',     icon:'🏠',  lbl:'الرئيسية',           perm:'repHome'},
    {id:'pageStore',       icon:'🛍️', lbl:'المتجر',             always:true},
    {id:'pageDashboard',   icon:'📊',  lbl:'الإحصائيات',        perm:'dash'},
    {id:'pageOrders',      icon:'📦',  lbl:'الطلبات',            perm:'order'},
    {id:'pageWallet',      icon:'💰',  lbl:'المحفظة',            perm:'wallet'},
    {id:'pageInventory',   icon:'📊',  lbl:'المخزون',            perm:'inv', section:'الإدارة'},
    {id:'pageInvoices',    icon:'🧾',  lbl:'الفواتير',           perm:'inv'},
    {id:'pageManage',      icon:'🛒',  lbl:'إدارة المنتجات',     perm:'manage'},
    {id:'pageUsers',       icon:'👥',  lbl:'المستخدمون',         perm:'users'},
    {id:'pageOffers',      icon:'🎁',  lbl:'العروض',             always:true},
    {id:'pageRepField',    icon:'📍',  lbl:'نشاطي الميداني',    perm:'repField'},
    {id:'pageRepTracking', icon:'🗺️',  lbl:'تتبع المندوبين',     perm:'tracking'},
    {id:'pageNotifications',icon:'🔔', lbl:'الإشعارات',          perm:'notif', badge:true},
    {id:'pageReports',     icon:'📈',  lbl:'التقارير',           perm:'reports'},
  ];
  let html='',lastSec='';
  nav.forEach(n=>{
    if(!n.always&&!p[n.perm]) return;
    if(n.section&&n.section!==lastSec){html+=`<div class="sb-section">${n.section}</div>`;lastSec=n.section;}
    const unread = n.badge ? notifications.filter(x=>!x.read&&(x.target==='all'||x.target===CU?.username)).length : 0;
    html+=`<div class="nav-item" id="nav_${n.id}" onclick="showPage('${n.id}')">
      <span class="nav-icon">${n.icon}</span>${n.lbl}
      ${unread>0?`<span class="nav-badge">${unread}</span>`:''}
    </div>`;
  });
  document.getElementById('sbNav').innerHTML=html;
  document.getElementById('sbLoginLogout').innerHTML=CU
    ?`<div class="nav-item red" onclick="doLogout()"><span class="nav-icon">↩</span>تسجيل الخروج</div>`
    :`<div class="nav-item" onclick="showLogin()"><span class="nav-icon">👤</span>دخول / تسجيل</div>`;

  const inv = CU&&(p.inv_write);
  const addPurBtn = document.getElementById('addPurBtn');
  const newPurBtn = document.getElementById('newPurBtn');
  if(addPurBtn) addPurBtn.style.display=inv?'inline-flex':'none';
  if(newPurBtn) newPurBtn.style.display=inv?'inline-flex':'none';
  document.getElementById('addDiscWrap').style.display=(CU&&(CU.type==='admin'||CU.type==='sales_manager'))?'flex':'none';

  const addOfferWrap = document.getElementById('addOfferWrap');
  if(addOfferWrap) addOfferWrap.style.display=(CU&&(CU.type==='admin'||CU.type==='sales_manager'))?'flex':'none';

  setActive('pageStore');
}

function updateWalletBar() {
  if(!CU) return;
  const u=users.find(x=>x.username===CU.username);
  const bal=parseFloat(u?.balance||CU.balance||0);
  document.getElementById('sbWalletAmt').textContent=bal.toLocaleString()+' د.ع';
}

function updateTopLoginBtn() {
  const btn=document.getElementById('topLoginBtn');
  if(CU){btn.textContent='👤 '+CU.name.split(' ')[0];btn.onclick=()=>showPage('pageDashboard');}
  else{btn.textContent='👤 دخول';btn.onclick=showLogin;}
}

function setActive(id) {
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  document.getElementById('nav_'+id)?.classList.add('active');
}

function showPage(id) {
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById(id)?.classList.add('active');
  setActive(id);
  const nav=document.getElementById('nav_'+id);
  if(nav) document.getElementById('topbarTitle').innerHTML=nav.innerHTML.replace(/<span[^>]*>.*?<\/span>/g,'').trim();
  document.getElementById('topSearch').style.display  =id==='pageStore'?'flex':'none';
  document.getElementById('cartTopBtn').style.display =id==='pageStore'?'flex':'none';
  // إغلاق الشريط الجانبي دائماً عند الانتقال لصفحة
  closeSidebar();
  if(id==='pageRepHome')      buildRepHome();
  if(id==='pageDashboard')    buildDashboard();
  if(id==='pageWallet')       buildWalletPage();
  if(id==='pageReports')      renderReports();
  if(id==='pageRepTracking')  renderRepTracking();
  if(id==='pageRepField')     renderRepField();
  if(id==='pageNotifications')renderNotifications();
  if(id==='pageOffers')       renderOffers();
}
