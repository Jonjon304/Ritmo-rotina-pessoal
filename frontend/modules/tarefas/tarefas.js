import { get, post, put, patch, del } from '../../utils/api.js';
import { showModal } from '../../components/modal/modal.js';
import { toast } from '../../components/toast/toast.js';
import { confirm } from '../../components/confirm/confirm.js';
import { formatarDataCurta, formatarDataISO } from '../../utils/formatDate.js';

export class TarefasModule {
  constructor() {
    this.tarefas = [];
    this.tags = [];
    this.view = 'lista';
    this.filtro = 'todas';
  }

  async render(container) {
    container.innerHTML = '';

    const header = document.createElement('header');
    header.className = 'module-header';
    header.innerHTML = `
      <div class="module-header-left">
        <span class="module-header-icon" style="color: #3b82f6;">\uD83D\uDCCB</span>
        <h2 class="module-header-title">Tarefas</h2>
      </div>
      <div class="section-actions">
        <button class="btn-primary" style="--accent: #3b82f6;" id="tarefas-nova">+ Nova tarefa</button>
      </div>
    `;
    container.appendChild(header);

    const viewToggle = document.createElement('div');
    viewToggle.className = 'lista-view-toggle';
    viewToggle.innerHTML = `
      <button class="view-toggle-btn ${this.view === 'lista' ? 'active' : ''}" data-view="lista">Lista</button>
      <button class="view-toggle-btn ${this.view === 'kanban' ? 'active' : ''}" data-view="kanban">Kanban</button>
    `;
    container.appendChild(viewToggle);

    const filtros = document.createElement('div');
    filtros.className = 'lista-view-toggle';
    filtros.style.marginBottom = '16px';
    filtros.innerHTML = `
      <button class="view-toggle-btn ${this.filtro === 'todas' ? 'active' : ''}" data-filtro="todas">Todas</button>
      <button class="view-toggle-btn ${this.filtro === 'pendente' ? 'active' : ''}" data-filtro="pendente">Pendentes</button>
      <button class="view-toggle-btn ${this.filtro === 'concluida' ? 'active' : ''}" data-filtro="concluida">Concluídas</button>
    `;
    container.appendChild(filtros);

    const body = document.createElement('div');
    body.className = 'module-body';
    body.id = 'tarefas-body';
    container.appendChild(body);

    viewToggle.querySelectorAll('.view-toggle-btn[data-view]').forEach(btn => {
      btn.addEventListener('click', () => {
        viewToggle.querySelectorAll('.view-toggle-btn[data-view]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.view = btn.dataset.view;
        this.renderView(body);
      });
    });

    filtros.querySelectorAll('.view-toggle-btn[data-filtro]').forEach(btn => {
      btn.addEventListener('click', () => {
        filtros.querySelectorAll('.view-toggle-btn[data-filtro]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.filtro = btn.dataset.filtro;
        this.renderView(body);
      });
    });

    header.querySelector('#tarefas-nova').addEventListener('click', () => this.openTarefaModal());

    await this.loadData();
    this.renderView(body);
  }

  async loadData() {
    try {
      const [tarefas, tags] = await Promise.all([
        get('/tarefas/').catch(() => []),
        get('/tarefas/tags').catch(() => []),
      ]);
      this.tarefas = tarefas.tarefas || tarefas || [];
      this.tags = tags.tags || tags || [];
    } catch (err) {
      toast.error('Erro ao carregar tarefas');
    }
  }

  getFiltered() {
    let list = this.tarefas || [];
    if (this.filtro === 'pendente') list = list.filter(t => t.status !== 'concluida');
    if (this.filtro === 'concluida') list = list.filter(t => t.status === 'concluida');
    return list;
  }

  renderView(body) {
    body.innerHTML = '';
    if (this.view === 'kanban') this.renderKanban(body);
    else this.renderLista(body);
  }

  renderStats(body) {
    const pendentes = (this.tarefas || []).filter(t => t.status !== 'concluida').length;
    const concluidas = (this.tarefas || []).filter(t => t.status === 'concluida').length;
    const row = document.createElement('div');
    row.className = 'stats-row';
    row.innerHTML = `
      <div class="stat-card"><span class="stat-label">Pendentes</span><span class="stat-value mono">${pendentes}</span></div>
      <div class="stat-card positive"><span class="stat-label">Concluídas</span><span class="stat-value mono">${concluidas}</span></div>
      <div class="stat-card"><span class="stat-label">Total</span><span class="stat-value mono">${(this.tarefas || []).length}</span></div>
    `;
    body.appendChild(row);
  }

  renderLista(body) {
    this.renderStats(body);
    const list = document.createElement('div');
    list.className = 'task-list';
    const filtered = this.getFiltered();

    if (filtered.length === 0) {
      list.innerHTML = '<div class="empty-state"><div class="empty-state-icon">\uD83D\uDCCB</div><div class="empty-state-text">Nenhuma tarefa</div></div>';
    } else {
      filtered.forEach(t => {
        const isDone = t.status === 'concluida';
        const item = document.createElement('label');
        item.className = `task-item ${isDone ? 'completed' : ''}`;
        const prioMap = { alta: 'high', media: 'medium', baixa: 'low' };
        const prioClass = prioMap[t.prioridade] || 'medium';
        item.innerHTML = `
          <input type="checkbox" class="task-checkbox" ${isDone ? 'checked' : ''}>
          <span class="task-checkmark"></span>
          <span class="task-name">${t.titulo || t.nome || '—'}</span>
          ${t.data ? `<span class="task-date">${formatarDataCurta(t.data)}</span>` : ''}
          <span class="badge badge-${prioClass}">${t.prioridade || 'media'}</span>
        `;
        item.querySelector('.task-checkbox').addEventListener('change', async (e) => {
          const newStatus = e.target.checked ? 'concluida' : 'pendente';
          try {
            await patch(`/tarefas/${t.id}/status`, { status: newStatus });
            await this.loadData();
            this.renderView(document.getElementById('tarefas-body'));
          } catch (err) { toast.error(err.message); }
        });
        item.addEventListener('click', (e) => {
          if (e.target.classList.contains('task-checkbox')) return;
          this.openTarefaModal(t);
        });
        list.appendChild(item);
      });
    }
    body.appendChild(list);
  }

  renderKanban(body) {
    this.renderStats(body);
    const board = document.createElement('div');
    board.className = 'kanban-board';

    const cols = [
      { status: 'pendente', title: 'Pendentes', color: '#3b82f6' },
      { status: 'em_progresso', title: 'Em Progresso', color: '#f59e0b' },
      { status: 'concluida', title: 'Concluídas', color: '#22c55e' },
    ];

    cols.forEach(col => {
      const items = (this.tarefas || []).filter(t => t.status === col.status);
      const column = document.createElement('div');
      column.className = 'kanban-column';
      column.innerHTML = `
        <div class="kanban-column-header">
          <span class="kanban-column-title" style="color:${col.color};">${col.title}</span>
          <span class="kanban-column-count">${items.length}</span>
        </div>
        <div class="kanban-cards"></div>
      `;
      const cards = column.querySelector('.kanban-cards');
      items.forEach(t => {
        const card = document.createElement('div');
        card.className = 'kanban-card';
        card.innerHTML = `
          <div class="kanban-card-title">${t.titulo || t.nome || '—'}</div>
          <div class="kanban-card-meta">
            <span class="badge badge-${{ alta: 'high', media: 'medium', baixa: 'low' }[t.prioridade] || 'medium'}">${t.prioridade || 'media'}</span>
          </div>
        `;
        card.addEventListener('click', () => this.openTarefaModal(t));
        cards.appendChild(card);
      });
      board.appendChild(column);
    });

    body.appendChild(board);
  }

  openTarefaModal(tarefa = null) {
    const isEdit = !!tarefa;
    const content = document.createElement('div');
    content.innerHTML = `
      <div class="form-group">
        <label class="form-label">Título</label>
        <input class="form-input" id="tk-titulo" value="${isEdit ? (tarefa.titulo || '') : ''}" placeholder="Ex: Revisar orçamento">
      </div>
      <div class="form-group">
        <label class="form-label">Descrição</label>
        <textarea class="form-textarea" id="tk-desc" placeholder="Opcional">${isEdit ? (tarefa.descricao || '') : ''}</textarea>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Prioridade</label>
          <select class="form-select" id="tk-prio">
            <option value="baixa" ${isEdit && tarefa.prioridade === 'baixa' ? 'selected' : ''}>Baixa</option>
            <option value="media" ${!isEdit || tarefa.prioridade === 'media' ? 'selected' : ''}>Média</option>
            <option value="alta" ${isEdit && tarefa.prioridade === 'alta' ? 'selected' : ''}>Alta</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Data</label>
          <input class="form-input" id="tk-data" type="date" value="${isEdit && tarefa.data ? formatarDataISO(tarefa.data) : ''}">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Status</label>
          <select class="form-select" id="tk-status">
            <option value="pendente" ${!isEdit || tarefa.status === 'pendente' ? 'selected' : ''}>Pendente</option>
            <option value="em_progresso" ${isEdit && tarefa.status === 'em_progresso' ? 'selected' : ''}>Em progresso</option>
            <option value="concluida" ${isEdit && tarefa.status === 'concluida' ? 'selected' : ''}>Concluída</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Projeto</label>
          <input class="form-input" id="tk-projeto" type="number" value="${isEdit ? (tarefa.projeto_id || '') : ''}" placeholder="ID do projeto (opcional)">
        </div>
      </div>
      <div class="modal-actions">
        ${isEdit ? '<button class="btn-danger tk-delete">Excluir</button>' : ''}
        <button class="btn-ghost tk-cancel">Cancelar</button>
        <button class="btn-primary tk-save" style="--accent:#3b82f6;">Salvar</button>
      </div>
    `;

    const { close } = showModal(content, { title: isEdit ? 'Editar tarefa' : 'Nova tarefa' });

    content.querySelector('.tk-cancel').addEventListener('click', close);
    content.querySelector('.tk-save').addEventListener('click', async () => {
      const data = {
        nome: content.querySelector('#tk-titulo').value,
        descricao: content.querySelector('#tk-desc').value || null,
        prioridade: content.querySelector('#tk-prio').value,
        vencimento: content.querySelector('#tk-data').value || null,
        status: content.querySelector('#tk-status').value,
        projeto_id: parseInt(content.querySelector('#tk-projeto').value) || null,
      };
      try {
        if (isEdit) await put(`/tarefas/${tarefa.id}`, data);
        else await post('/tarefas/', data);
        toast.success(isEdit ? 'Tarefa atualizada' : 'Tarefa criada');
        close();
        await this.loadData();
        this.renderView(document.getElementById('tarefas-body'));
      } catch (err) { toast.error(err.message); }
    });

    if (isEdit) {
      content.querySelector('.tk-delete')?.addEventListener('click', async () => {
        const ok = await confirm({ title: 'Excluir tarefa?', message: 'Esta ação não pode ser desfeita.', danger: true, confirmText: 'Excluir' });
        if (ok) {
          try {
            await del(`/tarefas/${tarefa.id}`);
            toast.success('Tarefa excluída');
            close();
            await this.loadData();
            this.renderView(document.getElementById('tarefas-body'));
          } catch (err) { toast.error(err.message); }
        }
      });
    }
  }
}
