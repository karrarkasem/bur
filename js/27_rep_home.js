// ═══════════════════════════════════════════════════════
// REP HOME PAGE - واجهة بيت المندوب
// ═══════════════════════════════════════════════════════
async function buildRepHome(){
  if(!CU||CU.type!=='rep') return;
  const uo=users.find(u=>u.username===CU.username)||CU;
  const myOrds=orders.filter(o=>o.repUser===CU.username);
  const todayOrds=myOrds.filter(o=>isSameDay(o.date,new Date()));
  const monthOrds=myOrds.filter(o=>isThisMonth(o.date));
  const todayTotal=todayOrds.reduce((s,o)=>s+(parseFloat(o.total)||0),0);
  const monthTotal=monthOrds.reduce((s,o)=>s+(parseFloat(o.total)||0),0);
  const monthComm=monthOrds.reduce((s,o)=>s+(parseFloat(o.commission)||0),0);
  const bal=parseFloat(uo.balance||0);

  // تحية حسب الوقت
  const hr=new Date().getHours();
  const greeting = hr<12 ? 'صباح الخير ☀️' : hr<17 ? 'مساء الخير 🌤️' : 'مساء النور 🌙';
  document.getElementById('rhGreeting').textContent=greeting;
  document.getElementById('rhName').textContent=CU.name;
  document.getElementById('rhDate').textContent=new Date().toLocaleDateString('ar-IQ',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
  document.getElementById('rhBalance').textContent=bal.toLocaleString()+' د.ع';

  // KPIs
  document.getElementById('rhTodayKpi').innerHTML=`
    <div class="rtk-card rtk-sky">
      <div class="rtk-icon">📦</div>
      <div class="rtk-val">${todayOrds.length}</div>
      <div class="rtk-lbl">طلبات اليوم</div>
    </div>
    <div class="rtk-card rtk-mint">
      <div class="rtk-icon">💰</div>
      <div class="rtk-val">${(todayTotal/1000).toFixed(0)}K</div>
      <div class="rtk-lbl">مبيعات اليوم</div>
    </div>
    <div class="rtk-card rtk-gold">
      <div class="rtk-icon">📊</div>
      <div class="rtk-val">${(monthTotal/1000).toFixed(0)}K</div>
      <div class="rtk-lbl">مبيعات الشهر</div>
    </div>
    <div class="rtk-card rtk-violet">
      <div class="rtk-icon">💸</div>
      <div class="rtk-val">${(monthComm/1000).toFixed(0)}K</div>
      <div class="rtk-lbl">عمولة الشهر</div>
    </div>`;

  // شريط النقاط
  const totalSales=myOrds.reduce((s,o)=>s+(parseFloat(o.total)||0),0);
  const salesForNext=totalSales % POINTS_PER_IQD;
  const pct=Math.min(100,(salesForNext/POINTS_PER_IQD)*100);
  const pts=Math.floor(totalSales/POINTS_PER_IQD);
  document.getElementById('rhPtsLabel').textContent=`${salesForNext.toLocaleString()} / ${POINTS_PER_IQD.toLocaleString()} د.ع`;
  document.getElementById('rhPtsBar').style.width=pct+'%';
  document.getElementById('rhPtsTotal').textContent=pts;

  // زيارات اليوم
  document.getElementById('rhTodayVisits').innerHTML=todayOrds.length
    ?[...todayOrds].reverse().map(o=>`
      <div class="rh-visit-row">
        <div class="rh-vi-ico">🏪</div>
        <div style="flex:1">
          <div class="rh-vi-shop">${o.shopName||'—'}</div>
          <div class="rh-vi-addr">${o.shopAddr||o.shopAddress||'—'} · ${o.date}</div>
        </div>
        <div style="display:flex;align-items:center;gap:7px">
          <span class="rh-vi-total">${(parseFloat(o.total)||0).toLocaleString()} د.ع</span>
          ${o.location?`<a href="${o.location}" target="_blank" class="rt-loc-btn">🗺</a>`:''}
        </div>
      </div>`).join('')
    :`<div style="text-align:center;padding:28px;color:rgba(9,50,87,.33)">
        <div style="font-size:2rem;margin-bottom:8px">🚀</div>
        <p style="font-weight:700">لا توجد زيارات اليوم</p>
        <p style="font-size:.76rem;margin-top:4px;color:rgba(9,50,87,.28)">اضغط "طلب جديد" وابدأ يومك!</p>
      </div>`;

  // آخر العروض
  const activeOffers=offers.filter(o=>o.status==='active');
  const offCard=document.getElementById('rhOffersCard');
  if(activeOffers.length&&offCard){
    offCard.style.display='block';
    document.getElementById('rhOffersList').innerHTML=activeOffers.slice(0,3).map(o=>`
      <div style="display:flex;align-items:center;gap:11px;padding:9px 0;border-bottom:1px solid rgba(245,158,11,.08)">
        <div style="width:36px;height:36px;border-radius:var(--r12);background:rgba(245,158,11,.1);display:flex;align-items:center;justify-content:center;font-size:1rem;flex-shrink:0">${o.type==='percent'?'%':'🎁'}</div>
        <div style="flex:1">
          <div style="font-weight:700;font-size:.84rem;color:var(--deep)">${o.title}</div>
          <div style="font-size:.7rem;color:rgba(9,50,87,.42)">${o.desc}</div>
        </div>
        <span style="font-weight:900;color:var(--gold2);font-size:.86rem">${o.type==='percent'?o.value+'%':(parseFloat(o.value)||0).toLocaleString()+' د.ع'}</span>
      </div>`).join('');
  }
}


let rfLeafMap = null;

function renderRepField(){
  if(!CU) return;
  const myOrds=orders.filter(o=>o.repUser===CU.username);
  const todayOrds=myOrds.filter(o=>isSameDay(o.date,new Date()));
  const monthSales=myOrds.filter(o=>isThisMonth(o.date)).reduce((s,o)=>s+(parseFloat(o.total)||0),0);
  const totalComm=myOrds.reduce((s,o)=>s+(parseFloat(o.commission)||0),0);

  document.getElementById('rfKpi').innerHTML=`
    <div class="kpi-card kpi-sky"><div class="kpi-icon">📅</div><div class="kpi-val">${todayOrds.length}</div><div class="kpi-lbl">زيارات اليوم</div></div>
    <div class="kpi-card kpi-teal"><div class="kpi-icon">📦</div><div class="kpi-val">${myOrds.length}</div><div class="kpi-lbl">إجمالي طلباتي</div></div>
    <div class="kpi-card kpi-mint"><div class="kpi-icon">💰</div><div class="kpi-val">${(monthSales/1000).toFixed(0)}K</div><div class="kpi-lbl">مبيعات الشهر</div></div>
    <div class="kpi-card kpi-gold"><div class="kpi-icon">💸</div><div class="kpi-val">${(totalComm/1000).toFixed(0)}K</div><div class="kpi-lbl">عمولاتي</div></div>`;

  const cnt=document.getElementById('rfTodayCount');
  if(cnt) cnt.textContent=todayOrds.length;

  document.getElementById('rfVisitList').innerHTML=todayOrds.length
    ?[...todayOrds].reverse().map(o=>`
      <div class="visit-item">
        <div class="vi-icon">🏪</div>
        <div style="flex:1">
          <div class="vi-shop">${o.shopName||'—'}</div>
          <div class="vi-meta">${o.shopAddr||o.shopAddress||'—'} · ${o.date}</div>
          <div class="vi-meta" style="margin-top:2px;font-size:.67rem">${o.products}</div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px">
          <span class="vi-total">${(parseFloat(o.total)||0).toLocaleString()} د.ع</span>
          ${o.location?`<a href="${o.location}" target="_blank" class="rt-loc-btn">🗺</a>`:''}
        </div>
      </div>`).join('')
    :'<div style="text-align:center;color:rgba(9,50,87,.33);padding:28px">لا توجد زيارات اليوم — اذهب للمتجر وابدأ!</div>';
}

function updateRepLocation(){
  const statusEl=document.getElementById('rfLocStatus');
  const mapWrap=document.getElementById('rfMapWrap');
  if(!navigator.geolocation){statusEl.textContent='⚠️ الموقع غير متاح في هذا المتصفح';return;}
  statusEl.textContent='⏳ جاري تحديد موقعك...';
  navigator.geolocation.getCurrentPosition(
    pos=>{
      const lat=pos.coords.latitude, lng=pos.coords.longitude;
      statusEl.innerHTML=`✅ تم تحديد موقعك — <strong>${lat.toFixed(5)}, ${lng.toFixed(5)}</strong>`;
      mapWrap.style.display='block';
      if(!rfLeafMap){
        setTimeout(()=>{
          rfLeafMap=L.map('rfMap').setView([lat,lng],15);
          L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',{attribution:'©OSM'}).addTo(rfLeafMap);
          L.marker([lat,lng]).addTo(rfLeafMap).bindPopup(`📍 موقعي الحالي`).openPopup();
        },100);
      } else {
        rfLeafMap.setView([lat,lng],15);
        rfLeafMap.eachLayer(l=>{if(l instanceof L.Marker) rfLeafMap.removeLayer(l);});
        L.marker([lat,lng]).addTo(rfLeafMap).bindPopup('📍 موقعي الحالي').openPopup();
        rfLeafMap.invalidateSize();
      }
      // حفظ الموقع في Firebase
      if(CU&&fbReady){
        const uo=users.find(u=>u.username===CU.username);
        if(uo&&uo._id){
          fbUpdate('users',uo._id,{
            lastLocation:`https://www.google.com/maps?q=${lat},${lng}`,
            lastLocationAt:new Date().toLocaleDateString('ar-IQ')
          }).catch(()=>{});
        }
      }
    },
    err=>{statusEl.textContent='❌ تعذّر الحصول على الموقع — تأكد من تفعيل GPS'},
    {enableHighAccuracy:true,timeout:10000}
  );
}
