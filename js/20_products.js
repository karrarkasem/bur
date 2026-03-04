// ═══════════════════════════════════════════════════════
// MANAGE PRODUCTS
// ═══════════════════════════════════════════════════════
function renderManageProds(){
  document.getElementById('manageProdsBody').innerHTML=products.map((p,i)=>`
    <tr>
      <td><img src="${p.img}" style="width:40px;height:40px;object-fit:cover;border-radius:var(--r8);border:1px solid rgba(14,165,233,.1)" onerror="this.src='https://via.placeholder.com/40?text=📦'"></td>
      <td style="font-weight:700;color:var(--deep)">${p.name}</td>
      <td><span class="badge b-sky">${p.cat}</span></td>
      <td style="font-weight:800;color:var(--mint2)">${p.price.toLocaleString()} د.ع</td>
      <td><span class="${p.stock===0?'badge b-red':p.stock<p.minStock?'badge b-gold':'badge b-green'}">${p.stock===999?'∞':p.stock}</span>
        <button class="btn btn-ghost btn-sm" style="margin-right:4px" onclick="openStockEdit(${p.idx})">📦</button></td>
      <td><span class="badge ${p.status==='active'?'b-green':'b-red'}">${p.status==='active'?'🟢 متوفر':'🔴 متوقف'}</span></td>
      <td><button class="btn btn-ghost btn-sm" onclick="openEditProd(${i})">✏️</button></td>
    </tr>`).join('');
}

function openAddProd(){
  document.getElementById('peTitle').textContent='➕ إضافة منتج';
  document.getElementById('pe_idx').value='';document.getElementById('pe_fbid').value='';
  ['pe_name','pe_cat','pe_price','pe_img','pe_det'].forEach(id=>document.getElementById(id).value='');
  document.getElementById('pe_stock').value='0';
  document.getElementById('pe_min').value='10';
  document.getElementById('pe_status').value='active';
  document.getElementById('pePreview').src='https://via.placeholder.com/100?text=📦';
  document.getElementById('peFile').value='';
  document.getElementById('peFileLabel').textContent='أو ارفع صورة هنا (سيتم رفعها على Firebase)';
  document.getElementById('uploadProgress').style.display='none';
  _uploadedImgUrl = '';
  openModal('prodEditModal');
}

function openEditProd(i){
  const p=products[i];
  document.getElementById('peTitle').textContent='✏️ تعديل منتج';
  document.getElementById('pe_idx').value=i;
  document.getElementById('pe_fbid').value=p._id||'';
  document.getElementById('pe_name').value=p.name;
  document.getElementById('pe_cat').value=p.cat;
  document.getElementById('pe_price').value=p.price;
  document.getElementById('pe_img').value=p.img;
  document.getElementById('pe_stock').value=p.stock||0;
  document.getElementById('pe_min').value=p.minStock||10;
  document.getElementById('pe_det').value=p.detail;
  document.getElementById('pe_status').value=p.status;
  document.getElementById('pePreview').src=p.img;
  document.getElementById('peFile').value='';
  document.getElementById('uploadProgress').style.display='none';
  _uploadedImgUrl = p.img;
  openModal('prodEditModal');
}

function peImgPreview(){
  const u=document.getElementById('pe_img').value.trim();
  if(u){ document.getElementById('pePreview').src=fixDrive(u); _uploadedImgUrl=fixDrive(u); }
}

async function peFileChosen(e){
  const file=e.target.files[0];
  if(!file) return;
  const rd=new FileReader();
  rd.onload=ev=>{ document.getElementById('pePreview').src=ev.target.result; };
  rd.readAsDataURL(file);
  const prog = document.getElementById('uploadProgress');
  const fill  = document.getElementById('uploadFill');
  const txt   = document.getElementById('uploadTxt');
  prog.style.display='block';
  txt.textContent='جاري الرفع...';
  fill.style.width='10%';
  try {
    const storage = window._storage;
    const { ref, uploadBytes, getDownloadURL } = window._fb;
    const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
    fill.style.width='40%';
    const snapshot = await uploadBytes(storageRef, file);
    fill.style.width='80%';
    const url = await getDownloadURL(snapshot.ref);
    fill.style.width='100%';
    txt.textContent='✅ تم الرفع بنجاح';
    _uploadedImgUrl = url;
    document.getElementById('pe_img').value = url;
    document.getElementById('pePreview').src = url;
    document.getElementById('peFileLabel').textContent='✅ تم رفع الصورة';
    setTimeout(()=>prog.style.display='none', 2000);
  } catch(err) {
    console.error('Upload error:', err);
    txt.textContent='⚠️ يتطلب Firebase Storage — استخدم رابط URL';
    fill.style.background='var(--rose)';
    fill.style.width='100%';
    setTimeout(()=>{prog.style.display='none';fill.style.background='';fill.style.width='0%';},3000);
  }
}

async function saveProd(){
  const name=document.getElementById('pe_name').value.trim();
  const cat=document.getElementById('pe_cat').value.trim();
  const price=parseFloat(document.getElementById('pe_price').value)||0;
  const imgRaw=document.getElementById('pe_img').value.trim();
  const stock=parseInt(document.getElementById('pe_stock').value)||0;
  const minStock=parseInt(document.getElementById('pe_min').value)||10;
  const detail=document.getElementById('pe_det').value.trim();
  const status=document.getElementById('pe_status').value;
  const idx=document.getElementById('pe_idx').value;
  const fbid=document.getElementById('pe_fbid').value;
  if(!name||!cat||!price){toast('الاسم والتصنيف والسعر مطلوبة',false);return;}
  const img = _uploadedImgUrl || (imgRaw ? fixDrive(imgRaw) : 'https://via.placeholder.com/200?text=📦');
  const prodData={name,category:cat,price,image:img,detail,status,stock,minStock};
  if(idx!==''){
    products[parseInt(idx)]={...products[parseInt(idx)],...{name,cat,price,img,detail,status,stock,minStock}};
    if(fbid) await fbUpdate('products',fbid,prodData).catch(()=>{});
    toast('✅ تم تعديل المنتج');
  } else {
    const newFbId=await fbAdd('products',prodData);
    products.push({idx:products.length,_id:newFbId||'',name,cat,price,img,detail,status,stock,minStock});
    toast('✅ تم إضافة المنتج');
  }
  _uploadedImgUrl = '';
  closeModal('prodEditModal');
  renderManageProds();renderStore('الكل');renderCats();renderInventory();
}
