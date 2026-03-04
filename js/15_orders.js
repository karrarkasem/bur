// ═══════════════════════════════════════════════════════
// ORDERS
// ═══════════════════════════════════════════════════════
function renderOrders(){
  if(!CU) return;
  const p=PERMS[CU.type]||PERMS.guest;
  const base=p.dash?orders:filterMyOrders();
  const f=document.getElementById('ordFilter')?.value||'all';
  let filt=base;
  if(f==='today') filt=base.filter(o=>isSameDay(o.date,new Date()));
  if(f==='month') filt=base.filter(o=>isThisMonth(o.date));
  const t=filt.reduce((s,o)=>s+(parseFloat(o.total)||0),0);
  const c=filt.reduce((s,o)=>s+(parseFloat(o.commission)||0),0);
  document.getElementById('ordSummary').innerHTML=`
    <div style="background:rgba(255,255,255,.72);border:1px solid rgba(255,255,255,.9);border-radius:var(--r16);padding:13px;text-align:center;box-shadow:var(--shadow-sm)"><div style="font-size:1.35rem;font-weight:900;color:var(--sky2)">${filt.length}</div><div style="font-size:.7rem;color:rgba(9,50,87,.48)">عدد الطلبات</div></div>
    <div style="background:rgba(255,255,255,.72);border:1px solid rgba(255,255,255,.9);border-radius:var(--r16);padding:13px;text-align:center;box-shadow:var(--shadow-sm)"><div style="font-size:1.35rem;font-weight:900;color:var(--mint2)">${(t/1000).toFixed(0)}K</div><div style="font-size:.7rem;color:rgba(9,50,87,.48)">إجمالي المبيعات</div></div>
    <div style="background:rgba(255,255,255,.72);border:1px solid rgba(255,255,255,.9);border-radius:var(--r16);padding:13px;text-align:center;box-shadow:var(--shadow-sm)"><div style="font-size:1.35rem;font-weight:900;color:var(--gold2)">${(c/1000).toFixed(0)}K</div><div style="font-size:.7rem;color:rgba(9,50,87,.48)">إجمالي العمولات</div></div>`;
  document.getElementById('ordBody').innerHTML=[...filt].reverse().map(o=>`
    <tr onclick="showOrdDetail('${o._id||o.id||''}')" style="cursor:pointer">
      <td>${o.date}</td>
      <td>${o.repName||'—'}</td>
      <td style="font-weight:700;color:var(--deep)">${o.shopName||'—'}</td>
      <td style="max-width:100px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:rgba(9,50,87,.48)">${o.products}</td>
      <td style="font-weight:800;color:var(--mint2)">${(parseFloat(o.total)||0).toLocaleString()}</td>
      <td style="color:var(--gold2)">${(parseFloat(o.commission)||0).toLocaleString()}</td>
      <td style="color:var(--teal2)">${(parseFloat(o.net)||0).toLocaleString()}</td>
      <td><button class="btn btn-ghost btn-sm">🔍</button></td>
    </tr>`).join('')||'<tr><td colspan="8" style="text-align:center;padding:28px;color:rgba(9,50,87,.33)">لا توجد طلبات</td></tr>';
}

async function showOrdDetail(idOrFbId){
  let o=orders.find(x=>x._id===idOrFbId||x.id===idOrFbId)||orders[orders.length-1];
  if(!o) return;
  let tracking=[];
  if(o._id) tracking=await fbGetSub('orders',o._id,'tracking').catch(()=>[]);
  document.getElementById('ordDetailContent').innerHTML=`
    <div style="background:rgba(14,165,233,.05);border:1px solid rgba(14,165,233,.1);border-radius:var(--r16);padding:15px;margin-bottom:13px">
      ${[['رقم الطلب',o.id||o._id||'—'],['التاريخ',o.date],['المندوب',o.repName||'زائر'],
         ['المحل',o.shopName||'—'],['العنوان',o.shopAddr||'—'],o.note?['ملاحظة',o.note]:null]
        .filter(Boolean).map(([l,v])=>`
        <div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid rgba(14,165,233,.07);font-size:.85rem">
          <span style="color:rgba(9,50,87,.45)">${l}</span><span style="font-weight:700;color:var(--deep)">${v}</span>
        </div>`).join('')}
    </div>
    <div style="background:rgba(255,255,255,.6);border:1px solid rgba(255,255,255,.9);border-radius:var(--r16);padding:13px;margin-bottom:13px">
      <div style="font-weight:800;color:var(--deep);margin-bottom:9px;font-size:.86rem">📦 المنتجات</div>
      <div style="font-size:.84rem;color:rgba(9,50,87,.62);line-height:1.8">${o.products||'—'}</div>
    </div>
    ${tracking.length?`<div style="background:rgba(255,255,255,.6);border:1px solid rgba(255,255,255,.9);border-radius:var(--r16);padding:13px;margin-bottom:13px">
      <div style="font-weight:800;color:var(--deep);margin-bottom:9px;font-size:.86rem">📍 تتبع الطلب</div>
      ${tracking.map(t=>`<div style="display:flex;gap:9px;align-items:center;padding:6px 0;border-bottom:1px solid rgba(14,165,233,.07);font-size:.82rem">
        <span style="color:var(--mint2)">•</span><span style="font-weight:600">${t.status}</span><span style="color:rgba(9,50,87,.4)">${tsToStr(t.timestamp||t.createdAt)}</span>
      </div>`).join('')}
    </div>`:''}
    <div style="background:rgba(255,255,255,.6);border:1px solid rgba(255,255,255,.9);border-radius:var(--r16);padding:13px">
      <div style="display:flex;justify-content:space-between;padding:6px 0;font-size:.86rem"><span style="color:rgba(9,50,87,.45)">الإجمالي</span><span style="font-weight:800;color:var(--mint2)">${(parseFloat(o.total)||0).toLocaleString()} د.ع</span></div>
      <div style="display:flex;justify-content:space-between;padding:6px 0;font-size:.86rem"><span style="color:rgba(9,50,87,.45)">العمولة</span><span style="font-weight:800;color:var(--gold2)">${(parseFloat(o.commission)||0).toLocaleString()} د.ع</span></div>
      <div style="display:flex;justify-content:space-between;padding:9px 0 0;font-size:.98rem;font-weight:900;border-top:1px solid rgba(14,165,233,.09)"><span>الصافي</span><span style="color:var(--teal2)">${(parseFloat(o.net)||0).toLocaleString()} د.ع</span></div>
    </div>
    ${o.location?`<a href="${o.location}" target="_blank" class="btn btn-sky btn-full" style="margin-top:11px;text-decoration:none">🗺️ عرض الموقع</a>`:''}`;
  openModal('ordDetailModal');
}
