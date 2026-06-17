import { get, put, post } from '../../utils/api.js';
import { showModal } from '../../components/modal/modal.js';
import { toast } from '../../components/toast/toast.js';
import { confirm } from '../../components/confirm/confirm.js';
import { applyTheme, getStoredTheme } from '../../utils/theme.js';

export class ConfiguracoesModule {
  constructor() {
    this.user = null;
    this.config = {};
  }

  async render(container) {
    container.innerHTML = '';

    const header = document.createElement('header');
    header.className = 'module-header';
    header.innerHTML = `
      <div class="module-header-left">
        <span class="module-header-icon" style="color: #737373;">\u2699\uFE0F</span>
        <h2 class="module-header-title">Configurações</h2>
      </div>
    `;
    container.appendChild(header);

    const body = document.createElement('div');
    body.className = 'module-body config-sections';
    body.id = 'config-body';
    container.appendChild(body);

    await this.loadData();
    this.renderSections(body);
  }

  async loadData() {
    try {
      const [user, config] = await Promise.all([
        get('/auth/me').catch(() => ({})),
        get('/auth/configuracoes').catch(() => ({})),
      ]);
      this.user = user.usuario || user || {};
      this.config = config.configuracoes || config || {};
    } catch {}
  }

  renderSections(body) {
    body.innerHTML = '';

    const perfil = document.createElement('div');
    perfil.className = 'config-section';
    perfil.innerHTML = `
      <h3 class="config-section-title">\uD83D\uDC64 Perfil</h3>
      <div class="config-row">
        <div>
          <div class="config-row-label">Email</div>
          <div class="config-row-desc">${this.user.email || '—'}</div>
        </div>
      </div>
      <div class="config-row">
        <div><div class="config-row-label">Alterar senha</div></div>
        <div class="config-row-value">
          <button class="btn-ghost" id="cfg-senha">Alterar</button>
        </div>
      </div>
    `;
    body.appendChild(perfil);

    perfil.querySelector('#cfg-senha').addEventListener('click', () => this.openSenhaModal());

    const isDark = getStoredTheme() !== 'light';
    const aparencia = document.createElement('div');
    aparencia.className = 'config-section';
    aparencia.innerHTML = `
      <h3 class="config-section-title">\uD83C\uDFA8 Aparência</h3>
      <div class="config-row">
        <div>
          <div class="config-row-label">Tema escuro</div>
          <div class="config-row-desc">Ativo por padrão</div>
        </div>
        <div class="config-row-value">
          <div class="toggle ${isDark ? 'active' : ''}" id="cfg-dark"></div>
        </div>
      </div>
    `;
    body.appendChild(aparencia);

    const darkToggle = aparencia.querySelector('#cfg-dark');
    darkToggle.addEventListener('click', async () => {
      const activate = !darkToggle.classList.contains('active');
      darkToggle.classList.toggle('active');
      applyTheme(activate ? 'dark' : 'light');
      try {
        await put('/auth/configuracoes', { tema: activate ? 'dark' : 'light' });
      } catch {}
    });

    const financas = document.createElement('div');
    financas.className = 'config-section';
    financas.innerHTML = `
      <h3 class="config-section-title">\uD83D\uDCB0 Finanças</h3>
      <div class="config-row">
        <div>
          <div class="config-row-label">Moeda padrão</div>
          <div class="config-row-desc">BRL (R$)</div>
        </div>
      </div>
    `;
    body.appendChild(financas);

    const exportar = document.createElement('div');
    exportar.className = 'config-section';
    exportar.innerHTML = `
      <h3 class="config-section-title">\uD83D\uDCE4 Exportar dados</h3>
      <div class="config-row">
        <div>
          <div class="config-row-label">Exportar tudo (JSON)</div>
          <div class="config-row-desc">Backup completo dos seus dados</div>
        </div>
        <div class="config-row-value">
          <button class="btn-ghost" id="cfg-export-json">Exportar</button>
        </div>
      </div>
      <div class="config-row">
        <div>
          <div class="config-row-label">Exportar CSV</div>
          <div class="config-row-desc">Dados de uma tabela específica</div>
        </div>
        <div class="config-row-value">
          <select class="form-select" id="cfg-export-table" style="width:auto;padding:6px 30px 6px 10px;">
            <option value="transacoes">Transações</option>
            <option value="tarefas">Tarefas</option>
            <option value="metas">Metas</option>
            <option value="habitos">Hábitos</option>
            <option value="notas">Notas</option>
            <option value="eventos">Eventos</option>
            <option value="projetos">Projetos</option>
          </select>
          <button class="btn-ghost" id="cfg-export-csv">Exportar</button>
        </div>
      </div>
    `;
    body.appendChild(exportar);

    exportar.querySelector('#cfg-export-json').addEventListener('click', () => {
      window.open('/api/exportar/json', '_blank');
    });
    exportar.querySelector('#cfg-export-csv').addEventListener('click', () => {
      const tabela = exportar.querySelector('#cfg-export-table').value;
      window.open(`/api/exportar/csv?tabela=${tabela}`, '_blank');
    });

    const sobre = document.createElement('div');
    sobre.className = 'config-section';
    sobre.innerHTML = `
      <h3 class="config-section-title">\u2139\uFE0F Sobre</h3>
      <div class="config-row">
        <div>
          <div class="config-row-label">MyFinance</div>
          <div class="config-row-desc">Seu life manager pessoal — v1.0.0</div>
        </div>
      </div>
    `;
    body.appendChild(sobre);

    const logout = document.createElement('div');
    logout.className = 'config-section';
    logout.innerHTML = `
      <h3 class="config-section-title">\uD83D\uDEAA Sessão</h3>
      <div class="config-row">
        <div><div class="config-row-label">Sair da conta</div></div>
        <div class="config-row-value">
          <button class="btn-danger" id="cfg-logout">Sair</button>
        </div>
      </div>
    `;
    body.appendChild(logout);

    logout.querySelector('#cfg-logout').addEventListener('click', async () => {
      const ok = await confirm({ title: 'Sair?', message: 'Você será desconectado.', confirmText: 'Sair' });
      if (ok) {
        try {
          await post('/auth/logout', {});
          window.location.reload();
        } catch { window.location.reload(); }
      }
    });
  }

