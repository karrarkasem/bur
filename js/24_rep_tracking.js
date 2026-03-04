// ═══════════════════════════════════════════════════════
// REP TRACKING
// ═══════════════════════════════════════════════════════
async function renderRepTracking(){
  const reps=users.filter(u=>u.type==='rep'||u.type==='sales_manager');

  // KPI للأدمن
  const totalToday=orders.filter(o=>isSameDay(o.date,new Date())).length;
  const totalMonth=orders.filter(o=>isThisMonth(o.date)).reduce((s,o)=>s+(parseFloat(o.total)||0),0);
  const kpiEl=document.getElementById('repTrackKpi');
  if(kpiEl){
    kpiEl.innerHTML=`
      <div class="kpi-card kpi-sky"><div class="kpi-icon">👥</div><div class="kpi-val">${reps.length}</div><div class="kpi-lbl">إجمالي المندوبين</div></div>
      <div class="kpi-card kpi-teal"><div class="kpi-icon">📦</div><div class="kpi-val">${totalToday}</div><div class="kpi-lbl">طلبات اليوم</div></div>
      <div class="kpi-card kpi-mint"><div class="kpi-icon">💰</div><div class="kpi-val">${(totalMonth/1e6).toFixed(2)}M</div><div class="kpi-lbl">مبيعات الشهر (د.ع)</div></div>`;
  }

  document.getElementById('repTrackList').innerHTML=reps.length?reps.map(rep=>{
    const myOrds=orders.filter(o=>o.repUser===rep.username);
    const todayOrds=myOrds.filter(o=>isSameDay(o.date,new Date()));
    const monthSales=myOrds.filter(o=>isThisMonth(o.date)).reduce((s,o)=>s+(parseFloat(o.total)||0),0);
    const totalOrds=myOrds.length;
    const lastOrd=myOrds.length?[...myOrds].reverse()[0]:null;
    const lastVisit=lastOrd?lastOrd.date:'—';
    const hasLoc=lastOrd&&lastOrd.location;
    return `<div class="rep-track-card">
      <div class="rt-header">
        <div class="rt-av">🤝</div>
        <div style="flex:1">
          <div class="rt-name">${rep.name}</div>
          <div class="rt-status">@${rep.username}${rep.phone?` · 📞 ${rep.phone}`:''}</div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:5px">
          <span class="badge b-green">🟢 نشط</span>
          <button class="btn btn-ghost btn-sm" onclick="openRepProfile('${rep.username}')">👁 الملف</button>
        </div>
      </div>
      <div class="rt-stats">
        <div class="rt-stat"><div class="rt-stat-val">${todayOrds.length}</div><div class="rt-stat-lbl">طلبات اليوم</div></div>
        <div class="rt-stat"><div class="rt-stat-val">${(monthSales/1000).toFixed(0)}K</div><div class="rt-stat-lbl">مبيعات الشهر</div></div>
        <div class="rt-stat"><div class="rt-stat-val">${totalOrds}</div><div class="rt-stat-lbl">إجمالي الطلبات</div></div>
      </div>
      <div class="rt-visits">
        <div style="font-size:.75rem;font-weight:700;color:rgba(9,50,87,.45);margin-bottom:6px">📅 آخر نشاط: ${lastVisit}</div>
        ${todayOrds.slice(-3).reverse().map(o=>`
          <div class="rt-visit-row">
            <div class="rt-visit-icon">🏪</div>
            <div style="flex:1">
              <div style="font-weight:700;font-size:.8rem">${o.shopName||'—'}</div>
              <div style="font-size:.68rem;color:rgba(9,50,87,.4)">${o.shopAddr||o.shopAddress||'—'}</div>
            </div>
            <span style="font-weight:800;font-size:.78rem;color:var(--mint2)">${(parseFloat(o.total)||0).toLocaleString()} د.ع</span>
            ${o.location?`<a href="${o.location}" target="_blank" class="rt-loc-btn">🗺</a>`:''}
          </div>`).join('')||`<div style="font-size:.76rem;color:rgba(9,50,87,.33);text-align:center;padding:8px">لا توجد زيارات اليوم</div>`}
      </div>
    </div>`;
  }).join(''):'<div style="text-align:center;padding:55px;color:rgba(9,50,87,.35)">لا يوجد مندوبون مسجلون</div>';
}

