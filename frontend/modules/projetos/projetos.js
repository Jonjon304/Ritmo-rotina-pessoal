import { get, post, put, del } from '../../utils/api.js';
import { showModal } from '../../components/modal/modal.js';
import { toast } from '../../components/toast/toast.js';
import { confirm } from '../../components/confirm/confirm.js';
import { formatarDataCurta } from '../../utils/formatDate.js';
import { formatarMoeda } from '../../utils/formatCurrency.js';

export class ProjetosModule {
  constructor() {
    this.projetos = [];
    this.projetoAtivo = null;
    this.abaAtiva = 'tarefas';
  }

  async render(container) {
    container.innerHTML = '';

    if (this.projetoAtivo) {
      await this.renderDetail(container);
      return;
    }

    const header = document.createElement('header');
    header.className = 'module-header';
    header.innerHTML = `
      <div class="module-header-left">
        <span class="module-header-icon" style="color: #f97316;">\uD83D\uDEE0\uFE0F</span>
        <h2 class="module-header-title">Projetos</h2>
      </div>
      <div class="section-actions">
        <button class="btn-primary" style="--accent: #f97316;" id="proj-novo">+ Novo projeto</button>
      </div>
    `;
    container.appendChild(header);

    const body = document.createElement('div');
    body.className = 'module-body';
    body.id = 'projetos-body';
    container.appendChild(body);

    header.querySelector('#proj-novo').addEventListener('click', () => this.openProjetoModal());

    await this.loadData();
    this.renderList(body);
  }

  async loadData() {
    try {
      const data = await get('/projetos/').catch(() => []);
      this.projetos = data.projetos || data || [];
    } catch (err) {
      toast.error('Erro ao carregar projetos');
    }
  }

  renderList(body) {
    body.innerHTML = '';

    const grid = document.createElement('div');
    grid.className = 'projetos-grid';

    if ((this.projetos || []).length === 0) {
      grid.innerHTML = '<div class="empty-state"><div class="empty-state-icon">\uD83D\uDEE0\uFE0F</div><div class="empty-state-text">Nenhum projeto</div></div>';
    } else {
      (this.projetos || []).forEach(p => {
        const pct = p.progresso || 0;
        const card = document.createElement('div');
        card.className = 'projeto-card';
        card.innerHTML = `
          <div class="projeto-card-header">
            <span class="projeto-card-icon">\uD83D\uDEE0\uFE0F</span>
            <span class="projeto-card-name">${p.nome || p.titulo || '—'}</span>
          </div>
          <p class="projeto-card-desc">${p.descricao || 'Sem descrição'}</p>
          <div class="projeto-progress">
            <div class="projeto-progress-bar">
              <div class="projeto-progress-fill" style="width:${pct}%;"></div>
            </div>
          </div>
          <div class="projeto-card-meta">
            <span>${pct}% completo</span>
          </div>
        `;
        card.addEventListener('click', async () => {
          this.projetoAtivo = p;
          const mainContainer = document.getElementById('module-page');
          mainContainer.innerHTML = '';
          await this.render(mainContainer);
        });
        grid.appendChild(card);
      });
    }
    body.appendChild(grid);
  }

  async renderDetail(container) {
    const p = this.projetoAtivo;

    const header = document.createElement('header');
    header.className = 'module-header';
    header.innerHTML = `
      <div class="module-header-left">
        <button class="btn-ghost" id="proj-back">\u2190</button>
        <span class="module-header-icon" style="color: #f97316;">\uD83D\uDEE0\uFE0F</span>
        <h2 class="module-header-title">${p.nome || p.titulo || '—'}</h2>
      </div>
      <div class="section-actions">
        <button class="btn-ghost" id="proj-edit">Editar</button>
      </div>
    `;
    container.appendChild(header);

    header.querySelector('#proj-back').addEventListener('click', () => {
      this.projetoAtivo = null;
      const mainContainer = document.getElementById('module-page');
      mainContainer.innerHTML = '';
      this.render(mainContainer);
    });
    header.querySelector('#proj-edit').addEventListener('click', () => this.openProjetoModal(p));

    const desc = document.createElement('p');
    desc.className = 'projeto-detail-desc';
    desc.textContent = p.descricao || '';
    container.appendChild(desc);

    const abas = document.createElement('div');
    abas.className = 'projeto-abas';
    abas.innerHTML = `
      <button class="projeto-aba ${this.abaAtiva === 'tarefas' ? 'active' : ''}" data-aba="tarefas">Tarefas</button>
      <button class="projeto-aba ${this.abaAtiva === 'notas' ? 'active' : ''}" data-aba="notas">Notas</button>
      <button class="projeto-aba ${this.abaAtiva === 'metas' ? 'active' : ''}" data-aba="metas">Metas</button>
      <button class="projeto-aba ${this.abaAtiva === 'links' ? 'active' : ''}" data-aba="links">Links</button>
    `;
    container.appendChild(abas);

    const body = document.createElement('div');
    body.className = 'module-body projeto-detail';
    body.id = 'projeto-detail-body';
    container.appendChild(body);

    abas.querySelectorAll('.projeto-aba').forEach(btn => {
      btn.addEventListener('click', () => {
        abas.querySelectorAll('.projeto-aba').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.abaAtiva = btn.dataset.aba;
        this.renderDetailTab(body);
      });
    });

    this.renderDetailTab(body);
  }

