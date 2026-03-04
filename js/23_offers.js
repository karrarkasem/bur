// ═══════════════════════════════════════════════════════
// OFFERS
// ═══════════════════════════════════════════════════════
function renderOffers(){
  const isAdmin=CU&&(CU.type==='admin'||CU.type==='sales_manager');
  const addWrap=document.getElementById('addOfferWrap');
  if(addWrap) addWrap.style.display=isAdmin?'flex':'none';
  document.getElementById('offersList').innerHTML=offers.length?offers.map(o=>`
    <div class="offer-card">
      <div class="offer-icon">${o.type==='percent'?'%':o.type==='free'?'🎁':'💰'}</div>
      <div style="flex:1">
        <div class="offer-title">${o.title}</div>
        <div class="offer-desc">${o.desc}</div>
        <div style="font-size:.72rem;color:rgba(9,50,87,.38);margin-top:3px">من ${o.from} إلى ${o.to}</div>
      </div>
      <div>
        <div style="font-size:1.1rem;font-weight:900;color:var(--gold2)">${o.type==='percent'?o.value+'%':o.type==='free'?'مجاني':(parseFloat(o.value)||0).toLocaleString()+' د.ع'}</div>
        <span class="badge ${o.status==='active'?'b-green':'b-red'}" style="margin-top:5px">${o.status==='active'?'🟢 نشط':'🔴 موقف'}</span>
        ${isAdmin?`<div style="display:flex;gap:4px;margin-top:6px"><button class="btn btn-ghost btn-sm" onclick="openEditOffer('${o._id}')">✏️</button></div>`:''}
      </div>
    </div>`).join('')
  :'<div style="text-align:center;padding:55px;color:rgba(9,50,87,.35)">لا توجد عروض حالياً</div>';
}

function openAddOffer(){
  document.getElementById('offerModalTitle').textContent='إضافة عرض';
  document.getElementById('off_fbid').value='';
  ['off_title','off_desc','off_val'].forEach(id=>document.getElementById(id).value='');
  document.getElementById('off_from').value=new Date().toISOString().split('T')[0];
  document.getElementById('off_to').value='';
  document.getElementById('off_type').value='percent';
  document.getElementById('off_status').value='active';
  openModal('offerModal');
}

function openEditOffer(fbid){
  const o=offers.find(x=>x._id===fbid);if(!o) return;
  document.getElementById('offerModalTitle').textContent='تعديل العرض';
  document.getElementById('off_fbid').value=fbid;
  document.getElementById('off_title').value=o.title;
  document.getElementById('off_desc').value=o.desc;
  document.getElementById('off_val').value=o.value;
  document.getElementById('off_type').value=o.type;
  document.getElementById('off_from').value=o.from;
  document.getElementById('off_to').value=o.to;
  document.getElementById('off_status').value=o.status;
  openModal('offerModal');
}

async function saveOffer(){
  const title=document.getElementById('off_title').value.trim();
  const desc=document.getElementById('off_desc').value.trim();
  const type=document.getElementById('off_type').value;
  const value=parseFloat(document.getElementById('off_val').value)||0;
  const from=document.getElementById('off_from').value;
  const to=document.getElementById('off_to').value;
  const status=document.getElementById('off_status').value;
  const fbid=document.getElementById('off_fbid').value;
  if(!title){toast('أدخل عنوان العرض',false);return;}
  const offerData={title,description:desc,discountType:type,value,startDate:from,endDate:to,status};
  if(fbid){
    await fbUpdate('offers',fbid,offerData).catch(()=>{});
    const idx=offers.findIndex(x=>x._id===fbid);
    if(idx>=0) offers[idx]={...offers[idx],title,desc,type,value,from,to,status};
    toast('✅ تم تعديل العرض');
  } else {
    const newId=await fbAdd('offers',offerData);
    offers.push({_id:newId||'',title,desc,type,value,from,to,status});
    toast('✅ تم إضافة العرض');
  }
  closeModal('offerModal');renderOffers();
}
