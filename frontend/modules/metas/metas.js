import { get, post, put, patch, del } from '../../utils/api.js';
import { showModal } from '../../components/modal/modal.js';
import { toast } from '../../components/toast/toast.js';
import { confirm } from '../../components/confirm/confirm.js';
import { formatarMoeda } from '../../utils/formatCurrency.js';
import { formatarDataCurta, formatarDataISO } from '../../utils/formatDate.js';

export class MetasModule {
  constructor() {
    this.metas = [];
    this.filtro = 'todas';
  }

  async render(container) {
    container.innerHTML = '';

    const header = document.createElement('header');
    header.className = 'module-header';
    header.innerHTML = `
      <div class="module-header-left">
        <span class="module-header-icon" style="color: #f59e0b;">\uD83C\uDFAF</span>
        <h2 class="module-header-title">Metas</h2>
      </div>
      <div class="section-actions">
        <button class="btn-primary" style="--accent: #f59e0b;" id="metas-nova">+ Nova meta</button>
      </div>
    `;
    container.appendChild(header);

    const filtros = document.createElement('div');
    filtros.className = 'lista-view-toggle';
    filtros.style.marginBottom = '16px';
    filtros.innerHTML = `
      <button class="view-toggle-btn ${this.filtro === 'todas' ? 'active' : ''}" data-filtro="todas">Todas</button>
      <button class="view-toggle-btn ${this.filtro === 'em_progresso' ? 'active' : ''}" data-filtro="em_progresso">Em progresso</button>
      <button class="view-toggle-btn ${this.filtro === 'concluida' ? 'active' : ''}" data-filtro="concluida">Concluídas</button>
    `;
    container.appendChild(filtros);

    const body = document.createElement('div');
    body.className = 'module-body';
    body.id = 'metas-body';
    container.appendChild(body);

    filtros.querySelectorAll('.view-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        filtros.querySelectorAll('.view-toggle-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.filtro = btn.dataset.filtro;
        this.renderMetas(body);
      });
    });

    header.querySelector('#metas-nova').addEventListener('click', () => this.openMetaModal());

    await this.loadData();
    this.renderMetas(body);
  }

  async loadData() {
    try {
      const data = await get('/metas/').catch(() => []);
      this.metas = data.metas || data || [];
    } catch (err) {
      toast.error('Erro ao carregar metas');
    }
  }

  renderMetas(body) {
    body.innerHTML = '';

    let list = this.metas || [];
    if (this.filtro === 'em_progresso') list = list.filter(m => m.status === 'em_progresso');
    if (this.filtro === 'concluida') list = list.filter(m => m.status === 'concluida');

    const ativas = list.filter(m => m.status === 'em_progresso').length;
    const concluidas = list.filter(m => m.status === 'concluida').length;

    const stats = document.createElement('div');
    stats.className = 'stats-row';
    stats.innerHTML = `
      <div class="stat-card"><span class="stat-label">Ativas</span><span class="stat-value mono">${ativas}</span></div>
      <div class="stat-card positive"><span class="stat-label">Concluídas</span><span class="stat-value mono">${concluidas}</span></div>
      <div class="stat-card"><span class="stat-label">Total</span><span class="stat-value mono">${list.length}</span></div>
    `;
    body.appendChild(stats);

    const grid = document.createElement('div');
    grid.className = 'goals-grid';

    if (list.length === 0) {
      grid.innerHTML = '<div class="empty-state"><div class="empty-state-icon">\uD83C\uDFAF</div><div class="empty-state-text">Nenhuma meta</div></div>';
    } else {
      list.forEach(m => {
        const pct = m.valor_alvo ? Math.min(100, Math.round(((m.valor_atual || 0) / m.valor_alvo) * 100)) : 0;
        const card = document.createElement('div');
        card.className = 'goal-card';
        card.innerHTML = `
          <div class="goal-header">
            <span class="goal-icon">${m.tipo === 'financeira' ? '\uD83D\uDCB0' : '\uD83D\uDCDA'}</span>
            <span class="goal-type">${m.tipo || 'pessoal'}</span>
            <span class="goal-status ${m.status || 'em-progresso'}">${(m.status || 'em_progresso').replace('_', ' ')}</span>
          </div>
          <h4 class="goal-name">${m.titulo || m.nome || '—'}</h4>
          <p class="goal-target mono">${m.tipo === 'financeira' ? formatarMoeda(m.valor_alvo || 0) : (m.valor_alvo || '—')}</p>
          <div class="goal-progress">
            <div class="goal-bar" style="--progress: ${pct}%; --accent: #f59e0b;"></div>
          </div>
          <span class="goal-current mono">${m.tipo === 'financeira' ? formatarMoeda(m.valor_atual || 0) : (m.valor_atual || 0)} <span class="goal-pct">${pct}%</span></span>
          ${m.prazo ? `<span class="goal-deadline">Prazo: ${formatarDataCurta(m.prazo)}</span>` : ''}
        `;
        card.addEventListener('click', () => this.openMetaModal(m));
        grid.appendChild(card);
      });
    }
    body.appendChild(grid);
  }

  openMetaModal(meta = null) {
    const isEdit = !!meta;
    const content = document.createElement('div');
    content.innerHTML = `
      <div class="form-group">
        <label class="form-label">Título</label>
        <input class="form-input" id="m-titulo" value="${isEdit ? (meta.titulo || '') : ''}" placeholder="Ex: Fundo de emergência">
      </div>
      <div class="form-group">
        <label class="form-label">Descrição</label>
        <textarea class="form-textarea" id="m-desc">${isEdit ? (meta.descricao || '') : ''}</textarea>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Tipo</label>
          <select class="form-select" id="m-tipo">
            <option value="financeira" ${!isEdit || meta.tipo === 'financeira' ? 'selected' : ''}>Financeira</option>
            <option value="pessoal" ${isEdit && meta.tipo === 'pessoal' ? 'selected' : ''}>Pessoal</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Valor alvo</label>
          <input class="form-input" id="m-alvo" type="number" step="0.01" value="${isEdit ? (meta.valor_alvo || '') : ''}" placeholder="10000">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Valor atual</label>
          <input class="form-input" id="m-atual" type="number" step="0.01" value="${isEdit ? (meta.valor_atual || 0) : 0}">
        </div>
        <div class="form-group">
          <label class="form-label">Prazo</label>
          <input class="form-input" id="m-prazo" type="date" value="${isEdit && meta.prazo ? formatarDataISO(meta.prazo) : ''}">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Status</label>
        <select class="form-select" id="m-status">
          <option value="em_progresso" ${!isEdit || meta.status === 'em_progresso' ? 'selected' : ''}>Em progresso</option>
          <option value="concluida" ${isEdit && meta.status === 'concluida' ? 'selected' : ''}>Concluída</option>
          <option value="abandonada" ${isEdit && meta.status === 'abandonada' ? 'selected' : ''}>Abandonada</option>
        </select>
      </div>
      ${isEdit ? '<div style="margin-bottom:16px;"><button class="btn-ghost" id="m-atualizar" style="width:100%;">Atualizar progresso</button></div>' : ''}
      <div class="modal-actions">
        ${isEdit ? '<button class="btn-danger m-delete">Excluir</button>' : ''}
        <button class="btn-ghost m-cancel">Cancelar</button>
        <button class="btn-primary m-save" style="--accent:#f59e0b;">Salvar</button>
      </div>
    `;

    const { close } = showModal(content, { title: isEdit ? 'Editar meta' : 'Nova meta' });

    content.querySelector('.m-cancel').addEventListener('click', close);
    content.querySelector('.m-save').addEventListener('click', async () => {
      const data = {
        titulo: content.querySelector('#m-titulo').value,
        descricao: content.querySelector('#m-desc').value || null,
        tipo: content.querySelector('#m-tipo').value,
        valor_alvo: parseFloat(content.querySelector('#m-alvo').value) || 0,
        valor_atual: parseFloat(content.querySelector('#m-atual').value) || 0,
        prazo: content.querySelector('#m-prazo').value || null,
        status: content.querySelector('#m-status').value,
      };
      try {
        if (isEdit) await put(`/metas/${meta.id}`, data);
        else await post('/metas/', data);
        toast.success(isEdit ? 'Meta atualizada' : 'Meta criada');
        close();
        await this.loadData();
        this.renderMetas(document.getElementById('metas-body'));
      } catch (err) { toast.error(err.message); }
    });

    if (isEdit) {
      content.querySelector('#m-atualizar')?.addEventListener('click', async () => {
        const novoValor = parseFloat(content.querySelector('#m-atual').value) || 0;
        try {
          await patch(`/metas/${meta.id}/progresso`, { valor_atual: novoValor });
          toast.success('Progresso atualizado');
        } catch (err) { toast.error(err.message); }
      });

      content.querySelector('.m-delete')?.addEventListener('click', async () => {
        const ok = await confirm({ title: 'Excluir meta?', message: 'Esta ação não pode ser desfeita.', danger: true, confirmText: 'Excluir' });
        if (ok) {
          try {
            await del(`/metas/${meta.id}`);
            toast.success('Meta excluída');
            close();
            await this.loadData();
            this.renderMetas(document.getElementById('metas-body'));
          } catch (err) { toast.error(err.message); }
        }
      });
    }
  }
}
