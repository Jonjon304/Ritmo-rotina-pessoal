import { get, post, put, del } from '../../utils/api.js';
import { showModal } from '../../components/modal/modal.js';
import { toast } from '../../components/toast/toast.js';
import { confirm } from '../../components/confirm/confirm.js';
import { formatarDataCurta, formatarDataISO, getSemanaDates, formatarMesAno } from '../../utils/formatDate.js';

const DIAS_CURTOS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

export class CronogramaModule {
  constructor() {
    this.eventos = [];
    this.semanaOffset = 0;
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
      const data = await get('/cronograma/eventos').catch(() => []);
      this.eventos = data.eventos || data || [];
    } catch (err) {
      toast.error('Erro ao carregar cronograma');
    }
  }

  async loadDia(data) {
    try {
      const result = await get(`/cronograma/dia/${data}`).catch(() => ({ eventos: [] }));
      return result.eventos || result || [];
    } catch {
      return [];
    }
  }

  renderView(body) {
    body.innerHTML = '';
    if (this.view === 'dia') this.renderDia(body);
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

      const day = document.createElement('div');
      day.className = `week-day ${isToday ? 'today' : ''}`;
      day.innerHTML = `
        <span class="week-day-name">${DIAS_CURTOS[i]}</span>
        <span class="week-day-num">${d.getDate()}</span>
        <div class="week-events">
          ${dayEvents.slice(0, 4).map(e => `
            <div class="week-event" style="--accent: #10b981;" data-id="${e.id}">${e.hora_inicio || ''} ${e.titulo || e.nome || ''}</div>
          `).join('')}
          ${dayEvents.length > 4 ? `<div style="font-size:10px;color:var(--text-muted);">+${dayEvents.length - 4} mais</div>` : ''}
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

  async renderDia(body) {
    const dateStr = this.selectedDate || formatarDataISO(new Date());
    const eventos = await this.loadDia(dateStr);

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

    const dia = document.createElement('div');
    dia.className = 'dia-view';
    if (eventos.length === 0) {
      dia.innerHTML = '<div class="empty-state"><div class="empty-state-icon">\uD83D\uDCC5</div><div class="empty-state-text">Nenhum evento neste dia</div></div>';
    } else {
      eventos.forEach(e => {
        const item = document.createElement('div');
        item.className = 'dia-event-item';
        item.innerHTML = `
          <span class="dia-event-time">${e.hora_inicio || ''} - ${e.hora_fim || ''}</span>
          <span class="dia-event-title">${e.titulo || e.nome || '—'}</span>
        `;
        item.addEventListener('click', () => this.openEventoModal(e));
        dia.appendChild(item);
      });
    }
    body.appendChild(dia);
  }

  openEventoModal(evento = null) {
    const isEdit = !!evento;
    const content = document.createElement('div');
    content.innerHTML = `
      <div class="form-group">
        <label class="form-label">Título</label>
        <input class="form-input" id="ev-titulo" value="${isEdit ? (evento.titulo || '') : ''}" placeholder="Ex: Reunião equipe">
      </div>
      <div class="form-group">
        <label class="form-label">Descrição</label>
        <textarea class="form-textarea" id="ev-desc">${isEdit ? (evento.descricao || '') : ''}</textarea>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Data</label>
          <input class="form-input" id="ev-data" type="date" value="${isEdit ? (evento.data || evento.data_inicio ? formatarDataISO(evento.data || evento.data_inicio) : '') : (this.selectedDate || formatarDataISO(new Date()))}">
        </div>
        <div class="form-group">
          <label class="form-label">Hora início</label>
          <input class="form-input" id="ev-hora-ini" type="time" value="${isEdit ? (evento.hora_inicio || '') : ''}">
        </div>
        <div class="form-group">
          <label class="form-label">Hora fim</label>
          <input class="form-input" id="ev-hora-fim" type="time" value="${isEdit ? (evento.hora_fim || '') : ''}">
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
        titulo: content.querySelector('#ev-titulo').value,
        descricao: content.querySelector('#ev-desc').value || null,
        data: content.querySelector('#ev-data').value,
        data_inicio: content.querySelector('#ev-data').value,
        hora_inicio: content.querySelector('#ev-hora-ini').value || null,
        hora_fim: content.querySelector('#ev-hora-fim').value || null,
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
