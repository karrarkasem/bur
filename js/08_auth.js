// ═══════════════════════════════════════════════════════
// LOGIN / LOGOUT
// ═══════════════════════════════════════════════════════
function switchLoginTab(tab){
  ['user','email'].forEach(t=>{
    document.getElementById('ltab_'+t).classList.toggle('on',t===tab);
    document.getElementById('ltab_pane_'+t).classList.toggle('on',t===tab);
  });
  setTimeout(()=>{
    const f=tab==='email'?document.getElementById('lEmail'):document.getElementById('lUser');
    if(f) f.focus();
  },80);
}

function showLogin(){
  document.getElementById('loginOverlay').style.display='flex';
  setTimeout(()=>document.getElementById('lUser').focus(),100);
}
function hideLogin(){document.getElementById('loginOverlay').style.display='none';}

async function doLogin() {
  document.getElementById('loginErr').textContent='';
  const isEmail = document.getElementById('ltab_email').classList.contains('on');
  let found;
  if(isEmail){
    const em=document.getElementById('lEmail').value.trim().toLowerCase();
    const pw=document.getElementById('lPassEmail').value.trim();
    if(!em||!pw){document.getElementById('loginErr').textContent='❌ أكمل الحقول';return;}
    if(fbReady) await loadUsers();
    found=users.find(u=>u.email&&u.email.toLowerCase()===em&&u.password===pw);
  } else {
    const un=document.getElementById('lUser').value.trim();
    const pw=document.getElementById('lPass').value.trim();
    if(!un||!pw){document.getElementById('loginErr').textContent='❌ أكمل الحقول';return;}
    if(fbReady) await loadUsers();
    found=users.find(u=>u.username.toLowerCase()===un.toLowerCase()&&u.password===pw);
  }
  if(!found){document.getElementById('loginErr').textContent='❌ بيانات دخول خاطئة';return;}
  CU={...found};
  if(document.getElementById('remMe').checked) localStorage.setItem('bjUser',JSON.stringify({username:CU.username}));
  if(found._id) fbUpdate('users',found._id,{lastLogin:new Date().toLocaleDateString('ar-IQ')}).catch(()=>{});
  hideLogin(); buildUI();
  // المندوب يروح على واجهته المخصصة مباشرة
  if(CU.type==='rep') showPage('pageRepHome');
  else showPage('pageDashboard');
  toast('✅ مرحباً '+CU.name);
}

function doLogout(){
  localStorage.removeItem('bjUser');CU=null;cart={};updateCartUI();buildUI();showPage('pageStore');toast('👋 تم تسجيل الخروج');
}
