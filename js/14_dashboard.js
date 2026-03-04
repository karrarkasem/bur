// ═══════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════
function buildDashboard(){
  if(!CU) return;
  const p=PERMS[CU.type]||PERMS.guest;
  document.getElementById('dashH1').textContent=`👋 مرحباً، ${CU.name}`;
  document.getElementById('dashSub').textContent=new Date().toLocaleDateString('ar-IQ',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
  const myOrd=filterMyOrders();
  const today=myOrd.filter(o=>isSameDay(o.date,new Date()));
  const month=myOrd.filter(o=>isThisMonth(o.date));
  let kpi='';
  if(CU.type==='admin'||CU.type==='sales_manager'){
    const allTot=orders.reduce((s,o)=>s+(parseFloat(o.total)||0),0);
    const allComm=orders.reduce((s,o)=>s+(parseFloat(o.commission)||0),0);
    const reps=new Set(orders.map(o=>o.repUser).filter(Boolean)).size;
    const lowProd=products.filter(p=>p.stock>0&&p.stock<p.minStock).length;
    kpi=`<div class="kpi-card kpi-sky"><div class="kpi-icon">💰</div><div class="kpi-val">${(allTot/1e6).toFixed(2)}M</div><div class="kpi-lbl">إجمالي المبيعات (د.ع)</div></div>
    <div class="kpi-card kpi-teal"><div class="kpi-icon">📦</div><div class="kpi-val">${orders.length}</div><div class="kpi-lbl">إجمالي الطلبات</div></div>
    <div class="kpi-card kpi-mint"><div class="kpi-icon">🤝</div><div class="kpi-val">${reps}</div><div class="kpi-lbl">المندوبون النشطون</div></div>
    <div class="kpi-card kpi-gold"><div class="kpi-icon">⚠️</div><div class="kpi-val">${lowProd}</div><div class="kpi-lbl">منتجات مخزون منخفض</div></div>`;
  } else if(CU.type==='rep'){
    const uo=users.find(u=>u.username===CU.username);
    const bal=parseFloat(uo?.balance||0);
    const mTot=month.reduce((s,o)=>s+(parseFloat(o.total)||0),0);
    const mComm=month.reduce((s,o)=>s+(parseFloat(o.commission)||0),0);
    kpi=`<div class="kpi-card kpi-sky"><div class="kpi-icon">📅</div><div class="kpi-val">${today.reduce((s,o)=>s+(parseFloat(o.total)||0),0).toLocaleString()}</div><div class="kpi-lbl">مبيعات اليوم (د.ع)</div><div class="kpi-sub">${today.length} طلب</div></div>
    <div class="kpi-card kpi-teal"><div class="kpi-icon">📊</div><div class="kpi-val">${mTot.toLocaleString()}</div><div class="kpi-lbl">مبيعات الشهر</div></div>
    <div class="kpi-card kpi-mint"><div class="kpi-icon">💸</div><div class="kpi-val">${mComm.toLocaleString()}</div><div class="kpi-lbl">عمولة الشهر (د.ع)</div></div>
    <div class="kpi-card kpi-gold"><div class="kpi-icon">💰</div><div class="kpi-val">${bal.toLocaleString()}</div><div class="kpi-lbl">رصيد المحفظة (د.ع)</div></div>`;
  } else {
    const myBuys=orders.filter(o=>o.shopName===CU.name);
    const uo=users.find(u=>u.username===CU.username);
    kpi=`<div class="kpi-card kpi-sky"><div class="kpi-icon">🛒</div><div class="kpi-val">${myBuys.length}</div><div class="kpi-lbl">إجمالي الطلبات</div></div>
    <div class="kpi-card kpi-teal"><div class="kpi-icon">📊</div><div class="kpi-val">${myBuys.filter(o=>isThisMonth(o.date)).reduce((s,o)=>s+(parseFloat(o.total)||0),0).toLocaleString()}</div><div class="kpi-lbl">مشتريات الشهر (د.ع)</div></div>
    <div class="kpi-card kpi-gold"><div class="kpi-icon">💰</div><div class="kpi-val">${parseFloat(uo?.balance||0).toLocaleString()}</div><div class="kpi-lbl">رصيد المحفظة (د.ع)</div></div>`;
  }
  document.getElementById('dashKpi').innerHTML=kpi;
  const showOrds=p.dash?orders:filterMyOrders();
  document.getElementById('recentBody').innerHTML=[...showOrds].slice(-8).reverse().map(o=>`
    <tr onclick="showOrdDetail('${o._id||o.id||''}')" style="cursor:pointer">
      <td>${o.date}</td>
      <td style="font-weight:700;color:var(--deep)">${o.shopName||'—'}</td>
      <td style="max-width:100px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${o.products}</td>
      <td style="font-weight:800;color:var(--mint2)">${(parseFloat(o.total)||0).toLocaleString()} د.ع</td>
      <td><span class="badge b-green">✅ مكتمل</span></td>
    </tr>`).join('')||'<tr><td colspan="5" style="text-align:center;padding:28px;color:rgba(9,50,87,.33)">لا توجد طلبات</td></tr>';
}
