// ═══════════════════════════════════════════════════════
// WALLET
// ═══════════════════════════════════════════════════════
function buildWalletPage(){
  if(!CU) return;
  const uo=users.find(u=>u.username===CU.username)||CU;
  const bal=parseFloat(uo.balance||0);
  document.getElementById('walBal').textContent=bal.toLocaleString();
  buildWalletKpi();
  const tabBtn=document.getElementById('tabDiscBtn');
  if(tabBtn) tabBtn.style.display=['admin','sales_manager','market_owner'].includes(CU.type)?'block':'none';
  document.getElementById('addDiscWrap').style.display=(CU.type==='admin'||CU.type==='sales_manager')?'flex':'none';
  let sub='';
  if(CU.type==='rep'){const totComm=orders.filter(o=>o.repUser===CU.username).reduce((s,o)=>s+(parseFloat(o.commission)||0),0);sub=`إجمالي العمولات: ${totComm.toLocaleString()} د.ع`;}
  else if(CU.type==='market_owner'){const myBuys=orders.filter(o=>o.shopName===CU.name);sub=`إجمالي مشترياتك: ${myBuys.reduce((s,o)=>s+(parseFloat(o.total)||0),0).toLocaleString()} د.ع`;}
  document.getElementById('walSub').textContent=sub;
  const actHtml=CU.type==='admin'
    ?`<button class="btn btn-sky" onclick="openPayForUser()">💸 إدارة رصيد المستخدمين</button>`
    :CU.type==='sales_manager'
    ?`<button class="btn btn-ghost" onclick="openPayForUser()">💸 دفع عمولة لمندوب</button>`:'';
  document.getElementById('walActs').innerHTML=actHtml;
  const txs=uo.transactions||[];
  document.getElementById('txList').innerHTML=txs.length
    ?[...txs].reverse().map(tx=>`
      <div class="tx-row tx-${tx.type}" style="display:flex;align-items:center;gap:11px">
        <div class="tx-ico">${tx.type==='credit'?'⬇️':'⬆️'}</div>
        <div style="flex:1"><div class="tx-desc">${tx.desc||'معاملة'}</div><div class="tx-date">${tsToStr(tx.date)}</div></div>
        <div class="tx-amt">${tx.type==='credit'?'+':'-'}${(parseFloat(tx.amount)||0).toLocaleString()} د.ع</div>
      </div>`).join('')
    :'<div style="text-align:center;color:rgba(9,50,87,.33);padding:28px">لا توجد معاملات</div>';
  loadPointsForUser();
}

