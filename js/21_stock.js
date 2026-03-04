// ═══════════════════════════════════════════════════════
// STOCK EDIT
// ═══════════════════════════════════════════════════════
function openStockEdit(idx){
  const p=products.find(x=>x.idx===idx);if(!p) return;
  document.getElementById('stockProdName').textContent='🛍️ '+p.name;
  document.getElementById('stock_qty').value=p.stock===999?0:p.stock;
  document.getElementById('stock_min').value=p.minStock||10;
  document.getElementById('stock_idx').value=idx;
  openModal('stockModal');
}

async function saveStockEdit(){
  const idx=parseInt(document.getElementById('stock_idx').value);
  const qty=parseInt(document.getElementById('stock_qty').value)||0;
  const minStock=parseInt(document.getElementById('stock_min').value)||10;
  const p=products.find(x=>x.idx===idx);if(!p) return;
  p.stock=qty;p.minStock=minStock;
  if(p._id) await fbUpdate('products',p._id,{stock:qty,minStock}).catch(()=>{});
  closeModal('stockModal');
  toast(`✅ تم تحديث مخزون "${p.name}" إلى ${qty}`);
  renderInventory();renderManageProds();renderStore('الكل');
}
