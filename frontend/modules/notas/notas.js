import { get, post, put, del } from '../../utils/api.js';
import { showModal } from '../../components/modal/modal.js';
import { toast } from '../../components/toast/toast.js';
import { confirm } from '../../components/confirm/confirm.js';
import { tempoRelativo } from '../../utils/formatDate.js';
import { debounce } from '../../utils/debounce.js';
import { escapeHtml } from '../../utils/helpers.js';

export class NotasModule {
  constructor() {
    this.notas = [];
    this.cadernos = [];
    this.cadernoAtivo = null;
    this.busca = '';
    this.notaAtiva = null;
  }

  async render(container) {
    container.innerHTML = '';

    const header = document.createElement('header');
    header.className = 'module-header';
    header.innerHTML = `
      <div class="module-header-left">
        <span class="module-header-icon" style="color: #ec4899;">\uD83D\uDCDD</span>
        <h2 class="module-header-title">Notas</h2>
      </div>
      <div class="section-actions">
        <button class="btn-primary" style="--accent: #ec4899;" id="notas-nova">+ Nova nota</button>
      </div>
    `;
    container.appendChild(header);

    const body = document.createElement('div');
    body.className = 'module-body';
    body.id = 'notas-body';
    container.appendChild(body);

    header.querySelector('#notas-nova').addEventListener('click', () => this.openNotaModal());

    await this.loadData();
    this.renderNotas(body);
  }

  async loadData() {
    try {
      const [notas, cadernos] = await Promise.all([
        get('/notas/').catch(() => []),
        get('/notas/cadernos').catch(() => []),
      ]);
      this.notas = notas.dados || notas.notas || notas || [];
      this.cadernos = cadernos.cadernos || cadernos || [];
    } catch (err) {
      toast.error('Erro ao carregar notas');
    }
  }

  renderNotas(body) {
    body.innerHTML = '';

    const searchBar = document.createElement('div');
    searchBar.className = 'search-bar';
    searchBar.innerHTML = `
      <span class="search-icon">\uD83D\uDD0D</span>
      <input type="text" class="search-input" id="notas-busca" placeholder="Buscar notas..." value="${this.busca}">
    `;
    body.appendChild(searchBar);

    const debouncedSearch = debounce((val) => {
      this.busca = val;
      this.renderNotasList(body);
    }, 300);
    searchBar.querySelector('#notas-busca').addEventListener('input', (e) => debouncedSearch(e.target.value));

    if ((this.cadernos || []).length > 0) {
      const cadernoSection = document.createElement('div');
      cadernoSection.className = 'caderno-section';
      cadernoSection.innerHTML = `
        <div class="caderno-header" id="caderno-toggle">
          <span class="caderno-name">\uD83D\uDCDC Cadernos</span>
          <span class="caderno-count">${this.cadernos.length}</span>
        </div>
        <div class="categorias-list">
          ${(this.cadernos || []).map(c => `
            <span class="category-chip" data-caderno="${c.id}" style="cursor:pointer;background:rgba(236,72,153,0.1);color:var(--accent-notas-bright);">${c.nome || 'Sem nome'}</span>
          `).join('')}
        </div>
      `;
      body.appendChild(cadernoSection);

      cadernoSection.querySelectorAll('.category-chip[data-caderno]').forEach(chip => {
        chip.addEventListener('click', () => {
          this.cadernoAtivo = parseInt(chip.dataset.caderno);
          this.renderNotasList(body);
        });
      });
    }

    const listDiv = document.createElement('div');
    listDiv.id = 'notas-grid-container';
    body.appendChild(listDiv);

    this.renderNotasList(body);
  }

  renderNotasList(body) {
    const container = body.querySelector('#notas-grid-container') || body;
    container.innerHTML = '';

    const grid = document.createElement('div');
    grid.className = 'notes-grid';

    let notas = this.notas || [];
    if (this.busca) {
      const termo = this.busca.toLowerCase();
      notas = notas.filter(n =>
        (n.titulo || '').toLowerCase().includes(termo) ||
        (n.conteudo || '').toLowerCase().includes(termo)
      );
    }
    if (this.cadernoAtivo) {
      notas = notas.filter(n => n.caderno_id === this.cadernoAtivo);
    }

    const fixadas = notas.filter(n => n.fixada === 1);
    const outras = notas.filter(n => n.fixada !== 1);
    const ordenadas = [...fixadas, ...outras];

    if (ordenadas.length === 0) {
      grid.innerHTML = '<div class="empty-state"><div class="empty-state-icon">\uD83D\uDCDD</div><div class="empty-state-text">Nenhuma nota</div></div>';
    } else {
      ordenadas.forEach(n => {
        const card = document.createElement('div');
        card.className = `note-card ${n.fixada === 1 ? 'pinned' : ''}`;
        card.innerHTML = `
          ${n.fixada === 1 ? '<span class="note-pin">\uD83D\uDCCC</span>' : ''}
          <h4 class="note-title">${escapeHtml(n.titulo || 'Sem título')}</h4>
          <p class="note-preview">${escapeHtml(n.conteudo || '').substring(0, 150)}</p>
          <span class="note-date">${n.atualizado_em ? tempoRelativo(n.atualizado_em) : (n.criado_em ? tempoRelativo(n.criado_em) : '')}</span>
        `;
        card.addEventListener('click', () => this.openNotaEditor(n));
        grid.appendChild(card);
      });
    }
    container.appendChild(grid);
  }