  openSenhaModal() {
    const content = document.createElement('div');
    content.innerHTML = `
      <div class="form-group">
        <label class="form-label">Senha atual</label>
        <input class="form-input" id="s-atual" type="password" placeholder="Senha atual">
      </div>
      <div class="form-group">
        <label class="form-label">Nova senha</label>
        <input class="form-input" id="s-nova" type="password" placeholder="Nova senha">
      </div>
      <div class="form-group">
        <label class="form-label">Confirmar nova senha</label>
        <input class="form-input" id="s-confirmar" type="password" placeholder="Confirmar">
      </div>
      <div class="modal-actions">
        <button class="btn-ghost s-cancel">Cancelar</button>
        <button class="btn-primary s-save" style="--accent:#737373;">Salvar</button>
      </div>
    `;

    const { close } = showModal(content, { title: 'Alterar senha' });

    content.querySelector('.s-cancel').addEventListener('click', close);
    content.querySelector('.s-save').addEventListener('click', async () => {
      const atual = content.querySelector('#s-atual').value;
      const nova = content.querySelector('#s-nova').value;
      const confirmar = content.querySelector('#s-confirmar').value;

      if (nova !== confirmar) {
        toast.error('As senhas não coincidem');
        return;
      }
      if (nova.length < 6) {
        toast.error('A senha deve ter pelo menos 6 caracteres');
        return;
      }
      try {
        await put('/auth/senha', { senha_atual: atual, senha_nova: nova });
        toast.success('Senha alterada');
        close();
      } catch (err) { toast.error(err.message); }
    });
  }
}
