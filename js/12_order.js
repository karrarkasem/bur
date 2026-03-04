// ═══════════════════════════════════════════════════════
// SEND ORDER + حساب النقاط
// ═══════════════════════════════════════════════════════
async function sendOrder(){
  const shop=document.getElementById('shopName').value.trim();
  const addr=document.getElementById('shopAddr').value.trim();
  const note=document.getElementById('orderNote').value.trim();
  let hasErr=false;
  document.getElementById('shopName').classList.remove('err');
  document.getElementById('shopAddr').classList.remove('err');
  if(!shop){document.getElementById('shopName').classList.add('err');hasErr=true;}
  if(!addr){document.getElementById('shopAddr').classList.add('err');hasErr=true;}
  if(hasErr){toast('⚠️ أكمل الحقول المطلوبة',false);return;}
  if(CU?.type==='rep'&&!selLoc){toast('⚠️ المندوب مطلوب منه تحديد الموقع',false);return;}

  let prodList=[],total=0;
  for(const k in cart){prodList.push(`${k}(${cart[k].qty})`);total+=cart[k].qty*cart[k].price;}
  const commPct=CU?.commPct||0;
  const commission=Math.round(total*commPct/100);
  const net=total-commission;
  const nowStr=new Date().toLocaleString('ar-IQ');
  const orderId='ORD'+Date.now();

  for(const k in cart){const p=products.find(x=>x.name===k);if(p&&p.stock!==999) p.stock=Math.max(0,p.stock-cart[k].qty);}

  const orderData = {
    orderId, date:nowStr,
    repUsername:CU?.username||'guest', repName:CU?.name||'زائر',
    commPct, shopName:shop, shopAddress:addr, note:note||'',
    location:selLoc||'',
    products:prodList.join('، '),
    total, commission, net,
  };

  const fbId = await fbAdd('orders', orderData);

  // تسجيل زيارة المندوب
  if(CU&&(CU.type==='rep'||CU.type==='sales_manager')){
    logRepVisit(CU.username, shop, addr, selLoc, fbId||orderId, total);
  }

  for(const k in cart){
    const p=products.find(x=>x.name===k);
    if(p&&p._id&&p.stock!==999) await fbUpdate('products',p._id,{stock:p.stock}).catch(()=>{});
  }

  // ═══ إضافة عمولة للمندوب + حساب النقاط ═══
  if(CU&&(CU.type==='rep'||CU.type==='sales_manager'||CU.type==='market_owner')){
    const uo=users.find(u=>u.username===CU.username);
    if(uo){
      // عمولة المندوب
      if(commission>0&&(CU.type==='rep'||CU.type==='sales_manager')){
        uo.balance=(uo.balance||0)+commission;
        const tx={type:'credit',amount:commission,
          desc:`عمولة ${commPct}% — ${shop} (${total.toLocaleString()} د.ع)`,
          date:new Date().toLocaleDateString('ar-IQ')};
        uo.transactions=uo.transactions||[];
        uo.transactions.push(tx);
        CU.balance=uo.balance;
        if(uo._id){
          await fbUpdate('users',uo._id,{balance:uo.balance}).catch(()=>{});
          await fbAddSub('users',uo._id,'transactions',tx).catch(()=>{});
        }
      }

      // ═══ نظام النقاط: كل 100,000 د.ع = نقطة ═══
      if(CU.type==='rep'||CU.type==='market_owner'){
        await awardPoints(uo, total, shop, fbId||orderId);
      }
    }
    updateWalletBar();
  }

  await fbAdd('notifications',{
    title:'📦 طلب جديد',
    body:`${CU?.name||'زائر'} — ${shop} — ${total.toLocaleString()} د.ع`,
    type:'order', read:false, targetUser:'admin',
    date:new Date().toLocaleDateString('ar-IQ')
  }).catch(()=>{});

  let msg=`🛍️ *طلب جديد — برجمان*\n\n📅 *التاريخ:* ${nowStr}\n`;
  msg+=CU?`👤 *المندوب:* ${CU.name}\n`:`🌐 *طلب من زائر*\n`;
  msg+=`🏪 *المحل:* ${shop}\n📍 *العنوان:* ${addr}\n`;
  if(selLoc) msg+=`🗺️ *الموقع:* ${selLoc}\n`;
  if(note)   msg+=`📝 *ملاحظة:* ${note}\n`;
  msg+=`\n*📦 المنتجات:*\n`;
  for(const k in cart) msg+=`  • ${k} × ${cart[k].qty} = ${(cart[k].qty*cart[k].price).toLocaleString()} د.ع\n`;
  msg+=`\n💰 *الإجمالي: ${total.toLocaleString()} د.ع*`;
  if(CU&&commission>0) msg+=`\n💸 *عمولة المندوب: ${commission.toLocaleString()} د.ع*`;
  window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`,'_blank');

  orders.push(parseOrder({...orderData,_id:fbId||'',createdAt:nowStr}));
  cart={}; updateCartUI(); closeModal('cartModal');
  ['shopName','shopAddr','orderNote'].forEach(id=>document.getElementById(id).value='');
  document.getElementById('locOk').style.display='none'; selLoc='';
  toast(CU&&commission>0?`✅ الطلب أُرسل! عمولتك: ${commission.toLocaleString()} د.ع`:'✅ تم إرسال الطلب');
  renderStore('الكل'); renderInventory(); renderOrders(); buildDashboard(); renderSalesList();
}
