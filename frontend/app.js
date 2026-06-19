import { get, post } from './utils/api.js';
import { getGreeting, getModuleAccent } from './utils/helpers.js';
import { formatarDataCompleta } from './utils/formatDate.js';
import { toast } from './components/toast/toast.js';
import { initSidebar } from './components/sidebar/sidebar.js';
import { applyTheme, getStoredTheme } from './utils/theme.js';
import { FinancasModule } from './modules/financas/financas.js';
import { TarefasModule } from './modules/tarefas/tarefas.js';
import { MetasModule } from './modules/metas/metas.js';
import { CronogramaModule } from './modules/cronograma/cronograma.js';
import { NotasModule } from './modules/notas/notas.js';
import { HabitosModule } from './modules/habitos/habitos.js';
import { ProjetosModule } from './modules/projetos/projetos.js';
import { ConfiguracoesModule } from './modules/configuracoes/configuracoes.js';

const hub = document.getElementById('hub');
const loginPage = document.getElementById('login-page');
const moduleContent = document.getElementById('module-content');
const modulePage = document.getElementById('module-page');
const hubCards = document.getElementById('hub-cards');
const greetingText = document.getElementById('greeting-text');
const greetingDate = document.getElementById('greeting-date');
const tabBar = document.getElementById('tab-bar');
const mobileOverlay = document.getElementById('mobile-overlay');

let currentModule = null;
let isTransitioning = false;
let transitionTimeout = null;
let isAuthenticated = false;
let sidebarControl = null;

const modules = {
  financas: new FinancasModule(),
  tarefas: new TarefasModule(),
  metas: new MetasModule(),
  cronograma: new CronogramaModule(),
  notas: new NotasModule(),
  habitos: new HabitosModule(),
  projetos: new ProjetosModule(),
  configuracoes: new ConfiguracoesModule(),
};

function clearTransition() {
  isTransitioning = false;
  if (transitionTimeout) {
    clearTimeout(transitionTimeout);
    transitionTimeout = null;
  }
}

function scheduleTransition(fn, ms) {
  transitionTimeout = setTimeout(fn, ms);
  return transitionTimeout;
}

function updateGreeting() {
  const g = getGreeting();
  greetingText.innerHTML = `${g.text} <span class="greeting-emoji">${g.emoji}</span>`;
  greetingDate.textContent = formatarDataCompleta(new Date());
}

async function loadHubData() {
  try {
    const data = await get('/hub/dashboard');
    renderHubCards(data);
  } catch (err) {
    renderHubCards({});
  }
}

function renderHubCards(data) {
  hubCards.innerHTML = '';

  const resumo = data.resumo || {};
  const tarefas = data.tarefas || [];
  const metas = data.metas || [];
  const eventosHoje = data.eventos_hoje || [];
  const eventosProximos = data.eventos_proximos || [];
  const habitosHoje = data.habitos_hoje || [];
  const notasRecentes = data.notas_recentes || [];
  const projetosAtivos = data.projetos_ativos || [];

  const tarefasPendentes = resumo.tarefas_pendentes || 0;
  const tarefasVencendoHoje = resumo.tarefas_vencendo_hoje || 0;
  const receitasMes = resumo.receitas_mes || 0;
  const despesasMes = resumo.despesas_mes || 0;
  const saldoMes = resumo.saldo_mes || 0;

  const metasAtivas = metas.filter(m => m.valor_atual < m.valor_alvo).length;
  const habitosFeitos = habitosHoje.filter(h => h.feito).length;
  const habitosTotal = habitosHoje.length;

  const proxEvento = eventosProximos[0] || eventosHoje[0] || null;
  const proxEventoHora = proxEvento?.horario_inicio || '—';
  const proxEventoNome = proxEvento?.nome || '—';

  const cards = [
    {
      module: 'financas', icon: '\uD83D\uDCB0', title: 'Finanças',
      value: `R$ ${saldoMes.toLocaleString('pt-BR')}`,
      detail: `+${receitasMes.toLocaleString('pt-BR')} / -${despesasMes.toLocaleString('pt-BR')} este mês`,
    },
    {
      module: 'tarefas', icon: '\uD83D\uDCCB', title: 'Tarefas',
      value: `${tarefasPendentes} pendentes`,
      detail: `${tarefasVencendoHoje} vencendo hoje`,
    },
    {
      module: 'metas', icon: '\uD83C\uDFAF', title: 'Metas',
      value: `${metasAtivas} ativas`,
      detail: `${metas.length} no total`,
    },
    {
      module: 'cronograma', icon: '\uD83D\uDCC5', title: 'Cronograma',
      value: proxEvento ? `Próx: ${proxEventoHora}` : '—',
      detail: proxEvento ? proxEventoNome : 'Nenhum evento',
    },
    {
      module: 'notas', icon: '\uD83D\uDCDD', title: 'Notas',
      value: `${notasRecentes.length} recentes`,
      detail: notasRecentes[0] ? notasRecentes[0].titulo : 'Nenhuma nota',
    },
    {
      module: 'habitos', icon: '\uD83D\uDD04', title: 'Hábitos',
      value: `${habitosFeitos}/${habitosTotal} hoje`,
      detail: habitosTotal > 0 ? `${Math.round((habitosFeitos / habitosTotal) * 100)}% concluído` : 'Nenhum hábito',
    },
  ];

  cards.forEach(c => {
    const colors = getModuleAccent(c.module);
    const btn = document.createElement('button');
    btn.className = 'hub-card';
    btn.dataset.module = c.module;
    btn.style.setProperty('--accent', colors.accent);
    btn.style.setProperty('--accent-bright', colors.bright);
    btn.innerHTML = `
      <span class="hub-card-icon">${c.icon}</span>
      <span class="hub-card-title">${c.title}</span>
      <span class="hub-card-value">${c.value}</span>
      <span class="hub-card-detail">${c.detail}</span>
    `;
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      showModule(c.module);
    });
    hubCards.appendChild(btn);
  });
}

