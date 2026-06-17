export function createModuleHeader({ icon, title, accent, actions = [] }) {
  const header = document.createElement('header');
  header.className = 'module-header';
  header.style.setProperty('--accent', accent);

  const left = document.createElement('div');
  left.className = 'module-header-left';
  left.innerHTML = `
    <span class="module-header-icon" style="color: ${accent}">${icon}</span>
    <h2 class="module-header-title">${title}</h2>
  `;

  header.appendChild(left);

  if (actions.length) {
    const actionsEl = document.createElement('div');
    actionsEl.className = 'section-actions';
    actions.forEach(action => actionsEl.appendChild(action));
    header.appendChild(actionsEl);
  }

  return header;
}