// ═══ تحميل نقاط المستخدم مع شريط التقدم ═══
async function loadPointsForUser(){
  if(!CU||!fbReady) return;
  const uo=users.find(u=>u.username===CU.username);
  
  // حساب إجمالي مبيعات المستخدم من الطلبات
  let totalSales = 0;
  if(CU.type==='rep') {
    totalSales = orders.filter(o=>o.repUser===CU.username).reduce((s,o)=>s+(parseFloat(o.total)||0),0);
  } else if(CU.type==='market_owner') {
    totalSales = orders.filter(o=>o.shopName===CU.name).reduce((s,o)=>s+(parseFloat(o.total)||0),0);
  }
  
  // النقاط المحسوبة من المبيعات
  const calculatedPoints = Math.floor(totalSales / POINTS_PER_IQD);
  
  // جلب بيانات النقاط من Firebase
  const allPts = await fbGet('points');
  const myPts = allPts.find(p=>p.userId===uo?._id||p.username===CU.username);
  
  const totalPoints = myPts ? parseInt(myPts.totalPoints||0) : calculatedPoints;
  const redeemedPoints = parseInt(myPts?.redeemedPoints||0);
  
  // النقطة التالية
  const salesForNextPoint = totalSales % POINTS_PER_IQD;
  const progressPct = Math.min(100, (salesForNextPoint / POINTS_PER_IQD) * 100);
  const remaining = POINTS_PER_IQD - salesForNextPoint;
  
  document.getElementById('ptsTotal').textContent = totalPoints.toLocaleString();
  document.getElementById('ptsRedeemed').textContent = redeemedPoints.toLocaleString();
  
  // تحديث معلومات المبيعات
  const ptsFromSales = document.getElementById('ptsFromSales');
  if(ptsFromSales) ptsFromSales.textContent = `من ${totalSales.toLocaleString()} د.ع مبيعات`;
  
  // شريط التقدم
  document.getElementById('ptsNextLabel').textContent = 
    `${salesForNextPoint.toLocaleString()} / ${POINTS_PER_IQD.toLocaleString()} د.ع`;
  document.getElementById('ptsProgressBar').style.width = progressPct + '%';
  
  // تحديث عنوان البطاقة
  const nextCard = document.getElementById('ptsNextCard');
  if(nextCard) {
    nextCard.querySelector('span:last-child') && 
      (nextCard.querySelector('#ptsNextLabel').textContent = 
        `${salesForNextPoint.toLocaleString()} / ${POINTS_PER_IQD.toLocaleString()} د.ع`);
  }
  
  // سجل النقاط
  if(myPts&&uo?._id){
    const hist=await fbGetSub('points',uo._id,'history');
    document.getElementById('ptsHistList').innerHTML=hist.length
      ?[...hist].reverse().map(h=>`
        <div class="pts-hist-row">
          <div>
            <span style="font-weight:700;color:var(--deep)">${h.type==='earn'?'➕ اكتساب':'➖ استرداد'}</span>
            <div style="font-size:.72rem;color:rgba(9,50,87,.4)">${tsToStr(h.date)} · ${h.shopName||''}</div>
            <div style="font-size:.68rem;color:rgba(9,50,87,.35)">قيمة الطلب: ${(parseFloat(h.orderTotal)||0).toLocaleString()} د.ع</div>
          </div>
          <span style="font-size:1.05rem;font-weight:900;color:${h.type==='earn'?'var(--violet)':'var(--gold2)'}">${h.type==='earn'?'+':'-'}${h.points} نقطة</span>
        </div>`).join('')
      :`<div style="text-align:center;color:rgba(9,50,87,.33);padding:22px">
          <div style="font-size:2rem;margin-bottom:8px">⭐</div>
          <p style="font-size:.82rem">لا يوجد سجل نقاط بعد</p>
          <p style="font-size:.76rem;color:rgba(9,50,87,.28);margin-top:4px">أكمل طلبات بقيمة ${POINTS_PER_IQD.toLocaleString()} د.ع للحصول على نقطتك الأولى!</p>
        </div>`;
  } else {
    document.getElementById('ptsHistList').innerHTML=`
      <div style="text-align:center;color:rgba(9,50,87,.33);padding:22px">
        <div style="font-size:2rem;margin-bottom:8px">⭐</div>
        <p style="font-size:.82rem">لا يوجد سجل نقاط بعد</p>
        <p style="font-size:.76rem;color:rgba(9,50,87,.28);margin-top:4px">أكمل طلبات بقيمة ${POINTS_PER_IQD.toLocaleString()} د.ع للحصول على نقطتك الأولى!</p>
      </div>`;
  }
}

function buildWalletKpi(){
  const uo=users.find(u=>u.username===CU?.username)||CU;
  if(!uo) return;
  let kpiHtml='';
  if(CU.type==='rep'){
    const myOrds=orders.filter(o=>o.repUser===CU.username);
    const totComm=myOrds.reduce((s,o)=>s+(parseFloat(o.commission)||0),0);
    const today=myOrds.filter(o=>isSameDay(o.date,new Date())).reduce((s,o)=>s+(parseFloat(o.commission)||0),0);
    kpiHtml=`<div class="kpi-card kpi-mint"><div class="kpi-icon">💸</div><div class="kpi-val">${totComm.toLocaleString()}</div><div class="kpi-lbl">إجمالي العمولات (د.ع)</div></div>
    <div class="kpi-card kpi-sky"><div class="kpi-icon">📅</div><div class="kpi-val">${today.toLocaleString()}</div><div class="kpi-lbl">عمولة اليوم (د.ع)</div></div>
    <div class="kpi-card kpi-gold"><div class="kpi-icon">💰</div><div class="kpi-val">${parseFloat(uo.balance||0).toLocaleString()}</div><div class="kpi-lbl">الرصيد المتاح (د.ع)</div></div>`;
  } else if(CU.type==='market_owner'){
    const myBuys=orders.filter(o=>o.shopName===CU.name).reduce((s,o)=>s+(parseFloat(o.total)||0),0);
    kpiHtml=`<div class="kpi-card kpi-sky"><div class="kpi-icon">🛒</div><div class="kpi-val">${myBuys.toLocaleString()}</div><div class="kpi-lbl">إجمالي المشتريات (د.ع)</div></div>
    <div class="kpi-card kpi-gold"><div class="kpi-icon">💰</div><div class="kpi-val">${parseFloat(uo.balance||0).toLocaleString()}</div><div class="kpi-lbl">الرصيد المتاح (د.ع)</div></div>`;
  } else if(CU.type==='admin'||CU.type==='sales_manager'){
    const totComm=orders.reduce((s,o)=>s+(parseFloat(o.commission)||0),0);
    kpiHtml=`<div class="kpi-card kpi-mint"><div class="kpi-icon">💸</div><div class="kpi-val">${totComm.toLocaleString()}</div><div class="kpi-lbl">إجمالي العمولات المدفوعة (د.ع)</div></div>
    <div class="kpi-card kpi-gold"><div class="kpi-icon">💰</div><div class="kpi-val">${parseFloat(uo.balance||0).toLocaleString()}</div><div class="kpi-lbl">رصيدك (د.ع)</div></div>`;
  }
  document.getElementById('walKpi').innerHTML=kpiHtml;
}