async function openRepProfile(username){
  const rep=users.find(u=>u.username===username);
  if(!rep) return;
  const myOrds=orders.filter(o=>o.repUser===username);
  const todayOrds=myOrds.filter(o=>isSameDay(o.date,new Date()));
  const monthSales=myOrds.filter(o=>isThisMonth(o.date)).reduce((s,o)=>s+(parseFloat(o.total)||0),0);
  const totalComm=myOrds.reduce((s,o)=>s+(parseFloat(o.commission)||0),0);

  document.getElementById('rpbAv').textContent='🤝';
  document.getElementById('rpbName').textContent=rep.name;
  document.getElementById('rpbRole').textContent=`@${rep.username}${rep.phone?' · '+rep.phone:''}${rep.email?' · '+rep.email:''}`;
  document.getElementById('rpbKpi').innerHTML=`
    <div class="kpi-card kpi-sky"><div class="kpi-icon">📦</div><div class="kpi-val">${myOrds.length}</div><div class="kpi-lbl">إجمالي الطلبات</div></div>
    <div class="kpi-card kpi-teal"><div class="kpi-icon">📅</div><div class="kpi-val">${todayOrds.length}</div><div class="kpi-lbl">طلبات اليوم</div></div>
    <div class="kpi-card kpi-mint"><div class="kpi-icon">💰</div><div class="kpi-val">${(monthSales/1000).toFixed(0)}K</div><div class="kpi-lbl">مبيعات الشهر</div></div>
    <div class="kpi-card kpi-gold"><div class="kpi-icon">💸</div><div class="kpi-val">${(totalComm/1000).toFixed(0)}K</div><div class="kpi-lbl">إجمالي العمولات</div></div>`;

  // عرض آخر 15 زيارة/طلب
  const recent=[...myOrds].reverse().slice(0,15);
  document.getElementById('rpbVisits').innerHTML=recent.length?recent.map(o=>`
    <div class="visit-item">
      <div class="vi-icon">🏪</div>
      <div style="flex:1">
        <div class="vi-shop">${o.shopName||'—'}</div>
        <div class="vi-meta">${o.date} · ${o.shopAddr||o.shopAddress||'—'}</div>
        <div class="vi-meta" style="margin-top:2px;color:rgba(9,50,87,.35)">${o.products}</div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px">
        <span class="vi-total">${(parseFloat(o.total)||0).toLocaleString()} د.ع</span>
        ${o.location?`<a href="${o.location}" target="_blank" class="rt-loc-btn">🗺 الموقع</a>`:''}
      </div>
    </div>`).join('')
    :'<div style="text-align:center;color:rgba(9,50,87,.33);padding:22px">لا توجد زيارات مسجلة</div>';

  document.getElementById('repProfilePanel').classList.add('open');
}

function closeRepProfile(){
  document.getElementById('repProfilePanel').classList.remove('open');
}

// تتبع موقع المندوب عند إرسال الطلب (يُحفظ تلقائياً)
async function logRepVisit(repUsername, shopName, shopAddr, location, orderId, total){
  if(!repUsername) return;
  const uo=users.find(u=>u.username===repUsername);
  if(!uo||!uo._id) return;
  try{
    await fbAddSub('users', uo._id, 'visits', {
      shopName, shopAddr, location: location||'', orderId, total,
      date: new Date().toLocaleDateString('ar-IQ'),
      timestamp: new Date().toISOString()
    });
  }catch(e){}
}
