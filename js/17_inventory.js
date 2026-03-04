// ═══════════════════════════════════════════════════════
// INVENTORY
// ═══════════════════════════════════════════════════════
function renderInventory(){
  document.getElementById('inv_all').textContent=products.length;
  document.getElementById('inv_low').textContent=products.filter(p=>p.stock>0&&p.stock<p.minStock).length;
  document.getElementById('inv_out').textContent=products.filter(p=>p.stock===0).length;
  document.getElementById('invBody').innerHTML=products.map(p=>{
    const pct=p.minStock>0?Math.min(100,(p.stock/p.minStock)*50):50;
    const cls=p.stock===0?'sf-out':p.stock<p.minStock?'sf-low':'sf-ok';
    const bc=p.stock===0?'b-red':p.stock<p.minStock?'b-gold':'b-green';
    const bl=p.stock===0?'🚫 نفاد':p.stock<p.minStock?'⚠️ منخفض':'✅ كافٍ';
    return `<tr>
      <td style="font-weight:700;color:var(--deep)">${p.name}</td>
      <td><span class="badge b-sky">${p.cat}</span></td>
      <td><div style="display:flex;align-items:center;gap:7px">
        <span style="font-weight:900;min-width:26px;color:var(--deep)">${p.stock===999?'∞':p.stock}</span>
        <div class="stock-bar" style="flex:1;max-width:75px"><div class="stock-fill ${cls}" style="width:${pct}%"></div></div>
      </div></td>
      <td>${p.minStock}</td>
      <td><span class="badge ${bc}">${bl}</span></td>
      <td><button class="btn btn-ghost btn-sm" onclick="openStockEdit(${p.idx})">✏️</button></td>
    </tr>`;
  }).join('');
}
