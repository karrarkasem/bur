// ═══════════════════════════════════════════════════════
// REPORTS
// ═══════════════════════════════════════════════════════
function renderReports(){
  const tot=orders.reduce((s,o)=>s+(parseFloat(o.total)||0),0);
  const comm=orders.reduce((s,o)=>s+(parseFloat(o.commission)||0),0);
  const avg=orders.length?Math.round(tot/orders.length):0;
  const outOfStock=products.filter(p=>p.stock===0).length;
  document.getElementById('repKpi').innerHTML=`
    <div class="kpi-card kpi-sky"><div class="kpi-icon">💰</div><div class="kpi-val">${(tot/1e6).toFixed(2)}M</div><div class="kpi-lbl">إجمالي المبيعات (د.ع)</div></div>
    <div class="kpi-card kpi-teal"><div class="kpi-icon">📦</div><div class="kpi-val">${orders.length}</div><div class="kpi-lbl">إجمالي الطلبات</div></div>
    <div class="kpi-card kpi-gold"><div class="kpi-icon">💸</div><div class="kpi-val">${(comm/1e6).toFixed(2)}M</div><div class="kpi-lbl">إجمالي العمولات</div></div>
    <div class="kpi-card kpi-mint"><div class="kpi-icon">📊</div><div class="kpi-val">${avg.toLocaleString()}</div><div class="kpi-lbl">متوسط قيمة الطلب</div></div>
    <div class="kpi-card kpi-rose"><div class="kpi-icon">🚫</div><div class="kpi-val">${outOfStock}</div><div class="kpi-lbl">منتجات نفاد المخزون</div></div>`;
  const rMap={};
  orders.forEach(o=>{
    if(!o.repUser) return;
    if(!rMap[o.repUser]) rMap[o.repUser]={name:o.repName||o.repUser,ord:0,tot:0,comm:0};
    rMap[o.repUser].ord++;
    rMap[o.repUser].tot+=(parseFloat(o.total)||0);
    rMap[o.repUser].comm+=(parseFloat(o.commission)||0);
  });
  document.getElementById('repRepsBody').innerHTML=Object.values(rMap).sort((a,b)=>b.tot-a.tot).map(r=>`
    <tr><td style="font-weight:700;color:var(--deep)">${r.name}</td><td>${r.ord}</td>
    <td style="font-weight:800;color:var(--mint2)">${r.tot.toLocaleString()} د.ع</td>
    <td style="color:var(--gold2)">${r.comm.toLocaleString()} د.ع</td>
    <td style="color:var(--teal2)">${(r.tot-r.comm).toLocaleString()} د.ع</td></tr>`).join('')
  ||'<tr><td colspan="5" style="text-align:center;padding:28px;color:rgba(9,50,87,.33)">لا توجد بيانات</td></tr>';
}
