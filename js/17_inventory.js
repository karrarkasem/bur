// ═══════════════════════════════════════════════════════
// INVENTORY
// ═══════════════════════════════════════════════════════
function renderInventory(){
  const inv_all = document.getElementById('inv_all');
  const inv_low = document.getElementById('inv_low');
  const inv_out = document.getElementById('inv_out');
  const invBody = document.getElementById('invBody');
  if(inv_all) inv_all.textContent=products.length;
  if(inv_low) inv_low.textContent=products.filter(p=>p.stock>0&&p.stock<p.minStock).length;
  if(inv_out) inv_out.textContent=products.filter(p=>p.stock===0).length;
  if(!invBody) return;
  invBody.innerHTML=products.map(p=>{
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
