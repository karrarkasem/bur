// ═══════════════════════════════════════════════════════
// NOTIFICATIONS
// ═══════════════════════════════════════════════════════
function renderNotifBadge(){
  const unread=notifications.filter(n=>!n.read&&(n.target==='all'||n.target===CU?.username||n.target===CU?.type)).length;
  document.querySelectorAll('#sbNav .nav-badge').forEach(b=>b.textContent=unread);
}

function renderNotifications(){
  const myNotifs=notifications.filter(n=>n.target==='all'||n.target===CU?.username||n.target===CU?.type);
  document.getElementById('notifList').innerHTML=myNotifs.length?[...myNotifs].reverse().map(n=>`
    <div class="notif-item ${n.read?'read':'unread'}" onclick="markRead('${n._id}')">
      <div class="notif-ico notif-ico-${n.type==='order'?'order':n.type==='warn'?'warn':'info'}">${n.type==='order'?'📦':n.type==='warn'?'⚠️':'ℹ️'}</div>
      <div style="flex:1">
        <div class="notif-title">${n.title}</div>
        <div class="notif-body">${n.body}</div>
        <div class="notif-time">${n.date}</div>
      </div>
      ${!n.read?'<div style="width:8px;height:8px;border-radius:50%;background:var(--sky);flex-shrink:0;margin-top:4px"></div>':''}
    </div>`).join('')
  :'<div style="text-align:center;padding:55px;color:rgba(9,50,87,.35)">لا توجد إشعارات</div>';
}

async function markRead(id){
  const n=notifications.find(x=>x._id===id);
  if(n&&!n.read){
    n.read=true;
    if(id) await fbUpdate('notifications',id,{read:true}).catch(()=>{});
    renderNotifications();renderNotifBadge();
  }
}

async function markAllRead(){
  for(const n of notifications){
    if(!n.read&&(n.target==='all'||n.target===CU?.username)){
      n.read=true;
      if(n._id) await fbUpdate('notifications',n._id,{read:true}).catch(()=>{});
    }
  }
  renderNotifications();renderNotifBadge();buildSidebar();
  toast('✅ تم تحديد الكل كمقروء');
}
