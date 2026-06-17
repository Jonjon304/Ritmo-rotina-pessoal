export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

export function qsa(selector, parent = document) {
  return [...parent.querySelectorAll(selector)];
}

export function createElement(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);
  for (const [key, val] of Object.entries(attrs)) {
    if (key === 'class') el.className = val;
    else if (key === 'style' && typeof val === 'object') Object.assign(el.style, val);
    else if (key.startsWith('on')) el.addEventListener(key.slice(2).toLowerCase(), val);
    else if (key === 'data') Object.entries(val).forEach(([k, v]) => el.dataset[k] = v);
    else el.setAttribute(key, val);
  }
  children.forEach(child => {
    if (typeof child === 'string') el.appendChild(document.createTextNode(child));
    else if (child) el.appendChild(child);
  });
  return el;
}

export function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

export function getModuleAccent(modulo) {
  const accents = {
    financas: { accent: '#8b5cf6', bright: '#a78bfa', icon: '\uD83D\uDCB0', label: 'Finanças' },
    tarefas: { accent: '#3b82f6', bright: '#60a5fa', icon: '\uD83D\uDCCB', label: 'Tarefas' },
    metas: { accent: '#f59e0b', bright: '#fbbf24', icon: '\uD83C\uDFAF', label: 'Metas' },
    cronograma: { accent: '#10b981', bright: '#34d399', icon: '\uD83D\uDCC5', label: 'Cronograma' },
    notas: { accent: '#ec4899', bright: '#f472b6', icon: '\uD83D\uDCDD', label: 'Notas' },
    habitos: { accent: '#06b6d4', bright: '#22d3ee', icon: '\uD83D\uDD04', label: 'Hábitos' },
    projetos: { accent: '#f97316', bright: '#fb923c', icon: '\uD83D\uDEE0\uFE0F', label: 'Projetos' },
    configuracoes: { accent: '#737373', bright: '#a3a3a3', icon: '\u2699\uFE0F', label: 'Configurações' },
  };
  return accents[modulo] || { accent: '#737373', bright: '#a3a3a3', icon: '\u2753', label: modulo };
}

export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return { text: 'Bom dia, Jon.', emoji: '\uD83C\uDF05' };
  if (hour < 18) return { text: 'Boa tarde, Jon.', emoji: '\uD83C\uDF19' };
  return { text: 'Boa noite, Jon.', emoji: '\uD83C\uDF19' };
}
