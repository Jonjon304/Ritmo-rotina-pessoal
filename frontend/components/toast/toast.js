let container = null;

function getContainer() {
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  return container;
}

const ICONS = {
  success: '\u2713',
  error: '\u2717',
  warning: '\u26A0',
};

function show(type, message, duration = 3500) {
  const c = getContainer();
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  toast.innerHTML = `
    <span class="toast-icon">${ICONS[type] || ''}</span>
    <span class="toast-message">${message}</span>
  `;

  c.appendChild(toast);

  const remove = () => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 200);
  };

  setTimeout(remove, duration);

  return { remove };
}

export const toast = {
  success: (msg, dur) => show('success', msg, dur),
  error: (msg, dur) => show('error', msg, dur),
  warning: (msg, dur) => show('warning', msg, dur),
};
