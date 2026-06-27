import { get, post } from './utils/api.js';
import { getGreeting, getModuleAccent } from './utils/helpers.js';
import { formatarDataCompleta, formatarMesAno } from './utils/formatDate.js';
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
const mobileMenu = document.getElementById('mobile-menu');

let currentModule = null;
let isTransitioning = false;
let transitionTimeout = null;
let isAuthenticated = false;
let sidebarControl = null;
let mobileMenuOpen = false;

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

  const financas = data.financas || {};
  const tarefas = data.tarefas || {};
  const metasData = data.metas || {};
  const cronogramaData = data.cronograma || {};
  const notasData = data.notas || {};
  const habitosData = data.habitos || {};

  const tarefasPendentes = tarefas.pendentes || 0;
  const tarefasVencendoHoje = tarefas.hoje || 0;
  const receitasMes = financas.receitas_mes || 0;
  const despesasMes = financas.despesas_mes || 0;
  const saldoMes = financas.saldo ?? 0;
  const financasMesLabel = financas.mes ? formatarMesAno(new Date(financas.mes + '-01')) : 'este mês';

  const metasAtivas = metasData.ativas || 0;
  const metasTotal = (metasData.ativas || 0) + (metasData.proximas || 0);

  const habitosFeitos = habitosData.hoje || 0;
  const habitosTotal = habitosData.total || 0;

  const proxEventoHora = cronogramaData.proximo_hora;
  const proxEventoNome = cronogramaData.proximo_titulo;
  const temProxEvento = !!(proxEventoHora || proxEventoNome);

  const notasRecentes = notasData.recentes || [];
  const notasCount = notasData.recentes_count || notasRecentes.length;

  const cards = [
    {
      module: 'financas', icon: '\uD83D\uDCB0', title: 'Finanças',
      value: `R$ ${saldoMes.toLocaleString('pt-BR')}`,
      detail: `+${receitasMes.toLocaleString('pt-BR')} / -${despesasMes.toLocaleString('pt-BR')} ${financasMesLabel}`,
    },
    {
      module: 'tarefas', icon: '\uD83D\uDCCB', title: 'Tarefas',
      value: `${tarefasPendentes} pendentes`,
      detail: `${tarefasVencendoHoje} vencendo hoje`,
    },
    {
      module: 'metas', icon: '\uD83C\uDFAF', title: 'Metas',
      value: `${metasAtivas} ativas`,
      detail: `${metasTotal} no total`,
    },
    {
      module: 'cronograma', icon: '\uD83D\uDCC5', title: 'Cronograma',
      value: temProxEvento ? `Próx: ${proxEventoHora || '—'}` : '—',
      detail: temProxEvento ? proxEventoNome : 'Nenhum evento',
    },
    {
      module: 'notas', icon: '\uD83D\uDCDD', title: 'Notas',
      value: `${notasCount} recentes`,
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

    const sidebar = document.getElementById('sidebar');
    if (window.innerWidth > 768) {
      sidebar.classList.add('visible');
    }
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
    document.getElementById('sidebar').classList.remove('mobile-open');
    deactivateAllModules();
    currentModule = null;
  }
  isTransitioning = true;
  closeMobileMenu();

  moduleContent.classList.remove('visible');

  scheduleTransition(() => {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.remove('visible');
    sidebar.classList.remove('mobile-open');
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

  updateTabBarHighlight(name);

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

  closeMobileMenu();
  moduleToHub();
  loadHubData();
}

function toggleMobileMenu() {
  mobileMenuOpen = !mobileMenuOpen;
  if (mobileMenuOpen) {
    mobileMenu.classList.add('visible');
    mobileOverlay.classList.add('visible');
  } else {
    closeMobileMenu();
  }
}

function closeMobileMenu() {
  mobileMenuOpen = false;
  mobileMenu.classList.remove('visible');
  mobileOverlay.classList.remove('visible');
}

function updateTabBarHighlight(name) {
  const tabBtns = tabBar.querySelectorAll('.tab-btn');
  const directTabs = ['home', 'financas', 'tarefas', 'metas'];
  tabBtns.forEach(btn => {
    if (btn.dataset.tab === name && directTabs.includes(name)) {
      btn.classList.add('active');
    } else if (btn.dataset.tab === 'more' && !directTabs.includes(name)) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
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
        closeMobileMenu();
        goHome();
      } else if (tab === 'more') {
        toggleMobileMenu();
      } else {
        closeMobileMenu();
        showModule(tab);
      }
    });
  });

  mobileMenu.querySelectorAll('.mobile-menu-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const mod = btn.dataset.module;
      closeMobileMenu();
      if (mod === 'configuracoes') {
        showModule('configuracoes');
      } else {
        showModule(mod);
      }
    });
  });

  mobileOverlay.addEventListener('click', () => {
    document.getElementById('sidebar').classList.remove('mobile-open');
    mobileOverlay.classList.remove('visible');
    closeMobileMenu();
  });

  window.addEventListener('auth:logout', () => {
    isAuthenticated = false;
    showLogin();
  });

  checkAuth();
  applyTheme(getStoredTheme());
}

init();
