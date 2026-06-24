import { get, post, put, del } from '../../utils/api.js';
import { showModal } from '../../components/modal/modal.js';
import { toast } from '../../components/toast/toast.js';
import { confirm } from '../../components/confirm/confirm.js';
import { formatarDataCurta, formatarDataISO, getSemanaDates, formatarMesAno } from '../../utils/formatDate.js';
import { escapeHtml } from '../../utils/helpers.js';

const DIAS_CURTOS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

export class CronogramaModule {
  constructor() {
    this.eventos = [];
    this.tarefasCrono = [];
    this.habitos = [];
    this.habitosChecks = [];
    this.habitosMap = {};
    this.semanaOffset = 0;
    this.mesOffset = 0;
    this.selectedDate = null;
    this.view = 'semana';
  }

  async render(container) {
    container.innerHTML = '';

    const header = document.createElement('header');
    header.className = 'module-header';
    header.innerHTML = `
      <div class="module-header-left">
        <span class="module-header-icon" style="color: #10b981;">\uD83D\uDCC5</span>
        <h2 class="module-header-title">Cronograma</h2>
      </div>
      <div class="section-actions">
        <button class="btn-primary" style="--accent: #10b981;" id="crono-novo">+ Novo evento</button>
      </div>
    `;
    container.appendChild(header);

    const viewToggle = document.createElement('div');
    viewToggle.className = 'lista-view-toggle';
    viewToggle.style.marginBottom = '16px';
    viewToggle.innerHTML = `
      <button class="view-toggle-btn ${this.view === 'semana' ? 'active' : ''}" data-view="semana">Semana</button>
      <button class="view-toggle-btn ${this.view === 'mes' ? 'active' : ''}" data-view="mes">Mês</button>
      <button class="view-toggle-btn ${this.view === 'dia' ? 'active' : ''}" data-view="dia">Dia</button>
    `;
    container.appendChild(viewToggle);

    const body = document.createElement('div');
    body.className = 'module-body';
    body.id = 'crono-body';
    container.appendChild(body);

    viewToggle.querySelectorAll('.view-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        viewToggle.querySelectorAll('.view-toggle-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.view = btn.dataset.view;
        this.renderView(body);
      });
    });

    header.querySelector('#crono-novo').addEventListener('click', () => this.openEventoModal());

    await this.loadData();
    this.renderView(body);
  }

  async loadData() {
    try {
      const [data, tarefasData, habitosData, checksData] = await Promise.all([
        get('/cronograma/eventos').catch(() => []),
        get('/tarefas/').catch(() => ({ dados: [] })),
        get('/habitos/').catch(() => []),
        get('/habitos/checks').catch(() => []),
      ]);
      this.eventos = data.eventos || data || [];
      this.tarefasCrono = (tarefasData.dados || tarefasData.tarefas || tarefasData || []).filter(t => t.vencimento);
      this.habitos = Array.isArray(habitosData) ? habitosData : (habitosData.habitos || []);
      this.habitosChecks = Array.isArray(checksData) ? checksData : (checksData.checks || []);
      this.habitosMap = {};
      this.habitos.forEach(h => { this.habitosMap[h.id] = h.nome || '—'; });
    } catch (err) {
      toast.error('Erro ao carregar cronograma');
    }
  }

  async loadDia(data) {
    try {
      const result = await get(`/cronograma/dia/${data}`).catch(() => ({ eventos: [], tarefas: [], habitos: { total: 0, concluidos: 0, lista: [] } }));
      return result;
    } catch {
      return { eventos: [], tarefas: [], habitos: { total: 0, concluidos: 0, lista: [] } };
    }
  }

  renderView(body) {
    body.innerHTML = '';
    if (this.view === 'dia') this.renderDia(body);
    else if (this.view === 'mes') this.renderMes(body);
    else this.renderSemana(body);
  }

  renderSemana(body) {
    const nav = document.createElement('div');
    nav.className = 'week-nav';

    const dates = getSemanaDates(this.semanaOffset);
    const start = dates[0];
    const end = dates[6];
    const label = `${start.getDate()} — ${end.getDate()} ${formatarMesAno(end)}`;

    nav.innerHTML = `
      <button class="btn-icon">&larr;</button>
      <span class="week-label">${label}</span>
      <button class="btn-icon">&rarr;</button>
    `;
    body.appendChild(nav);

    nav.querySelectorAll('.btn-icon')[0].addEventListener('click', () => {
      this.semanaOffset--;
      this.renderView(body);
    });
    nav.querySelectorAll('.btn-icon')[1].addEventListener('click', () => {
      this.semanaOffset++;
      this.renderView(body);
    });

    const grid = document.createElement('div');
    grid.className = 'week-grid';

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    dates.forEach((d, i) => {
      const isToday = d.toDateString() === hoje.toDateString();
      const dateStr = formatarDataISO(d);
      const dayEvents = (this.eventos || []).filter(e => {
        const eDate = e.data || e.data_inicio;
        if (!eDate) return false;
        return formatarDataISO(eDate) === dateStr;
      });
      const dayTarefas = (this.tarefasCrono || []).filter(t => {
        return t.vencimento && formatarDataISO(t.vencimento) === dateStr;
      });
      const dayHabitosChecked = (this.habitosChecks || []).filter(c => formatarDataISO(c.data) === dateStr && c.checked);
      const dayHabitosPending = (this.habitos || []).filter(h => {
        return !dayHabitosChecked.some(c => c.habito_id == h.id);
      });

      const totalCount = dayEvents.length + dayTarefas.length + dayHabitosChecked.length + dayHabitosPending.length;
      const slotLimit = 5;
      let slots = 0;

      const buildSlots = (arr, accent, prefix = '') => {
        return arr.slice(0, Math.max(0, slotLimit - slots)).map(item => {
          slots++;
          const nome = item.nome || this.habitosMap[item.habito_id] || '';
          return `<div class="week-event" style="--accent: ${accent};" title="${escapeHtml(nome)}">${prefix}${item.horario_inicio ? item.horario_inicio + ' ' : ''}${escapeHtml(nome)}</div>`;
        }).join('');
      };

      const habitosCheckedHTML = dayHabitosChecked.slice(0, Math.max(0, slotLimit - slots)).map(c => {
        slots++;
        const nome = this.habitosMap[c.habito_id] || '';
        return `<div class="week-event" style="--accent: #06b6d4;" title="${escapeHtml(nome)}">\u2713 ${escapeHtml(nome)}</div>`;
      }).join('');

      const habitosPendingHTML = dayHabitosPending.slice(0, Math.max(0, slotLimit - slots)).map(h => {
        slots++;
        const nome = h.nome || '';
        return `<div class="week-event week-event-pending" style="--accent: #06b6d4;" title="${escapeHtml(nome)}">\u2717 ${escapeHtml(nome)}</div>`;
      }).join('');

      const day = document.createElement('div');
      day.className = `week-day ${isToday ? 'today' : ''}`;
      day.innerHTML = `
        <span class="week-day-name">${DIAS_CURTOS[i]}</span>
        <span class="week-day-num">${d.getDate()}</span>
        <div class="week-events">
          ${buildSlots(dayEvents, '#10b981')}
          ${buildSlots(dayTarefas, '#3b82f6')}
          ${habitosCheckedHTML}
          ${habitosPendingHTML}
          ${totalCount > slotLimit ? `<div style="font-size:10px;color:var(--text-muted);">+${totalCount - slotLimit} mais</div>` : ''}
        </div>
      `;
      day.addEventListener('click', () => {
        this.selectedDate = dateStr;
        this.view = 'dia';
        this.renderView(body);
      });
      grid.appendChild(day);
    });
    body.appendChild(grid);
  }

  renderMes(body) {
    const ref = new Date();
    ref.setDate(1);
    ref.setMonth(ref.getMonth() + this.mesOffset);

    const nav = document.createElement('div');
    nav.className = 'week-nav';
    nav.innerHTML = `
      <button class="btn-icon">&larr;</button>
      <span class="week-label">${formatarMesAno(ref)}</span>
      <button class="btn-icon">&rarr;</button>
    `;
    body.appendChild(nav);

    nav.querySelectorAll('.btn-icon')[0].addEventListener('click', () => {
      this.mesOffset--;
      this.renderView(body);
    });
    nav.querySelectorAll('.btn-icon')[1].addEventListener('click', () => {
      this.mesOffset++;
      this.renderView(body);
    });

    const headerRow = document.createElement('div');
    headerRow.className = 'mes-header-row';
    DIAS_CURTOS.forEach(d => {
      const h = document.createElement('div');
      h.className = 'mes-header-cell';
      h.textContent = d;
      headerRow.appendChild(h);
    });
    body.appendChild(headerRow);

    const grid = document.createElement('div');
    grid.className = 'mes-grid';

    const year = ref.getFullYear();
    const month = ref.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDow = (firstDay.getDay() + 6) % 7;
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const cells = [];

    for (let i = startDow - 1; i >= 0; i--) {
      const d = new Date(year, month, -(i));
      cells.push({ date: d, otherMonth: true });
    }
    for (let i = 1; i <= lastDay.getDate(); i++) {
      cells.push({ date: new Date(year, month, i), otherMonth: false });
    }
    const remaining = 7 - (cells.length % 7);
    if (remaining < 7) {
      for (let i = 1; i <= remaining; i++) {
        cells.push({ date: new Date(year, month + 1, i), otherMonth: true });
      }
    }

    const checkedByDate = {};
    (this.habitosChecks || []).forEach(c => {
      const ds = formatarDataISO(c.data);
      if (!checkedByDate[ds]) checkedByDate[ds] = { checked: new Set(), habitoIds: new Set() };
      if (c.checked) checkedByDate[ds].checked.add(c.habito_id);
      checkedByDate[ds].habitoIds.add(c.habito_id);
    });

    const allHabitoIds = new Set((this.habitos || []).map(h => h.id));

    const eventsByDate = {};
    (this.eventos || []).forEach(e => {
      const ds = formatarDataISO(e.data_inicio || e.data);
      if (!eventsByDate[ds]) eventsByDate[ds] = 0;
      eventsByDate[ds]++;
    });
    (this.tarefasCrono || []).forEach(t => {
      if (t.vencimento) {
        const ds = formatarDataISO(t.vencimento);
        if (!eventsByDate[ds]) eventsByDate[ds] = 0;
        eventsByDate[ds]++;
      }
    });

    cells.forEach(cell => {
      const dateStr = formatarDataISO(cell.date);
      const isToday = cell.date.toDateString() === hoje.toDateString();
      const habData = checkedByDate[dateStr];
      const hasChecked = habData && habData.checked.size > 0;
      const totalCheckedForDate = habData ? habData.checked.size : 0;
      const hasPending = !cell.otherMonth && allHabitoIds.size > 0 && totalCheckedForDate < allHabitoIds.size;
      const hasEvents = (eventsByDate[dateStr] || 0) > 0;

      const el = document.createElement('div');
      el.className = 'mes-cell';
      if (cell.otherMonth) el.classList.add('other-month');
      if (isToday) el.classList.add('today');
      if (hasEvents) el.classList.add('has-event');
      if (hasChecked) el.classList.add('has-habito-checked');
      if (hasPending && !cell.otherMonth) el.classList.add('has-habito-pending');

      let dotsHTML = '';
      if (hasChecked) dotsHTML += '<span class="mes-dot mes-dot-checked"></span>';
      if (hasPending && !cell.otherMonth) dotsHTML += '<span class="mes-dot mes-dot-pending"></span>';
      if (hasEvents) dotsHTML += '<span class="mes-dot mes-dot-event"></span>';

      el.innerHTML = `<span class="mes-cell-num">${cell.date.getDate()}</span><div class="mes-cell-dots">${dotsHTML}</div>`;
      el.addEventListener('click', () => {
        this.selectedDate = dateStr;
        this.view = 'dia';
        this.renderView(body);
      });
      grid.appendChild(el);
    });

    body.appendChild(grid);
  }

  async renderDia(body) {
    const dateStr = this.selectedDate || formatarDataISO(new Date());
    const result = await this.loadDia(dateStr);
    const eventos = result.eventos || [];
    const tarefas = result.tarefas || [];
    const habitos = result.habitos || {};

    const nav = document.createElement('div');
    nav.className = 'week-nav';
    nav.innerHTML = `
      <button class="btn-icon" id="dia-voltar">&larr;</button>
      <span class="week-label">${this.selectedDate ? formatarDataCurta(this.selectedDate) : 'Hoje'}</span>
      <button class="btn-icon" id="dia-avancar">&rarr;</button>
    `;
    body.appendChild(nav);

    nav.querySelector('#dia-voltar').addEventListener('click', () => {
      const d = new Date(this.selectedDate || new Date());
      d.setDate(d.getDate() - 1);
      this.selectedDate = formatarDataISO(d);
      this.renderView(body);
    });
    nav.querySelector('#dia-avancar').addEventListener('click', () => {
      const d = new Date(this.selectedDate || new Date());
      d.setDate(d.getDate() + 1);
      this.selectedDate = formatarDataISO(d);
      this.renderView(body);
    });

    const sections = document.createElement('div');
    sections.className = 'dia-sections';

    if (eventos.length === 0 && tarefas.length === 0 && (!habitos.lista || habitos.lista.length === 0)) {
      sections.innerHTML = '<div class="empty-state"><div class="empty-state-icon">\uD83D\uDCC5</div><div class="empty-state-text">Nenhum evento, tarefa ou hábito neste dia</div></div>';
    } else {
      if (eventos.length > 0) {
        const title = document.createElement('h4');
        title.className = 'dia-section-title';
        title.textContent = '\uD83D\uDCC5 Eventos';
        sections.appendChild(title);
        eventos.forEach(e => {
          const item = document.createElement('div');
          item.className = 'dia-event-item';
          item.innerHTML = `
            <span class="dia-event-time">${e.horario_inicio || ''} ${e.horario_fim ? `- ${e.horario_fim}` : ''}</span>
            <span class="dia-event-title">${e.nome || '—'}</span>
          `;
          item.addEventListener('click', () => this.openEventoModal(e));
          sections.appendChild(item);
        });
      }

      if (tarefas.length > 0) {
        const title = document.createElement('h4');
        title.className = 'dia-section-title';
        title.textContent = '\uD83D\uDCCB Tarefas com vencimento';
        sections.appendChild(title);
        tarefas.forEach(t => {
          const item = document.createElement('div');
          item.className = 'dia-event-item';
          item.innerHTML = `
            <span class="badge badge-${t.prioridade === 'alta' ? 'high' : t.prioridade === 'baixa' ? 'low' : 'medium'}">${t.prioridade || ''}</span>
            <span class="dia-event-title">${t.nome || '—'}</span>
          `;
          sections.appendChild(item);
        });
      }

      if (habitos.lista && habitos.lista.length > 0) {
        const title = document.createElement('h4');
        title.className = 'dia-section-title';
        title.textContent = `\u2705 Hábitos (${habitos.concluidos || 0}/${habitos.total || 0})`;
        sections.appendChild(title);
        habitos.lista.forEach(h => {
          const item = document.createElement('div');
          item.className = 'dia-event-item';
          item.style.cursor = 'default';
          item.innerHTML = `
            <span style="color:${h.checked ? 'var(--success)' : 'var(--text-muted)'};cursor:pointer;font-size:18px;" class="hab-toggle" data-id="${h.id}" data-date="${dateStr}">${h.checked ? '\u2713' : '\u2717'}</span>
            <span class="dia-event-title">${h.nome || '—'}</span>
            <span style="margin-left:auto;display:flex;gap:6px;">
              <span class="hab-edit-btn" data-id="${h.id}" data-nome="${escapeHtml(h.nome || '')}" style="cursor:pointer;opacity:0.5;font-size:13px;" title="Editar">\u270E</span>
              <span class="hab-delete-btn" data-id="${h.id}" style="cursor:pointer;opacity:0.5;font-size:13px;color:var(--danger);" title="Excluir">\u2716</span>
            </span>
          `;
          item.querySelector('.hab-toggle').addEventListener('click', async (e) => {
            e.stopPropagation();
            try {
              if (h.checked) {
                await del(`/habitos/${h.id}/check?data=${dateStr}`);
                toast.success('Hábito desmarcado');
              } else {
                await post(`/habitos/${h.id}/check`, { data: dateStr });
                toast.success('Hábito marcado!');
              }
              this.renderView(document.getElementById('crono-body'));
            } catch (err) { toast.error(err.message); }
          });
          item.querySelector('.hab-edit-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.openHabitoEditModal({ id: h.id, nome: h.nome });
          });
          item.querySelector('.hab-delete-btn').addEventListener('click', async (e) => {
            e.stopPropagation();
            const ok = await confirm({ title: 'Excluir hábito?', message: 'Todo o histórico será perdido.', danger: true, confirmText: 'Excluir' });
            if (ok) {
              try {
                await del(`/habitos/${h.id}`);
                toast.success('Hábito excluído');
                this.renderView(document.getElementById('crono-body'));
              } catch (err) { toast.error(err.message); }
            }
          });
          sections.appendChild(item);
        });
      }
    }
    body.appendChild(sections);
  }

  openHabitoEditModal(habito) {
    const content = document.createElement('div');
    content.innerHTML = `
      <div class="form-group">
        <label class="form-label">Nome</label>
        <input class="form-input" id="h-edit-nome" value="${escapeHtml(habito.nome || '')}" placeholder="Ex: Meditar">
      </div>
      <div class="modal-actions">
        <button class="btn-ghost h-edit-cancel">Cancelar</button>
        <button class="btn-primary h-edit-save" style="--accent:#06b6d4;">Salvar</button>
      </div>
    `;
    const { close } = showModal(content, { title: 'Editar hábito' });
    content.querySelector('.h-edit-cancel').addEventListener('click', close);
    content.querySelector('.h-edit-save').addEventListener('click', async () => {
      const nome = content.querySelector('#h-edit-nome').value.trim();
      if (!nome) { toast.error('Informe o nome'); return; }
      try {
        await put(`/habitos/${habito.id}`, { nome });
        toast.success('Hábito atualizado');
        close();
        await this.loadData();
        this.renderView(document.getElementById('crono-body'));
      } catch (err) { toast.error(err.message); }
    });
  }

  openEventoModal(evento = null) {
    const isEdit = !!evento;
    const content = document.createElement('div');
    content.innerHTML = `
      <div class="form-group">
        <label class="form-label">Nome</label>
        <input class="form-input" id="ev-nome" value="${isEdit ? (evento.nome || '') : ''}" placeholder="Ex: Reunião equipe">
      </div>
      <div class="form-group">
        <label class="form-label">Descrição</label>
        <textarea class="form-textarea" id="ev-desc">${isEdit ? (evento.descricao || '') : ''}</textarea>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Tipo</label>
          <select class="form-select" id="ev-tipo">
            <option value="com_horario" ${!isEdit || evento.tipo === 'com_horario' ? 'selected' : ''}>Com horário</option>
            <option value="dia_inteiro" ${isEdit && evento.tipo === 'dia_inteiro' ? 'selected' : ''}>Dia inteiro</option>
            <option value="lembrete" ${isEdit && evento.tipo === 'lembrete' ? 'selected' : ''}>Lembrete</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Data</label>
          <input class="form-input" id="ev-data" type="date" value="${isEdit ? (evento.data_inicio ? formatarDataISO(evento.data_inicio) : '') : (this.selectedDate || formatarDataISO(new Date()))}">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Horário início</label>
          <input class="form-input" id="ev-horario-ini" type="time" value="${isEdit ? (evento.horario_inicio || '') : ''}">
        </div>
        <div class="form-group">
          <label class="form-label">Horário fim</label>
          <input class="form-input" id="ev-horario-fim" type="time" value="${isEdit ? (evento.horario_fim || '') : ''}">
        </div>
      </div>
      <div class="modal-actions">
        ${isEdit ? '<button class="btn-danger ev-delete">Excluir</button>' : ''}
        <button class="btn-ghost ev-cancel">Cancelar</button>
        <button class="btn-primary ev-save" style="--accent:#10b981;">Salvar</button>
      </div>
    `;

    const { close } = showModal(content, { title: isEdit ? 'Editar evento' : 'Novo evento' });

    content.querySelector('.ev-cancel').addEventListener('click', close);
    content.querySelector('.ev-save').addEventListener('click', async () => {
      const data = {
        nome: content.querySelector('#ev-nome').value,
        descricao: content.querySelector('#ev-desc').value || null,
        tipo: content.querySelector('#ev-tipo').value,
        data_inicio: content.querySelector('#ev-data').value,
        horario_inicio: content.querySelector('#ev-horario-ini').value || null,
        horario_fim: content.querySelector('#ev-horario-fim').value || null,
      };
      try {
        if (isEdit) await put(`/cronograma/eventos/${evento.id}`, data);
        else await post('/cronograma/eventos', data);
        toast.success(isEdit ? 'Evento atualizado' : 'Evento criado');
        close();
        await this.loadData();
        this.renderView(document.getElementById('crono-body'));
      } catch (err) { toast.error(err.message); }
    });

    if (isEdit) {
      content.querySelector('.ev-delete')?.addEventListener('click', async () => {
        const ok = await confirm({ title: 'Excluir evento?', message: 'Esta ação não pode ser desfeita.', danger: true, confirmText: 'Excluir' });
        if (ok) {
          try {
            await del(`/cronograma/eventos/${evento.id}`);
            toast.success('Evento excluído');
            close();
            await this.loadData();
            this.renderView(document.getElementById('crono-body'));
          } catch (err) { toast.error(err.message); }
        }
      });
    }
  }
}
