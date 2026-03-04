// ═══════════════════════════════════════════════════════
// PURCHASES
// ═══════════════════════════════════════════════════════
function initPurItems(){purItems=[{product:'',qty:1,unitPrice:0}];renderPurItemsUI();}
function addPurItem(){purItems.push({product:'',qty:1,unitPrice:0});renderPurItemsUI();}
function renderPurItemsUI(){
  document.getElementById('purItemsWrap').innerHTML=purItems.map((item,i)=>`
    <div class="pur-item-row">
      <select class="fsel" style="font-size:.8rem;padding:7px 9px" onchange="purChange(${i},'product',this.value)">
        <option value="">اختر منتج</option>
        ${products.map(p=>`<option value="${p.name}" ${item.product===p.name?'selected':''}>${p.name}</option>`).join('')}
      </select>
      <input type="number" class="fi" style="font-size:.8rem;padding:7px" placeholder="الكمية" value="${item.qty}" min="1" oninput="purChange(${i},'qty',this.value);calcPur()">
      <input type="number" class="fi" style="font-size:.8rem;padding:7px" placeholder="سعر الوحدة" value="${item.unitPrice||''}" oninput="purChange(${i},'unitPrice',this.value);calcPur()">
      <button class="btn btn-danger btn-sm" onclick="purItems.splice(${i},1);renderPurItemsUI()">✕</button>
    </div>`).join('');
  calcPur();
}
function purChange(i,f,v){purItems[i][f]=f==='product'?v:(parseFloat(v)||0);}
function calcPur(){document.getElementById('purTotalVal').textContent=purItems.reduce((s,i)=>s+i.qty*i.unitPrice,0).toLocaleString();}

async function savePurchase(){
  const sup=document.getElementById('pur_sup').value.trim();
  const date=document.getElementById('pur_date').value;
  if(!sup){toast('أدخل اسم المورد',false);return;}
  if(!purItems.length||!purItems[0].product){toast('أضف منتجاً على الأقل',false);return;}
  const total=purItems.reduce((s,i)=>s+i.qty*i.unitPrice,0);
  for(const item of purItems){
    if(!item.product) continue;
    const p=products.find(x=>x.name===item.product);
    if(p){
      p.stock+=Math.floor(item.qty);
      if(p._id) await fbUpdate('products',p._id,{stock:p.stock}).catch(()=>{});
    }
  }
  const purId='PUR'+String(Date.now()).slice(-6);
  await fbAdd('purchases',{
    purId, date, supplier:sup,
    items:purItems.map(i=>({product:i.product,qty:i.qty,unitPrice:i.unitPrice})),
    total, createdBy:CU?.name||'—'
  });
  purInvoices.push({id:purId,date,supplier:sup,items:[...purItems],total,user:CU?.name||'—'});
  closeModal('purchaseModal');
  toast('✅ تم حفظ الفاتورة وتحديث المخزون');
  renderInventory();renderPurchaseList();renderManageProds();renderStore('الكل');
}

function renderPurchaseList(){
  document.getElementById('purBody').innerHTML=[...purInvoices].reverse().map(inv=>`
    <tr><td style="font-weight:700">${inv.id}</td><td>${inv.date}</td><td>${inv.supplier}</td>
    <td style="max-width:115px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:rgba(9,50,87,.48)">${inv.items.map(i=>`${i.product}×${i.qty}`).join('، ')}</td>
    <td style="font-weight:800;color:var(--mint2)">${inv.total.toLocaleString()} د.ع</td>
    <td>${inv.user}</td></tr>`).join('')
  ||'<tr><td colspan="6" style="text-align:center;padding:28px;color:rgba(9,50,87,.33)">لا توجد فواتير</td></tr>';
}

function renderSalesList(){
  document.getElementById('salBody').innerHTML=[...orders].reverse().map((o,i)=>`
    <tr>
      <td style="font-weight:700">${o.id||`INV${i+1}`}</td>
      <td>${o.date}</td>
      <td style="font-weight:700;color:var(--deep)">${o.shopName||'—'}</td>
      <td style="max-width:100px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:rgba(9,50,87,.48)">${o.products}</td>
      <td style="font-weight:800;color:var(--mint2)">${(parseFloat(o.total)||0).toLocaleString()} د.ع</td>
      <td>${o.repName||'—'}</td>
    </tr>`).join('')
  ||'<tr><td colspan="6" style="text-align:center;padding:28px;color:rgba(9,50,87,.33)">لا توجد فواتير</td></tr>';
}

function switchInvTab(tab,btn){
  document.querySelectorAll('.tabs .tab').forEach(t=>t.classList.remove('on'));btn.classList.add('on');
  document.getElementById('tabPur').classList.toggle('on',tab==='pur');
  document.getElementById('tabSal').classList.toggle('on',tab==='sal');
}