  openNotaModal(nota = null) {
    const isEdit = !!nota;
    const content = document.createElement('div');
    content.innerHTML = `
      <div class="form-group">
        <label class="form-label">Título</label>
        <input class="form-input" id="n-titulo" value="${isEdit ? (nota.titulo || '') : ''}" placeholder="Título da nota">
      </div>
      <div class="form-group">
        <label class="form-label">Conteúdo</label>
        <textarea class="form-textarea" id="n-conteudo" style="min-height:200px;">${isEdit ? (nota.conteudo || '') : ''}</textarea>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Caderno</label>
          <select class="form-select" id="n-caderno">
            <option value="">Sem caderno</option>
            ${(this.cadernos || []).map(c => `<option value="${c.id}" ${isEdit && nota.caderno_id == c.id ? 'selected' : ''}>${c.nome}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Projeto</label>
          <select class="form-select" id="n-projeto">
            <option value="">Nenhum</option>
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Fixada</label>
          <select class="form-select" id="n-fixada">
            <option value="0" ${!isEdit || nota.fixada !== 1 ? 'selected' : ''}>Não</option>
            <option value="1" ${isEdit && nota.fixada === 1 ? 'selected' : ''}>Sim</option>
          </select>
        </div>
      </div>
      <div class="modal-actions">
        ${isEdit ? '<button class="btn-danger n-delete">Excluir</button>' : ''}
        <button class="btn-ghost n-cancel">Cancelar</button>
        <button class="btn-primary n-save" style="--accent:#ec4899;">Salvar</button>
      </div>
    `;

    const { close } = showModal(content, { title: isEdit ? 'Editar nota' : 'Nova nota' });

    get('/projetos/').then(projetos => {
      const sel = content.querySelector('#n-projeto');
      if (!sel) return;
      const list = Array.isArray(projetos) ? projetos : (projetos.projetos || []);
      list.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.id;
        opt.textContent = p.nome;
        if (isEdit && nota.projeto_id == p.id) opt.selected = true;
        sel.appendChild(opt);
      });
    }).catch(() => {});

    content.querySelector('.n-cancel').addEventListener('click', close);
    content.querySelector('.n-save').addEventListener('click', async () => {
      const data = {
        titulo: content.querySelector('#n-titulo').value,
        conteudo: content.querySelector('#n-conteudo').value,
        caderno_id: parseInt(content.querySelector('#n-caderno').value) || null,
        projeto_id: parseInt(content.querySelector('#n-projeto').value) || null,
        fixada: parseInt(content.querySelector('#n-fixada').value),
      };
      try {
        if (isEdit) await put(`/notas/${nota.id}`, data);
        else await post('/notas/', data);
        toast.success(isEdit ? 'Nota atualizada' : 'Nota criada');
        close();
        await this.loadData();
        this.renderNotas(document.getElementById('notas-body'));
      } catch (err) { toast.error(err.message); }
    });

    if (isEdit) {
      content.querySelector('.n-delete')?.addEventListener('click', async () => {
        const ok = await confirm({ title: 'Excluir nota?', message: 'Esta ação não pode ser desfeita.', danger: true, confirmText: 'Excluir' });
        if (ok) {
          try {
            await del(`/notas/${nota.id}`);
            toast.success('Nota excluída');
            close();
            await this.loadData();
            this.renderNotas(document.getElementById('notas-body'));
          } catch (err) { toast.error(err.message); }
        }
      });
    }
  }

  openNotaEditor(nota) {
    const body = document.getElementById('notas-body');
    body.innerHTML = '';

    const backBtn = document.createElement('button');
    backBtn.className = 'btn-ghost';
    backBtn.textContent = '\u2190 Voltar';
    backBtn.style.marginBottom = '16px';
    backBtn.addEventListener('click', () => {
      this.notaAtiva = null;
      this.renderNotas(body);
    });
    body.appendChild(backBtn);

    const editor = document.createElement('div');
    editor.className = 'note-editor';
    editor.innerHTML = `
      <input class="note-editor-title" id="ne-titulo" value="${escapeHtml(nota.titulo || '')}">
      <textarea class="note-editor-content" id="ne-conteudo">${nota.conteudo || ''}</textarea>
      <div style="margin-top:16px;display:flex;gap:8px;">
        <button class="btn-primary ne-save" style="--accent:#ec4899;">Salvar</button>
        <button class="btn-danger ne-delete">Excluir</button>
      </div>
    `;
    body.appendChild(editor);

    this.notaAtiva = nota;

    editor.querySelector('.ne-save').addEventListener('click', async () => {
      try {
        await put(`/notas/${nota.id}`, {
          titulo: editor.querySelector('#ne-titulo').value,
          conteudo: editor.querySelector('#ne-conteudo').value,
          fixada: nota.fixada || 0,
          projeto_id: nota.projeto_id || null,
        });
        toast.success('Nota salva');
      } catch (err) { toast.error(err.message); }
    });

    editor.querySelector('.ne-delete').addEventListener('click', async () => {
      const ok = await confirm({ title: 'Excluir nota?', message: 'Esta ação não pode ser desfeita.', danger: true, confirmText: 'Excluir' });
      if (ok) {
        try {
          await del(`/notas/${nota.id}`);
          toast.success('Nota excluída');
          this.notaAtiva = null;
          await this.loadData();
          this.renderNotas(body);
        } catch (err) { toast.error(err.message); }
      }
    });
  }
}
