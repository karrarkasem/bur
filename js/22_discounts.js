// ═══════════════════════════════════════════════════════
// DISCOUNTS
// ═══════════════════════════════════════════════════════
async function renderDiscounts(){
  if(!CU) return;
  const isAdmin=CU.type==='admin'||CU.type==='sales_manager';
  if(!discounts.length) discounts=await fbGet('discounts');
  const list=isAdmin?discounts:discounts.filter(d=>d.shopUsername===CU.username);
  document.getElementById('discBody').innerHTML=list.length
    ?[...list].reverse().map(d=>`
      <tr><td>${tsToStr(d.date)}</td>
      <td style="font-weight:700;color:var(--deep)">${d.shopName}</td>
      <td><span class="badge b-gold">${d.type==='percent'?`${d.amount}%`:'مبلغ ثابت'}</span></td>
      <td style="font-weight:900;color:var(--rose)">− ${(parseFloat(d.finalAmt)||0).toLocaleString()} د.ع</td>
      <td style="color:rgba(9,50,87,.52)">${d.desc}</td></tr>`).join('')
    :'<tr><td colspan="5" style="text-align:center;padding:28px;color:rgba(9,50,87,.33)">لا توجد خصومات</td></tr>';
}

function openDiscModal(){
  const markets=users.filter(u=>u.type==='market_owner');
  const sel=document.getElementById('disc_user');
  sel.innerHTML='<option value="">— اختر —</option>'+markets.map(u=>`<option value="${u.username}">${u.name} — رصيد: ${parseFloat(u.balance||0).toLocaleString()} د.ع</option>`).join('');
  document.getElementById('disc_bal_box').style.display='none';
  document.getElementById('disc_preview').style.display='none';
  document.getElementById('disc_base_wrap').style.display='none';
  ['disc_amt','disc_base','disc_desc'].forEach(id=>document.getElementById(id).value='');
  document.getElementById('disc_type').value='amount';
  discTypeChanged();openModal('discModal');
}

function discUserChanged(){
  const un=document.getElementById('disc_user').value;
  const uo=users.find(u=>u.username===un);
  const box=document.getElementById('disc_bal_box');
  if(uo){document.getElementById('disc_bal_val').textContent=parseFloat(uo.balance||0).toLocaleString()+' د.ع';box.style.display='block';}
  else box.style.display='none';
  calcDiscPreview();
}

function discTypeChanged(){
  const t=document.getElementById('disc_type').value;
  document.getElementById('disc_amt_label').textContent=t==='percent'?'النسبة (%) *':'المبلغ (د.ع) *';
  document.getElementById('disc_base_wrap').style.display=t==='percent'?'block':'none';
  calcDiscPreview();
}

function calcDiscPreview(){
  const t=document.getElementById('disc_type').value;
  const amt=parseFloat(document.getElementById('disc_amt').value)||0;
  const base=parseFloat(document.getElementById('disc_base').value)||0;
  const prev=document.getElementById('disc_preview');
  const finalAmt=t==='percent'?Math.round(base*amt/100):amt;
  if(finalAmt>0){prev.style.display='block';prev.textContent=`قيمة الخصم: ${finalAmt.toLocaleString()} د.ع`;}
  else prev.style.display='none';
}

async function saveDiscount(){
  const un=document.getElementById('disc_user').value;
  const t=document.getElementById('disc_type').value;
  const amt=parseFloat(document.getElementById('disc_amt').value)||0;
  const base=parseFloat(document.getElementById('disc_base').value)||0;
  const desc=document.getElementById('disc_desc').value.trim();
  const uo=users.find(u=>u.username===un);
  if(!uo){toast('اختر الماركت',false);return;}
  if(!amt){toast('أدخل قيمة',false);return;}
  if(!desc){toast('أدخل السبب',false);return;}
  const finalAmt=t==='percent'?Math.round(base*amt/100):amt;
  if(finalAmt<=0){toast('القيمة يجب أن تكون أكبر من صفر',false);return;}
  const nowDate=new Date().toLocaleDateString('ar-IQ');
  uo.balance=(uo.balance||0)-finalAmt;
  uo.transactions=uo.transactions||[];
  const tx={type:'debit',amount:finalAmt,desc:`🏷️ خصم: ${desc}`,date:nowDate};
  uo.transactions.push(tx);
  const disc={date:nowDate,shopUsername:un,shopName:uo.name,type:t,amount:amt,finalAmt,desc};
  discounts.push({...disc,_id:'D'+Date.now()});
  await fbAdd('discounts',disc);
  if(uo._id){
    await fbUpdate('users',uo._id,{balance:uo.balance}).catch(()=>{});
    await fbAddSub('users',uo._id,'transactions',tx).catch(()=>{});
  }
  closeModal('discModal');
  toast(`✅ تم تطبيق خصم ${finalAmt.toLocaleString()} د.ع على ${uo.name}`);
  buildWalletPage();renderDiscounts();renderUsersList();updateWalletBar();
}
