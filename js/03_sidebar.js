// ═══════════════════════════════════════════════════════
// SIDEBAR - الإصلاح الكامل
// ═══════════════════════════════════════════════════════
function toggleSidebar() {
  const sb = document.getElementById('sidebar');
  const ov = document.getElementById('sidebarOverlay');
  const isOpen = sb.classList.contains('open');
  if (isOpen) {
    closeSidebar();
  } else {
    sb.classList.add('open');
    ov.classList.add('show');
    // منع scroll الخلفية عند فتح القائمة
    document.body.style.overflow = 'hidden';
  }
}

function closeSidebar() {
  const sb = document.getElementById('sidebar');
  const ov = document.getElementById('sidebarOverlay');
  sb.classList.remove('open');
  ov.classList.remove('show');
  document.body.style.overflow = '';
}

// إغلاق عند الضغط على الـ overlay
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('sidebarOverlay').addEventListener('click', closeSidebar);
});
