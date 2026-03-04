// ═══════════════════════════════════════════════════════
// CART
// ═══════════════════════════════════════════════════════
function cartDelta(name,delta,price){
  if(!cart[name]) cart[name]={qty:0,price};
  cart[name].qty=Math.max(0,cart[name].qty+delta);
  const prod=products.find(p=>p.name===name);
  if(prod&&cart[name].qty>prod.stock){cart[name].qty=prod.stock;toast(`الكمية المتاحة فقط ${prod.stock}`);}
  if(cart[name].qty<=0) delete cart[name];
  const el=document.getElementById('q_'+safeName(name));
  if(el) el.textContent=cart[name]?.qty||0;
  updateCartUI();
}

function updateCartUI(){
  let total=0,count=0;
  for(const k in cart){total+=cart[k].qty*cart[k].price;count+=cart[k].qty;}
  const fmtT=total.toLocaleString()+' د.ع';
  document.getElementById('cartCountTop').textContent=count;
  document.getElementById('cfBubble').textContent=count;
  document.getElementById('cfTotal').textContent=fmtT;
  document.getElementById('cartTotalDisp').textContent=fmtT;
  document.getElementById('cartFloat').className='cart-float z1'+(count?' show':'');
}

function openCartModal(){renderCartItems();openModal('cartModal');}

function renderCartItems(){
  const keys=Object.keys(cart);
  if(!keys.length){document.getElementById('cartBox').innerHTML='<div style="text-align:center;color:rgba(9,50,87,.38);padding:18px">السلة فارغة</div>';return;}
  document.getElementById('cartBox').innerHTML=keys.map(k=>`
    <div class="c-row">
      <span class="c-name">${k}</span>
      <div class="c-ctrls">
        <button class="q-btn" style="width:25px;height:25px;font-size:.88rem"
          onclick="cartDelta('${esc(k)}',-1,${cart[k].price});renderCartItems()">−</button>
        <span style="font-weight:900;min-width:17px;text-align:center;font-size:.88rem">${cart[k].qty}</span>
        <button class="q-btn plus" style="width:25px;height:25px;font-size:.88rem"
          onclick="cartDelta('${esc(k)}',1,${cart[k].price});renderCartItems()">+</button>
      </div>
      <span class="c-price">${(cart[k].qty*cart[k].price).toLocaleString()}</span>
    </div>`).join('');
  let t=0;for(const k in cart) t+=cart[k].qty*cart[k].price;
  document.getElementById('cartTotalDisp').textContent=t.toLocaleString()+' د.ع';
}

function openProdModal(p){
  curProd=p;pmQtyVal=1;
  document.getElementById('pmImg').src=p.img;
  document.getElementById('pmName').textContent=p.name;
  document.getElementById('pmPrice').textContent=p.price.toLocaleString()+' د.ع';
  document.getElementById('pmDetail').textContent=p.detail||'منتج عالي الجودة';
  document.getElementById('pmQtyNum').textContent=1;
  const sc=p.stock===0?'b-red':p.stock<p.minStock?'b-gold':'b-green';
  const sl=p.stock===0?'🚫 نفاد':p.stock<p.minStock?`⚠️ متبقي ${p.stock}`:`✅ متوفر: ${p.stock}`;
  document.getElementById('pmStock').innerHTML=`<span class="badge ${sc}">${sl}</span>`;
  document.getElementById('pmAddBtn').style.display=p.stock>0?'flex':'none';
  document.getElementById('pmQtyRow').style.display=p.stock>0?'flex':'none';
  openModal('prodModal');
}
function pmChQty(d){pmQtyVal=Math.max(1,Math.min(pmQtyVal+d,curProd?.stock||99));document.getElementById('pmQtyNum').textContent=pmQtyVal;}
function addFromModal(){if(!curProd) return;cartDelta(curProd.name,pmQtyVal,curProd.price);closeModal('prodModal');toast(`✅ أضيف ${curProd.name} × ${pmQtyVal}`);}
