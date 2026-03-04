// ═══════════════════════════════════════════════════════
// STORE
// ═══════════════════════════════════════════════════════
function renderCats(){
  const cats=['الكل',...new Set(products.filter(p=>p.status==='active').map(p=>p.cat))];
  document.getElementById('catsRow').innerHTML=cats.map((c,i)=>
    `<button class="cat-chip ${i===0?'on':''}" onclick="renderStore('${esc(c)}',this)">${c}</button>`
  ).join('');
}

function renderStore(filter='الكل',btn=null){
  if(btn){document.querySelectorAll('.cat-chip').forEach(c=>c.classList.remove('on'));btn.classList.add('on');}
  document.getElementById('guestBannerWrap').innerHTML=!CU?`
    <div class="guest-banner">
      <div class="gb-text"><p>🌐 أنت تتصفح كزائر</p><span>يمكنك التصفح وإرسال طلب — سجّل دخول للاستفادة الكاملة</span></div>
      <button class="btn btn-sky btn-sm" onclick="showLogin()">👤 دخول</button>
    </div>`:'';

  const active=products.filter(p=>p.status==='active');
  const shown=filter==='الكل'?active:active.filter(p=>p.cat===filter);
  document.getElementById('prodGrid').innerHTML=shown.length?shown.map((p,i)=>{
    const q=cart[p.name]?.qty||0;
    const sClass=p.stock===0?'sb-out':p.stock<p.minStock?'sb-low':'sb-ok';
    const sLabel=p.stock===0?'نفاد المخزون':p.stock<p.minStock?`متبقي ${p.stock}`:p.stock+' +';
    return `<div class="prod-card" style="animation-delay:${i*.05}s">
      <div class="prod-img-box" onclick='openProdModal(${escj(p)})'>
        <img src="${p.img}" loading="lazy" onerror="this.src='https://via.placeholder.com/200?text=📦'">
        <div class="stock-badge ${sClass}">${sLabel}</div>
      </div>
      <div class="prod-body">
        <div class="prod-name" onclick='openProdModal(${escj(p)})'>${p.name}</div>
        <div class="prod-price">${p.price.toLocaleString()} <span style="font-size:.68rem;color:rgba(9,50,87,.38);font-weight:600">د.ع</span></div>
        ${p.stock>0?`<div class="qty-ctrl">
          <button class="q-btn" onclick="cartDelta('${esc(p.name)}',-1,${p.price})">−</button>
          <span class="q-num" id="q_${safeName(p.name)}">${q}</span>
          <button class="q-btn plus" onclick="cartDelta('${esc(p.name)}',1,${p.price})">+</button>
        </div>`:`<div style="text-align:center;font-size:.72rem;color:rgba(9,50,87,.33);padding:7px">نفاد المخزون</div>`}
      </div></div>`;
  }).join(''):'<div style="grid-column:1/-1;text-align:center;padding:55px;color:rgba(9,50,87,.38)">لا توجد منتجات</div>';
}

function doSearch(q){
  if(!q){renderStore();return;}
  const r=products.filter(p=>p.status==='active'&&(p.name.includes(q)||p.cat.includes(q)));
  document.getElementById('prodGrid').innerHTML=r.map(p=>`
    <div class="prod-card" onclick='openProdModal(${escj(p)})'>
      <div class="prod-img-box"><img src="${p.img}" loading="lazy" onerror="this.src='https://via.placeholder.com/200?text=📦'"></div>
      <div class="prod-body">
        <div class="prod-name">${p.name}</div>
        <div class="prod-price">${p.price.toLocaleString()} د.ع</div>
        ${p.stock>0?`<div class="qty-ctrl">
          <button class="q-btn" onclick="event.stopPropagation();cartDelta('${esc(p.name)}',-1,${p.price})">−</button>
          <span class="q-num" id="q_${safeName(p.name)}">${cart[p.name]?.qty||0}</span>
          <button class="q-btn plus" onclick="event.stopPropagation();cartDelta('${esc(p.name)}',1,${p.price})">+</button>
        </div>`:'<div style="text-align:center;font-size:.72rem;color:rgba(9,50,87,.33);padding:7px">نفاد المخزون</div>'}
      </div></div>`).join('')||'<div style="grid-column:1/-1;text-align:center;padding:55px;color:rgba(9,50,87,.38)">لا توجد نتائج</div>';
}