  async renderDetailTab(body) {
    body.innerHTML = '';
    const p = this.projetoAtivo;

    switch (this.abaAtiva) {
      case 'tarefas': {
        try {
          const data = await get(`/projetos/${p.id}/tarefas`).catch(() => []);
          const tarefas = data.tarefas || data || [];
          if (tarefas.length === 0) {
            body.innerHTML = '<div class="empty-state"><div class="empty-state-icon">\uD83D\uDCCB</div><div class="empty-state-text">Nenhuma tarefa neste projeto</div></div>';
          } else {
            const list = document.createElement('div');
            list.className = 'task-list';
            tarefas.forEach(t => {
              const item = document.createElement('div');
              item.className = `task-item ${t.status === 'concluida' ? 'completed' : ''}`;
              item.innerHTML = `
                <span class="task-checkmark" style="${t.status === 'concluida' ? 'background:var(--success);border-color:var(--success);' : ''}">${t.status === 'concluida' ? '\u2713' : ''}</span>
                <span class="task-name">${t.titulo || t.nome || '—'}</span>
                <span class="badge badge-${{ alta: 'high', media: 'medium', baixa: 'low' }[t.prioridade] || 'medium'}">${t.prioridade || ''}</span>
              `;
              list.appendChild(item);
            });
            body.appendChild(list);
          }
        } catch {
          body.innerHTML = '<div class="empty-state"><div class="empty-state-icon">\u2753</div><div class="empty-state-text">Erro ao carregar tarefas</div></div>';
        }
        break;
      }
      case 'notas': {
        try {
          const data = await get(`/projetos/${p.id}/notas`).catch(() => []);
          const notas = data.notas || data || [];
          if (notas.length === 0) {
            body.innerHTML = '<div class="empty-state"><div class="empty-state-icon">\uD83D\uDCDD</div><div class="empty-state-text">Nenhuma nota neste projeto</div></div>';
          } else {
            const grid = document.createElement('div');
            grid.className = 'notes-grid';
            notas.forEach(n => {
              const card = document.createElement('div');
              card.className = 'note-card';
              card.innerHTML = `
                <h4 class="note-title">${n.titulo || 'Sem título'}</h4>
                <p class="note-preview">${(n.conteudo || '').substring(0, 150)}</p>
              `;
              grid.appendChild(card);
            });
            body.appendChild(grid);
          }
        } catch {
          body.innerHTML = '<div class="empty-state"><div class="empty-state-icon">\u2753</div><div class="empty-state-text">Erro ao carregar notas</div></div>';
        }
        break;
      }
      case 'metas': {
        try {
          const data = await get(`/projetos/${p.id}/metas`).catch(() => []);
          const metas = data.metas || data || [];
          if (metas.length === 0) {
            body.innerHTML = '<div class="empty-state"><div class="empty-state-icon">\uD83C\uDFAF</div><div class="empty-state-text">Nenhuma meta neste projeto</div></div>';
          } else {
            const grid = document.createElement('div');
            grid.className = 'goals-grid';
            metas.forEach(m => {
              const pct = m.valor_alvo ? Math.min(100, Math.round(((m.valor_atual || 0) / m.valor_alvo) * 100)) : 0;
              const card = document.createElement('div');
              card.className = 'goal-card';
              card.innerHTML = `
                <h4 class="goal-name">${m.titulo || m.nome || '—'}</h4>
                <div class="goal-progress"><div class="goal-bar" style="--progress: ${pct}%; --accent: #f59e0b;"></div></div>
                <span class="goal-current mono">${pct}%</span>
              `;
              grid.appendChild(card);
            });
            body.appendChild(grid);
          }
        } catch {
          body.innerHTML = '<div class="empty-state"><div class="empty-state-icon">\u2753</div><div class="empty-state-text">Erro ao carregar metas</div></div>';
        }
        break;
      }
      case 'links': {
        try {
          const data = await get(`/projetos/${p.id}/links`).catch(() => []);
          const links = data.links || data || [];
          const addBtn = document.createElement('button');
          addBtn.className = 'btn-ghost';
          addBtn.textContent = '+ Adicionar link';
          addBtn.style.marginBottom = '12px';
          addBtn.addEventListener('click', () => this.openLinkModal(p));
          body.appendChild(addBtn);

          if (links.length === 0) {
            body.innerHTML += '<div class="empty-state"><div class="empty-state-icon">\uD83D\uDD17</div><div class="empty-state-text">Nenhum link</div></div>';
          } else {
            links.forEach(l => {
              const item = document.createElement('div');
              item.className = 'link-item';
              item.innerHTML = `
                <span class="link-item-icon">\uD83D\uDD17</span>
                <div>
                  <div class="link-item-text">${l.nome || l.texto || '—'}</div>
                  <div class="link-item-url">${l.url || ''}</div>
                </div>
                <button class="btn-icon link-delete" data-id="${l.id}">\u2717</button>
              `;
              item.querySelector('.link-delete')?.addEventListener('click', async (e) => {
                e.stopPropagation();
                try {
                  await del(`/projetos/${p.id}/links/${l.id}`);
                  toast.success('Link removido');
                  this.renderDetailTab(body);
                } catch (err) { toast.error(err.message); }
              });
              body.appendChild(item);
            });
          }
        } catch {
          body.innerHTML = '<div class="empty-state"><div class="empty-state-icon">\u2753</div><div class="empty-state-text">Erro ao carregar links</div></div>';
        }
        break;
      }
    }
  }

