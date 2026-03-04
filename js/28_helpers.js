// ═══════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════
function openModal(id){document.getElementById(id).classList.add('open');}
function closeModal(id){document.getElementById(id).classList.remove('open');}

// إغلاق المودال عند الضغط خارجه
document.addEventListener('click',e=>{
  if(e.target.classList.contains('modal')) e.target.classList.remove('open');
});

function toast(msg,ok=true){
  const d=document.createElement('div');
  d.className='toast '+(ok===false?'err':ok==='info'?'info':'ok');
  d.textContent=msg;
  document.getElementById('toastWrap').appendChild(d);
  setTimeout(()=>d.remove(),3500);
}

function filterMyOrders(){
  if(!CU) return [];
  if(CU.type==='rep') return orders.filter(o=>o.repUser===CU.username);
  if(CU.type==='market_owner') return orders.filter(o=>o.shopName===CU.name);
  return orders;
}

function arToEn(s){return s.replace(/[٠١٢٣٤٥٦٧٨٩]/g,c=>String('٠١٢٣٤٥٦٧٨٩'.indexOf(c)));}
function isSameDay(dateStr,d){
  if(!dateStr||dateStr==='—') return false;
  try{
    const parts=arToEn(dateStr).split('/');
    if(parts.length===3){
      const od=new Date(parseInt(parts[2]),parseInt(parts[1])-1,parseInt(parts[0]));
      return od.getFullYear()===d.getFullYear()&&od.getMonth()===d.getMonth()&&od.getDate()===d.getDate();
    }
    const od=new Date(dateStr);
    return od.getFullYear()===d.getFullYear()&&od.getMonth()===d.getMonth()&&od.getDate()===d.getDate();
  } catch{return false;}
}

function isThisMonth(dateStr){
  if(!dateStr||dateStr==='—') return false;
  try{
    const parts=arToEn(dateStr).split('/');
    if(parts.length===3){
      const n=new Date();
      return parseInt(parts[2])===n.getFullYear()&&parseInt(parts[1])-1===n.getMonth();
    }
    const d=new Date(dateStr),n=new Date();
    return d.getFullYear()===n.getFullYear()&&d.getMonth()===n.getMonth();
  } catch{return false;}
}

function fixDrive(u){
  if(!u) return 'https://via.placeholder.com/200?text=📦';
  if(u.includes('drive.google.com')){const m=u.match(/[-\w]{25,}/);if(m) return `https://drive.google.com/uc?export=view&id=${m[0]}`;}
  return u;
}

function esc(s){return(s||'').replace(/\\/g,'\\\\').replace(/'/g,"\\'").replace(/"/g,'\\"');}
function escj(obj){
  try{return JSON.stringify(obj).replace(/'/g,"\\'").replace(/</g,'&lt;');}
  catch{return '{}';}
}
function safeName(s){return(s||'').replace(/[^\w\u0621-\u064A]/g,'_');}
