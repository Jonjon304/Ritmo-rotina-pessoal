import { get, post, put, del } from '../../utils/api.js';
import { showModal } from '../../components/modal/modal.js';
import { toast } from '../../components/toast/toast.js';
import { confirm } from '../../components/confirm/confirm.js';
import { formatarDataISO } from '../../utils/formatDate.js';

export class HabitosModule {
  constructor() {
    this.habitos = [];
    this.checks = [];
  }

  async render(container) {
    container.innerHTML = '';

    const header = document.createElement('header');
    header.className = 'module-header';
    header.innerHTML = `
      <div class="module-header-left">
        <span class="module-header-icon" style="color: #06b6d4;">\uD83D\uDD04</span>
        <h2 class="module-header-title">Hábitos</h2>
      </div>
      <div class="section-actions">
        <button class="btn-primary" style="--accent: #06b6d4;" id="hab-novo">+ Novo hábito</button>
      </div>
    `;
    container.appendChild(header);

    const body = document.createElement('div');
    body.className = 'module-body';
    body.id = 'habitos-body';
    container.appendChild(body);

    header.querySelector('#hab-novo').addEventListener('click', () => this.openHabitoModal());

    await this.loadData();
    this.renderHabitos(body);
  }

  async loadData() {
    try {
      const [habitos, checks] = await Promise.all([
        get('/habitos/').catch(() => []),
        get('/habitos/checks').catch(() => []),
      ]);
      this.habitos = habitos.habitos || habitos || [];
      this.checks = checks.checks || checks || [];
    } catch (err) {
      toast.error('Erro ao carregar hábitos');
    }
  }

  isCheckedToday(habitoId) {
    const hoje = formatarDataISO(new Date());
    return (this.checks || []).some(c => c.habito_id == habitoId && formatarDataISO(c.data) === hoje);
  }

  renderHabitos(body) {
    body.innerHTML = '';

    const totalHoje = (this.habitos || []).filter(h => this.isCheckedToday(h.id)).length;
    const totalHabitos = (this.habitos || []).length;
    let maiorStreak = 0;

    const row = document.createElement('div');
    row.className = 'stats-row';
    row.innerHTML = `
      <div class="stat-card">
        <span class="stat-label">Hoje</span>
        <span class="stat-value mono">${totalHoje}/${totalHabitos}</span>
      </div>
      <div class="stat-card positive">
        <span class="stat-label">Maior streak</span>
        <span class="stat-value mono">\uD83D\uDD25 ${maiorStreak} dias</span>
      </div>
    `;
    body.appendChild(row);

    const weekBar = document.createElement('div');
    weekBar.className = 'habit-week-bar';
    const diasSemana = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = formatarDataISO(d);
      const anyChecked = (this.checks || []).some(c => formatarDataISO(c.data) === dateStr);
      const cell = document.createElement('div');
      cell.className = `habit-week-day ${anyChecked ? 'checked' : ''}`;
      cell.title = diasSemana[d.getDay()] + ' ' + d.getDate();
      weekBar.appendChild(cell);
    }
    body.appendChild(weekBar);

    const section = document.createElement('div');
    section.innerHTML = '<div class="section-header"><h3>Hábitos de hoje</h3></div>';
    body.appendChild(section);

    const list = document.createElement('div');
    list.className = 'habit-list';

    if ((this.habitos || []).length === 0) {
      list.innerHTML = '<div class="empty-state"><div class="empty-state-icon">\uD83D\uDD04</div><div class="empty-state-text">Nenhum hábito</div></div>';
    } else {
      (this.habitos || []).forEach(async h => {
        const checked = this.isCheckedToday(h.id);
        let streak = 0;

        try {
          const stats = await get(`/habitos/${h.id}/stats`).catch(() => ({}));
          streak = stats.streak || stats.maior_streak || 0;
          if (streak > maiorStreak) {
            maiorStreak = streak;
            row.querySelector('.stat-value').textContent = `\uD83D\uDD25 ${maiorStreak} dias`;
          }
        } catch {}

        const item = document.createElement('label');
        item.className = 'habit-item';
        item.innerHTML = `
          <input type="checkbox" class="habit-checkbox" ${checked ? 'checked' : ''}>
          <span class="habit-checkmark" style="--accent: #06b6d4;"></span>
          <span class="habit-name">${h.nome || h.titulo || '—'}</span>
          <span class="habit-streak">\uD83D\uDD25 ${streak} dias</span>
        `;
        item.querySelector('.habit-checkbox').addEventListener('change', async (e) => {
          const hoje = formatarDataISO(new Date());
          try {
            if (e.target.checked) {
              await post(`/habitos/${h.id}/check`, { data: hoje });
              toast.success('Hábito marcado!');
            } else {
              await del(`/habitos/${h.id}/check?data=${hoje}`);
              toast.success('Hábito desmarcado');
            }
            await this.loadData();
            this.renderHabitos(document.getElementById('habitos-body'));
          } catch (err) { toast.error(err.message); }
        });
        list.appendChild(item);
      });
    }
    body.appendChild(list);