  openProjetoModal(projeto = null) {
    const isEdit = !!projeto;
    const content = document.createElement('div');
    content.innerHTML = `
      <div class="form-group">
        <label class="form-label">Nome</label>
        <input class="form-input" id="p-nome" value="${isEdit ? (projeto.nome || projeto.titulo || '') : ''}" placeholder="Ex: MyFinance">
      </div>
      <div class="form-group">
        <label class="form-label">Descrição</label>
        <textarea class="form-textarea" id="p-desc">${isEdit ? (projeto.descricao || '') : ''}</textarea>
      </div>
      <div class="modal-actions">
        ${isEdit ? '<button class="btn-danger p-delete">Excluir</button>' : ''}
        <button class="btn-ghost p-cancel">Cancelar</button>
        <button class="btn-primary p-save" style="--accent:#f97316;">Salvar</button>
      </div>
    `;

    const { close } = showModal(content, { title: isEdit ? 'Editar projeto' : 'Novo projeto' });

    content.querySelector('.p-cancel').addEventListener('click', close);
    content.querySelector('.p-save').addEventListener('click', async () => {
      const data = {
        nome: content.querySelector('#p-nome').value,
        descricao: content.querySelector('#p-desc').value || null,
      };
      try {
        if (isEdit) await put(`/projetos/${projeto.id}`, data);
        else await post('/projetos/', data);
        toast.success(isEdit ? 'Projeto atualizado' : 'Projeto criado');
        close();
        await this.loadData();
        const mainContainer = document.getElementById('module-page');
        mainContainer.innerHTML = '';
        this.render(mainContainer);
      } catch (err) { toast.error(err.message); }
    });

    if (isEdit) {
      content.querySelector('.p-delete')?.addEventListener('click', async () => {
        const ok = await confirm({ title: 'Excluir projeto?', message: 'Itens vinculados NÃO serão excluídos.', danger: true, confirmText: 'Excluir' });
        if (ok) {
          try {
            await del(`/projetos/${projeto.id}`);
            toast.success('Projeto excluído');
            close();
            this.projetoAtivo = null;
            await this.loadData();
            const mainContainer = document.getElementById('module-page');
            mainContainer.innerHTML = '';
            this.render(mainContainer);
          } catch (err) { toast.error(err.message); }
        }
      });
    }
  }

  openLinkModal(projeto) {
    const content = document.createElement('div');
    content.innerHTML = `
      <div class="form-group">
        <label class="form-label">Nome</label>
        <input class="form-input" id="l-nome" placeholder="Ex: Documentação">
      </div>
      <div class="form-group">
        <label class="form-label">URL</label>
        <input class="form-input" id="l-url" type="url" placeholder="https://...">
      </div>
      <div class="modal-actions">
        <button class="btn-ghost l-cancel">Cancelar</button>
        <button class="btn-primary l-save" style="--accent:#f97316;">Salvar</button>
      </div>
    `;

    const { close } = showModal(content, { title: 'Novo link' });

    content.querySelector('.l-cancel').addEventListener('click', close);
    content.querySelector('.l-save').addEventListener('click', async () => {
      const data = {
        nome: content.querySelector('#l-nome').value,
        url: content.querySelector('#l-url').value,
      };
      try {
        await post(`/projetos/${projeto.id}/links`, data);
        toast.success('Link adicionado');
        close();
        this.renderDetailTab(document.getElementById('projeto-detail-body'));
      } catch (err) { toast.error(err.message); }
    });
  }
}