function resetHub() {
  hub.classList.remove('exiting', 'hidden', 'entering', 'greeting-state');
}

function showModule(name) {
  if (!name || !modules[name]) return;
  if (currentModule === name) return;
  if (isTransitioning) {
    clearTransition();
    resetHub();
    moduleContent.classList.remove('visible');
    document.getElementById('sidebar').classList.remove('visible');
    deactivateAllModules();
    currentModule = null;
  }
  isTransitioning = true;

  if (currentModule === null) {
    hubToModule(name);
  } else {
    switchModule(name);
  }
}

function hubToModule(name) {
  hub.classList.add('exiting');

  scheduleTransition(() => {
    hub.classList.remove('exiting');
    hub.classList.add('hidden');

    document.getElementById('sidebar').classList.add('visible');
    activateModule(name);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        moduleContent.classList.add('visible');
        isTransitioning = false;
        transitionTimeout = null;
      });
    });
  }, 280);
}

function moduleToHub() {
  if (isTransitioning) {
    clearTransition();
    moduleContent.classList.remove('visible');
    document.getElementById('sidebar').classList.remove('visible');
    deactivateAllModules();
    currentModule = null;
  }
  isTransitioning = true;

  moduleContent.classList.remove('visible');

  scheduleTransition(() => {
    document.getElementById('sidebar').classList.remove('visible');
    deactivateAllModules();
    currentModule = null;

    scheduleTransition(() => {
      hub.classList.remove('hidden');
      hub.classList.add('entering');

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          hub.classList.remove('entering');
          hub.classList.add('greeting-state');

          scheduleTransition(() => {
            hub.classList.remove('greeting-state');
            isTransitioning = false;
            transitionTimeout = null;
          }, 400);
        });
      });
    }, 150);
  }, 300);
}

function switchModule(name) {
  if (currentModule === name) return;
  deactivateAllModules();
  activateModule(name);
  isTransitioning = false;
  transitionTimeout = null;
}

function activateModule(name) {
  currentModule = name;

  if (sidebarControl) sidebarControl.setActive(name);

  const tabBtns = tabBar.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    if (btn.dataset.tab === name) btn.classList.add('active');
    else if (btn.dataset.tab !== 'more') btn.classList.remove('active');
  });

  const mod = modules[name];
  if (mod && mod.render) {
    modulePage.innerHTML = '';
    modulePage.dataset.module = name;
    mod.render(modulePage);
    modulePage.classList.add('active');
  }
}

function deactivateAllModules() {
  modulePage.classList.remove('active');
  modulePage.innerHTML = '';

  const sidebarBtns = document.querySelectorAll('.sidebar-modules .sidebar-btn');
  sidebarBtns.forEach(btn => btn.classList.remove('active'));
}

function goHome() {
  if (currentModule === null) return;

  const tabBtns = tabBar.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => btn.classList.remove('active'));
  const homeTab = tabBar.querySelector('.tab-btn[data-tab="home"]');
  if (homeTab) homeTab.classList.add('active');

  moduleToHub();
  loadHubData();
}

function showLogin() {
  loginPage.style.display = 'flex';
  hub.classList.add('hidden');
  loginPage.classList.add('visible');
}

function hideLogin() {
  loginPage.style.display = 'none';
  loginPage.classList.remove('visible');
}

async function checkAuth() {
  try {
    await get('/auth/me');
    isAuthenticated = true;
    hideLogin();
    hub.classList.remove('hidden');
    updateGreeting();
    loadHubData();
    get('/auth/configuracoes').then(config => {
      if (config?.tema) applyTheme(config.tema);
    }).catch(() => {});
  } catch (err) {
    isAuthenticated = false;
    showLogin();
  }
}

async function handleLogin(email, senha) {
  try {
    await post('/auth/login', { email, senha });
    isAuthenticated = true;
    hideLogin();
    hub.classList.remove('hidden');
    updateGreeting();
    loadHubData();
    toast.success('Bem-vindo de volta!');
  } catch (err) {
    toast.error(err.message || 'Erro ao fazer login');
  }
}

function init() {
  const loginForm = document.getElementById('login-form');
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const senha = document.getElementById('login-senha').value;
    handleLogin(email, senha);
  });

  sidebarControl = initSidebar({
    onNavigate: (mod) => showModule(mod),
    onHome: () => goHome(),
    onSettings: () => showModule('configuracoes'),
  });

  tabBar.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      if (tab === 'home') {
        goHome();
      } else if (tab === 'more') {
        const moreMods = ['cronograma', 'notas', 'habitos', 'projetos'];
        const next = moreMods.find(m => m !== currentModule) || moreMods[0];
        showModule(next);
      } else {
        showModule(tab);
      }
    });
  });

  mobileOverlay.addEventListener('click', () => {
    document.getElementById('sidebar').classList.remove('mobile-open');
    mobileOverlay.classList.remove('visible');
  });

  window.addEventListener('auth:logout', () => {
    isAuthenticated = false;
    showLogin();
  });

  checkAuth();
  applyTheme(getStoredTheme());
}

init();
