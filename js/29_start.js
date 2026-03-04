// ═══════════════════════════════════════════════════════
// START
// ═══════════════════════════════════════════════════════
init().catch(err=>{
  console.error('Init error:',err);
  setFbStatus(false,'خطأ في الاتصال');
  setTimeout(()=>{
    const ls=document.getElementById('loadScreen');
    ls.style.opacity='0';setTimeout(()=>ls.style.display='none',400);
  },1000);
  buildUI();
});