function switchWalTab(tab,btn){
  document.querySelectorAll('#walTabs .tab').forEach(t=>t.classList.remove('on'));btn.classList.add('on');
  document.getElementById('walTabTxs').classList.toggle('on',tab==='txs');
  document.getElementById('walTabDisc').classList.toggle('on',tab==='disc');
  document.getElementById('walTabPts').classList.toggle('on',tab==='pts');
  if(tab==='disc') renderDiscounts();
  if(tab==='pts') loadPointsForUser();
}

function openPayForUser(preUsername){
  if(preUsername){openPayModal(preUsername);return;}
  const selectable=users.filter(u=>u.type==='rep'||u.type==='market_owner'||u.type==='sales_manager');
  if(!selectable.length){toast('لا يوجد مستخدمون',false);return;}
  const opts=selectable.map(u=>`
    <div class="user-item" style="cursor:pointer" onclick="closeModal('pickUserModal');openPayModal('${u.username}')">
      <div class="ui-av">${u.type==='rep'?'🤝':'🏪'}</div>
      <div class="ui-info"><div class="ui-name">${u.name}</div><div class="ui-meta"><span>${ROLES[u.type]||u.type}</span><span>@${u.username}</span></div></div>
      <div class="ui-bal">${parseFloat(u.balance||0).toLocaleString()} <span style="font-size:.6rem;color:rgba(9,50,87,.33)">د.ع</span></div>
    </div>`).join('');
  document.getElementById('pickUserList').innerHTML=opts;
  openModal('pickUserModal');
}

function openPayModal(username){
  const uo=users.find(u=>u.username===username);if(!uo) return;
  document.getElementById('payUserName').textContent=`${ROLES[uo.type]||uo.type} — ${uo.name} (@${uo.username})`;
  document.getElementById('payBal').textContent=parseFloat(uo.balance||0).toLocaleString()+' د.ع';
  document.getElementById('payAmt').value='';
  document.getElementById('payDesc').value='';
  document.getElementById('payTarget').value=username;
  openModal('payModal');
}

async function doPayment(){
  const amt=parseFloat(document.getElementById('payAmt').value)||0;
  const type=document.getElementById('payType').value;
  const desc=document.getElementById('payDesc').value.trim()||'معاملة يدوية';
  const target=document.getElementById('payTarget').value;
  const uo=users.find(u=>u.username===target);
  if(!uo||amt<=0){toast('أدخل مبلغاً صحيحاً',false);return;}
  if(type==='debit'&&amt>(uo.balance||0)){toast('الرصيد غير كافٍ',false);return;}
  uo.balance=type==='credit'?(uo.balance||0)+amt:(uo.balance||0)-amt;
  uo.transactions=uo.transactions||[];
  const tx={type,amount:amt,desc,date:new Date().toLocaleDateString('ar-IQ')};
  uo.transactions.push(tx);
  if(CU&&uo.username===CU.username) CU.balance=uo.balance;
  if(uo._id){
    await fbUpdate('users',uo._id,{balance:uo.balance}).catch(()=>{});
    await fbAddSub('users',uo._id,'transactions',tx).catch(()=>{});
  }
  closeModal('payModal');
  toast(`✅ ${type==='credit'?'➕ إيداع':'➖ سحب'} ${amt.toLocaleString()} د.ع لـ ${uo.name}`);
  buildWalletPage();renderUsersList();updateWalletBar();
}
