export function createHubCard({ module, icon, title, value, detail }) {
  const accents = {
    financas: { accent: '#8b5cf6', bright: '#a78bfa' },
    tarefas: { accent: '#3b82f6', bright: '#60a5fa' },
    metas: { accent: '#f59e0b', bright: '#fbbf24' },
    cronograma: { accent: '#10b981', bright: '#34d399' },
    notas: { accent: '#ec4899', bright: '#f472b6' },
    habitos: { accent: '#06b6d4', bright: '#22d3ee' },
    projetos: { accent: '#f97316', bright: '#fb923c' },
  };

  const colors = accents[module] || { accent: '#737373', bright: '#a3a3a3' };

  const card = document.createElement('button');
  card.className = 'hub-card-component';
  card.dataset.module = module;
  card.style.setProperty('--accent', colors.accent);
  card.style.setProperty('--accent-bright', colors.bright);

  card.innerHTML = `
    <span class="hub-card-icon">${icon}</span>
    <span class="hub-card-title">${title}</span>
    <span class="hub-card-value">${value}</span>
    <span class="hub-card-detail">${detail}</span>
  `;

  return card;
}
