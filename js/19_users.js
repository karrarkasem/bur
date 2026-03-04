// ═══════════════════════════════════════════════════════
// USERS
// ═══════════════════════════════════════════════════════
function renderUsersList(){
  document.getElementById('usersList').innerHTML=users.map((u,i)=>`
    <div class="user-item">
      <div class="ui-av">${u.type==='admin'?'🛡️':u.type==='rep'?'🤝':u.type==='sales_manager'?'📊':'🏪'}</div>
      <div class="ui-info">
        <div class="ui-name">${u.name}</div>
        <div class="ui-meta"><span>${ROLES[u.type]||u.type}</span><span>@${u.username}</span>${u.phone?`<span>📞 ${u.phone}</span>`:''}<span>عمولة: ${u.commPct}%</span></div>
      </div>
      <div class="ui-bal">${parseFloat(u.balance||0).toLocaleString()} <span style="font-size:.6rem;color:rgba(9,50,87,.33)">د.ع</span></div>
      <div style="display:flex;gap:5px;flex-shrink:0">
        <button class="btn btn-ghost btn-sm" onclick="openEditUser(${i})">✏️</button>
        <button class="btn btn-sky btn-sm" onclick="openPayForUser('${u.username}')">💸</button>
      </div>
    </div>`).join('');
}

function openAddUser(){
  document.getElementById('userModalTitle').textContent='إضافة مستخدم جديد';
  document.getElementById('um_idx').value='';
  document.getElementById('um_fbid').value='';
  ['um_name','um_user','um_pass','um_phone','um_email'].forEach(id=>document.getElementById(id).value='');
  document.getElementById('um_type').value='rep';
  document.getElementById('um_comm').value='5';
  document.getElementById('um_bal').value='0';
  openModal('userModal');
}

function openEditUser(i){
  const u=users[i];
  document.getElementById('userModalTitle').textContent='تعديل المستخدم';
  document.getElementById('um_idx').value=i;
  document.getElementById('um_fbid').value=u._id||'';
  document.getElementById('um_name').value=u.name;
  document.getElementById('um_user').value=u.username;
  document.getElementById('um_pass').value=u.password;
  document.getElementById('um_type').value=u.type;
  document.getElementById('um_phone').value=u.phone||'';
  document.getElementById('um_email').value=u.email||'';
  document.getElementById('um_comm').value=u.commPct||0;
  document.getElementById('um_bal').value=u.balance||0;
  openModal('userModal');
}

async function saveUser(){
  const name=document.getElementById('um_name').value.trim();
  const username=document.getElementById('um_user').value.trim();
  const password=document.getElementById('um_pass').value.trim();
  const type=document.getElementById('um_type').value;
  const phone=document.getElementById('um_phone').value.trim();
  const email=document.getElementById('um_email').value.trim().toLowerCase();
  const commPct=parseFloat(document.getElementById('um_comm').value)||0;
  const balance=parseFloat(document.getElementById('um_bal').value)||0;
  const idx=document.getElementById('um_idx').value;
  const fbid=document.getElementById('um_fbid').value;
  if(!name||!username||!password){toast('الاسم واليوزر وكلمة المرور مطلوبة',false);return;}
  if(email&&users.find(u=>u.email===email&&u._id!==fbid)){toast('البريد الإلكتروني مستخدم مسبقاً',false);return;}
  const userData={name,username,password,accountType:type,phone,email,commPct,status:'active',balance,totalBuys:0};
  if(idx!==''){
    users[parseInt(idx)]={...users[parseInt(idx)],...userData,type,_id:fbid};
    if(fbid) await fbUpdate('users',fbid,userData).catch(()=>{});
    toast('✅ تم تحديث المستخدم');
  } else {
    if(users.find(u=>u.username.toLowerCase()===username.toLowerCase())){toast('اسم المستخدم مستخدم مسبقاً',false);return;}
    const newFbId=await fbAdd('users',{...userData,transactions:[]});
    users.push({...userData,type,_id:newFbId||'',transactions:[]});
    toast('✅ تم إضافة المستخدم');
  }
  closeModal('userModal');renderUsersList();
}