    const heatmapSection = document.createElement('div');
    heatmapSection.innerHTML = '<div class="section-header" style="margin-top:24px;"><h3>Atividade</h3></div>';
    body.appendChild(heatmapSection);

    const heatmap = document.createElement('div');
    heatmap.className = 'heatmap-container';
    heatmap.innerHTML = `
      <div class="heatmap-labels">
        <span>Seg</span><span>Dom</span>
      </div>
      <div class="heatmap-grid" id="heatmap-grid"></div>
    `;
    body.appendChild(heatmap);

    const grid = heatmap.querySelector('#heatmap-grid');
    for (let i = 0; i < 28; i++) {
      const d = new Date();
      d.setDate(d.getDate() - (27 - i));
      const dateStr = formatarDataISO(d);
      const count = (this.checks || []).filter(c => formatarDataISO(c.data) === dateStr).length;
      const cell = document.createElement('div');
      cell.className = 'heatmap-cell';
      if (count > 0) {
        const level = Math.min(4, Math.ceil(count / 1));
        cell.classList.add(`level-${level}`);
      }
      cell.title = formatarDataISO(d);
      grid.appendChild(cell);
    }
  }

  openHabitoModal(habito = null) {
    const isEdit = !!habito;
    const content = document.createElement('div');
    content.innerHTML = `
      <div class="form-group">
        <label class="form-label">Nome</label>
        <input class="form-input" id="h-nome" value="${isEdit ? (habito.nome || habito.titulo || '') : ''}" placeholder="Ex: Meditar">
      </div>
      <div class="form-group">
        <label class="form-label">Frequência</label>
        <select class="form-select" id="h-freq">
          <option value="diario" ${!isEdit || habito.frequencia === 'diario' ? 'selected' : ''}>Diário</option>
          <option value="semanal" ${isEdit && habito.frequencia === 'semanal' ? 'selected' : ''}>Semanal</option>
        </select>
      </div>
      <div class="modal-actions">
        ${isEdit ? '<button class="btn-danger h-delete">Excluir</button>' : ''}
        <button class="btn-ghost h-cancel">Cancelar</button>
        <button class="btn-primary h-save" style="--accent:#06b6d4;">Salvar</button>
      </div>
    `;

    const { close } = showModal(content, { title: isEdit ? 'Editar hábito' : 'Novo hábito' });

    content.querySelector('.h-cancel').addEventListener('click', close);
    content.querySelector('.h-save').addEventListener('click', async () => {
      const data = {
        nome: content.querySelector('#h-nome').value,
        frequencia: content.querySelector('#h-freq').value,
      };
      try {
        if (isEdit) await put(`/habitos/${habito.id}`, data);
        else await post('/habitos/', data);
        toast.success(isEdit ? 'Hábito atualizado' : 'Hábito criado');
        close();
        await this.loadData();
        this.renderHabitos(document.getElementById('habitos-body'));
      } catch (err) { toast.error(err.message); }
    });

    if (isEdit) {
      content.querySelector('.h-delete')?.addEventListener('click', async () => {
        const ok = await confirm({ title: 'Excluir hábito?', message: 'Todo o histórico será perdido.', danger: true, confirmText: 'Excluir' });
        if (ok) {
          try {
            await del(`/habitos/${habito.id}`);
            toast.success('Hábito excluído');
            close();
            await this.loadData();
            this.renderHabitos(document.getElementById('habitos-body'));
          } catch (err) { toast.error(err.message); }
        }
      });
    }
  }
}
