export function initSidebar({ onNavigate, onHome, onSettings }) {
  const sidebar = document.getElementById('sidebar');
  const btnHome = document.getElementById('btn-home');
  const btnSettings = document.getElementById('btn-settings');
  const sidebarBtns = sidebar.querySelectorAll('.sidebar-modules .sidebar-btn');

  function setActive(module) {
    sidebarBtns.forEach(btn => {
      if (btn.dataset.module === module) btn.classList.add('active');
      else btn.classList.remove('active');
    });
  }

  sidebarBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (onNavigate) onNavigate(btn.dataset.module);
    });
  });

  if (btnHome) {
    btnHome.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (onHome) onHome();
    });
  }

  if (btnSettings) {
    btnSettings.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (onSettings) onSettings();
    });
  }

  return { setActive };
}
