import { get, post, put, del } from '../../utils/api.js';
import { showModal } from '../../components/modal/modal.js';
import { toast } from '../../components/toast/toast.js';
import { confirm } from '../../components/confirm/confirm.js';
import { formatarDataCurta, formatarDataISO } from '../../utils/formatDate.js';
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
        const addBtn = document.createElement('button');
        addBtn.className = 'btn-ghost';
        addBtn.textContent = '+ Vincular tarefa';
        addBtn.style.marginBottom = '12px';
        addBtn.addEventListener('click', () => this.openVincularModal(p, 'tarefas', body));
        body.appendChild(addBtn);

        try {
          const data = await get(`/projetos/${p.id}/tarefas`).catch(() => []);
          const tarefas = data.tarefas || data || [];
          if (tarefas.length === 0) {
            const emptyEl = document.createElement('div');
            emptyEl.className = 'empty-state';
            emptyEl.innerHTML = '<div class="empty-state-icon">\uD83D\uDCCB</div><div class="empty-state-text">Nenhuma tarefa neste projeto</div>';
            body.appendChild(emptyEl);
          } else {
            const list = document.createElement('div');
            list.className = 'task-list';
            tarefas.forEach(t => {
              const item = document.createElement('div');
              item.className = `task-item ${t.status === 'concluida' ? 'completed' : ''}`;
              item.innerHTML = `
                    <span class="task-checkmark" style="${t.status === 'concluida' ? 'background:var(--success);border-color:var(--success);' : ''}">${t.status === 'concluida' ? '\u2713' : ''}</span>
                    <span class="task-name">${t.nome || '—'}</span>
                    <span class="badge badge-${{ alta: 'high', media: 'medium', baixa: 'low' }[t.prioridade] || 'medium'}">${t.prioridade || ''}</span>
                    <button class="btn-icon unlink-task" data-id="${t.id}" title="Desvincular">\u2717</button>
                  `;
              // Click on the item opens detail modal (except unlink button)
              item.addEventListener('click', (e) => {
                if (e.target.closest('.unlink-task')) return;
                this.openTaskDetail(t);
              });

              // Unlink handler
              item.querySelector('.unlink-task')?.addEventListener('click', async (e) => {
                e.stopPropagation();
                try {
                  await put(`/tarefas/${t.id}`, { projeto_id: null });
                  toast.success('Tarefa desvinculada');
                  this.renderDetailTab(body);
                } catch (err) { toast.error(err.message); }
              });

              list.appendChild(item);
            });
            body.appendChild(list);
          }
        } catch {
          const errEl = document.createElement('div');
          errEl.className = 'empty-state';
          errEl.innerHTML = '<div class="empty-state-icon">\u2753</div><div class="empty-state-text">Erro ao carregar tarefas</div>';
          body.appendChild(errEl);
        }
        break;
      }
      case 'notas': {
        const addBtn = document.createElement('button');
        addBtn.className = 'btn-ghost';
        addBtn.textContent = '+ Vincular nota';
        addBtn.style.marginBottom = '12px';
        addBtn.addEventListener('click', () => this.openVincularModal(p, 'notas', body));
        body.appendChild(addBtn);

        try {
          const data = await get(`/projetos/${p.id}/notas`).catch(() => []);
          const notas = data.notas || data.dados || data || [];
          if (notas.length === 0) {
            const emptyEl = document.createElement('div');
            emptyEl.className = 'empty-state';
            emptyEl.innerHTML = '<div class="empty-state-icon">\uD83D\uDCDD</div><div class="empty-state-text">Nenhuma nota neste projeto</div>';
            body.appendChild(emptyEl);
          } else {
            const grid = document.createElement('div');
            grid.className = 'notes-grid';
            notas.forEach(n => {
              const card = document.createElement('div');
              card.className = 'note-card';
              card.innerHTML = `
                <h4 class="note-title">${n.titulo || 'Sem título'}</h4>
                <p class="note-preview">${(n.conteudo || '').substring(0, 150)}</p>
                <button class="btn-icon unlink-note" data-id="${n.id}" title="Desvincular">\u2717</button>
              `;

              // Click on card opens detail modal (except unlink button)
              card.addEventListener('click', (e) => {
                if (e.target.closest('.unlink-note')) return;
                this.openNoteDetail(n);
              });

              // Unlink handler
              card.querySelector('.unlink-note')?.addEventListener('click', async (e) => {
                e.stopPropagation();
                try {
                  await put(`/notas/${n.id}`, { projeto_id: null });
                  toast.success('Nota desvinculada');
                  this.renderDetailTab(body);
                } catch (err) { toast.error(err.message); }
              });

              grid.appendChild(card);
            });
            body.appendChild(grid);
          }
        } catch {
          const errEl = document.createElement('div');
          errEl.className = 'empty-state';
          errEl.innerHTML = '<div class="empty-state-icon">\u2753</div><div class="empty-state-text">Erro ao carregar notas</div>';
          body.appendChild(errEl);
        }
        break;
      }
      case 'metas': {
        const addBtn = document.createElement('button');
        addBtn.className = 'btn-ghost';
        addBtn.textContent = '+ Vincular meta';
        addBtn.style.marginBottom = '12px';
        addBtn.addEventListener('click', () => this.openVincularModal(p, 'metas', body));
        body.appendChild(addBtn);

        try {
          const data = await get(`/projetos/${p.id}/metas`).catch(() => []);
          const metas = data.metas || data || [];
          if (metas.length === 0) {
            const emptyEl = document.createElement('div');
            emptyEl.className = 'empty-state';
            emptyEl.innerHTML = '<div class="empty-state-icon">\uD83C\uDFAF</div><div class="empty-state-text">Nenhuma meta neste projeto</div>';
            body.appendChild(emptyEl);
          } else {
            const grid = document.createElement('div');
            grid.className = 'goals-grid';
               metas.forEach(m => {
                 const pct = m.valor_alvo ? Math.min(100, Math.round(((m.valor_atual || 0) / m.valor_alvo) * 100)) : 0;
                 const card = document.createElement('div');
                 card.className = 'goal-card';
                 card.innerHTML = `
                   <h4 class="goal-name">${m.nome || '—'}</h4>
                   <div class="goal-progress"><div class="goal-bar" style="--progress: ${pct}%; --accent: #f59e0b;"></div></div>
                   <span class="goal-current mono">${pct}%</span>
                   <button class="btn-icon unlink-meta" data-id="${m.id}" title="Desvincular">\u2717</button>
                 `;

                 // Click on card opens detail modal (except unlink)
                 card.addEventListener('click', (e) => {
                   if (e.target.closest('.unlink-meta')) return;
                   this.openMetaDetail(m);
                 });

                 // Unlink handler
                 card.querySelector('.unlink-meta')?.addEventListener('click', async (e) => {
                   e.stopPropagation();
                   try {
                     await put(`/metas/${m.id}`, { projeto_id: null });
                     toast.success('Meta desvinculada');
                     this.renderDetailTab(body);
                   } catch (err) { toast.error(err.message); }
                 });

                 grid.appendChild(card);
               });
            body.appendChild(grid);
          }
        } catch {
          const errEl = document.createElement('div');
          errEl.className = 'empty-state';
          errEl.innerHTML = '<div class="empty-state-icon">\u2753</div><div class="empty-state-text">Erro ao carregar metas</div>';
          body.appendChild(errEl);
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
            const emptyEl = document.createElement('div');
            emptyEl.className = 'empty-state';
            emptyEl.innerHTML = '<div class="empty-state-icon">\uD83D\uDD17</div><div class="empty-state-text">Nenhum link</div>';
            body.appendChild(emptyEl);
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
          const errEl = document.createElement('div');
          errEl.className = 'empty-state';
          errEl.innerHTML = '<div class="empty-state-icon">\u2753</div><div class="empty-state-text">Erro ao carregar links</div>';
          body.appendChild(errEl);
        }
        break;
      }
    }
  }

  async openVincularModal(projeto, tipo, body) {
    const content = document.createElement('div');
    content.innerHTML = '<p style="color:var(--text-muted);">Buscando itens sem projeto...</p>';
    const { close } = showModal(content, { title: `Vincular ${tipo === 'tarefas' ? 'tarefa' : tipo === 'notas' ? 'nota' : 'meta'}` });

    try {
      let itens = [];
      if (tipo === 'tarefas') {
        const data = await get('/tarefas/');
        const all = data.dados || data.tarefas || data || [];
        itens = all.filter(i => !i.projeto_id).map(i => ({ id: i.id, nome: i.nome, sub: i.status }));
      } else if (tipo === 'notas') {
        const data = await get('/notas/');
        const all = data.dados || data.notas || data || [];
        itens = all.filter(i => !i.projeto_id).map(i => ({ id: i.id, nome: i.titulo, sub: '' }));
      } else if (tipo === 'metas') {
        const data = await get('/metas/');
        const all = Array.isArray(data) ? data : (data.metas || data.dados || []);
        itens = all.filter(i => !i.projeto_id).map(i => ({ id: i.id, nome: i.nome, sub: i.status || '' }));
      }

      if (itens.length === 0) {
        content.innerHTML = '<div class="empty-state"><div class="empty-state-text">Nenhum item disponível para vincular</div></div><div class="modal-actions"><button class="btn-ghost v-cancel">Fechar</button></div>';
        content.querySelector('.v-cancel').addEventListener('click', close);
        return;
      }

      content.innerHTML = `
        <div class="vincular-list">
          ${itens.map(i => `
            <label class="vincular-item" style="display:flex;align-items:center;gap:8px;padding:8px;border-radius:8px;cursor:pointer;border:1px solid var(--border);">
              <input type="radio" name="vincular" value="${i.id}">
              <span>${i.nome || '—'}</span>
              ${i.sub ? `<span class="badge">${i.sub}</span>` : ''}
            </label>
          `).join('')}
        </div>
        <div class="modal-actions">
          <button class="btn-ghost v-cancel">Cancelar</button>
          <button class="btn-primary v-save" style="--accent:#f97316;">Vincular</button>
        </div>
      `;

      content.querySelector('.v-cancel').addEventListener('click', close);
      content.querySelector('.v-save').addEventListener('click', async () => {
        const selected = content.querySelector('input[name="vincular"]:checked');
        if (!selected) { toast.error('Selecione um item'); return; }
        const id = selected.value;
        try {
          if (tipo === 'tarefas') await put(`/tarefas/${id}`, { projeto_id: projeto.id });
          else if (tipo === 'notas') await put(`/notas/${id}`, { projeto_id: projeto.id });
          else if (tipo === 'metas') await put(`/metas/${id}`, { projeto_id: projeto.id });
          toast.success('Item vinculado');
          close();
          this.renderDetailTab(body);
        } catch (err) { toast.error(err.message); }
      });
    } catch (err) {
      content.innerHTML = `<div class="empty-state"><div class="empty-state-text">Erro: ${err.message}</div></div><div class="modal-actions"><button class="btn-ghost v-cancel">Fechar</button></div>`;
      content.querySelector('.v-cancel').addEventListener('click', close);
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

  openTaskDetail(tarefa) {
    const content = document.createElement('div');
    content.innerHTML = `
      <div class="form-group">
        <label class="form-label">Título</label>
        <input class="form-input" id="tk-titulo" value="${tarefa.nome || ''}" placeholder="Ex: Revisar orçamento">
      </div>
      <div class="form-group">
        <label class="form-label">Descrição</label>
        <textarea class="form-textarea" id="tk-desc" placeholder="Opcional">${tarefa.descricao || ''}</textarea>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Prioridade</label>
          <select class="form-select" id="tk-prio">
            <option value="baixa" ${tarefa.prioridade === 'baixa' ? 'selected' : ''}>Baixa</option>
            <option value="media" ${tarefa.prioridade === 'media' ? 'selected' : ''}>Média</option>
            <option value="alta" ${tarefa.prioridade === 'alta' ? 'selected' : ''}>Alta</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Vencimento</label>
          <input class="form-input" id="tk-data" type="date" value="${tarefa.vencimento ? formatarDataISO(tarefa.vencimento) : ''}">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Status</label>
          <select class="form-select" id="tk-status">
            <option value="afazer" ${tarefa.status === 'afazer' ? 'selected' : ''}>Pendente</option>
            <option value="em_progresso" ${tarefa.status === 'em_progresso' ? 'selected' : ''}>Em progresso</option>
            <option value="concluida" ${tarefa.status === 'concluida' ? 'selected' : ''}>Concluída</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Projeto</label>
          <select class="form-select" id="tk-projeto">
            <option value="">Nenhum</option>
          </select>
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn-danger tk-delete">Excluir</button>
        <button class="btn-ghost tk-desvincular">Desvincular</button>
        <button class="btn-ghost tk-cancel">Cancelar</button>
        <button class="btn-primary tk-save" style="--accent:#3b82f6;">Salvar</button>
      </div>
    `;

    const { close } = showModal(content, { title: 'Editar tarefa' });

    get('/projetos/').then(projetos => {
      const sel = content.querySelector('#tk-projeto');
      const list = Array.isArray(projetos) ? projetos : (projetos.projetos || []);
      list.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.id;
        opt.textContent = p.nome;
        if (tarefa.projeto_id == p.id) opt.selected = true;
        sel.appendChild(opt);
      });
    }).catch(() => {});

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
        await put(`/tarefas/${tarefa.id}`, data);
        toast.success('Tarefa atualizada');
        close();
        this.renderDetailTab(document.getElementById('projeto-detail-body'));
      } catch (err) { toast.error(err.message); }
    });

    content.querySelector('.tk-desvincular').addEventListener('click', async () => {
      try {
        await put(`/tarefas/${tarefa.id}`, { projeto_id: null });
        toast.success('Tarefa desvinculada');
        close();
        this.renderDetailTab(document.getElementById('projeto-detail-body'));
      } catch (err) { toast.error(err.message); }
    });

    content.querySelector('.tk-delete').addEventListener('click', async () => {
      const ok = await confirm({ title: 'Excluir tarefa?', message: 'Esta ação não pode ser desfeita.', danger: true, confirmText: 'Excluir' });
      if (ok) {
        try {
          await del(`/tarefas/${tarefa.id}`);
          toast.success('Tarefa excluída');
          close();
          this.renderDetailTab(document.getElementById('projeto-detail-body'));
        } catch (err) { toast.error(err.message); }
      }
    });
  }

  openNoteDetail(nota) {
    const content = document.createElement('div');
    content.innerHTML = `
      <div class="form-group">
        <label class="form-label">Título</label>
        <input class="form-input" id="n-titulo" value="${nota.titulo || ''}" placeholder="Título da nota">
      </div>
      <div class="form-group">
        <label class="form-label">Conteúdo</label>
        <textarea class="form-textarea" id="n-conteudo" style="min-height:200px;">${nota.conteudo || ''}</textarea>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Caderno</label>
          <select class="form-select" id="n-caderno">
            <option value="">Nenhum</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Projeto</label>
          <select class="form-select" id="n-projeto">
            <option value="">Nenhum</option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Fixada</label>
        <select class="form-select" id="n-fixada">
          <option value="0" ${nota.fixada !== 1 ? 'selected' : ''}>Não</option>
          <option value="1" ${nota.fixada === 1 ? 'selected' : ''}>Sim</option>
        </select>
      </div>
      <div class="modal-actions">
        <button class="btn-danger n-delete">Excluir</button>
        <button class="btn-ghost n-desvincular">Desvincular</button>
        <button class="btn-ghost n-cancel">Cancelar</button>
        <button class="btn-primary n-save" style="--accent:#ec4899;">Salvar</button>
      </div>
    `;

    const { close } = showModal(content, { title: 'Editar nota' });

    get('/projetos/').then(projetos => {
      const sel = content.querySelector('#n-projeto');
      const list = Array.isArray(projetos) ? projetos : (projetos.projetos || []);
      list.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.id;
        opt.textContent = p.nome;
        if (nota.projeto_id == p.id) opt.selected = true;
        sel.appendChild(opt);
      });
    }).catch(() => {});

    get('/notas/cadernos').then(cadernos => {
      const sel = content.querySelector('#n-caderno');
      if (!sel) return;
      const list = cadernos.cadernos || cadernos || [];
      list.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = c.nome;
        if (nota.caderno_id == c.id) opt.selected = true;
        sel.appendChild(opt);
      });
    }).catch(() => {});

    content.querySelector('.n-cancel').addEventListener('click', close);
    content.querySelector('.n-save').addEventListener('click', async () => {
      const data = {
        titulo: content.querySelector('#n-titulo').value,
        conteudo: content.querySelector('#n-conteudo').value,
        caderno_id: parseInt(content.querySelector('#n-caderno')?.value) || null,
        projeto_id: parseInt(content.querySelector('#n-projeto').value) || null,
        fixada: parseInt(content.querySelector('#n-fixada').value),
      };
      try {
        await put(`/notas/${nota.id}`, data);
        toast.success('Nota atualizada');
        close();
        this.renderDetailTab(document.getElementById('projeto-detail-body'));
      } catch (err) { toast.error(err.message); }
    });

    content.querySelector('.n-desvincular').addEventListener('click', async () => {
      try {
        await put(`/notas/${nota.id}`, { projeto_id: null });
        toast.success('Nota desvinculada');
        close();
        this.renderDetailTab(document.getElementById('projeto-detail-body'));
      } catch (err) { toast.error(err.message); }
    });

    content.querySelector('.n-delete').addEventListener('click', async () => {
      const ok = await confirm({ title: 'Excluir nota?', message: 'Esta ação não pode ser desfeita.', danger: true, confirmText: 'Excluir' });
      if (ok) {
        try {
          await del(`/notas/${nota.id}`);
          toast.success('Nota excluída');
          close();
          this.renderDetailTab(document.getElementById('projeto-detail-body'));
        } catch (err) { toast.error(err.message); }
      }
    });
  }

  openMetaDetail(meta) {
    const content = document.createElement('div');
    content.innerHTML = `
      <div class="form-group">
        <label class="form-label">Nome</label>
        <input class="form-input" id="m-nome" value="${meta.nome || ''}" placeholder="Ex: Fundo de emergência">
      </div>
      <div class="form-group">
        <label class="form-label">Descrição</label>
        <textarea class="form-textarea" id="m-desc">${meta.descricao || ''}</textarea>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Tipo</label>
          <select class="form-select" id="m-tipo">
            <option value="financeira" ${meta.tipo === 'financeira' ? 'selected' : ''}>Financeira</option>
            <option value="pessoal" ${meta.tipo === 'pessoal' ? 'selected' : ''}>Pessoal</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Valor alvo</label>
          <input class="form-input" id="m-alvo" type="number" step="0.01" value="${meta.valor_alvo || ''}" placeholder="10000">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Valor atual</label>
          <input class="form-input" id="m-atual" type="number" step="0.01" value="${meta.valor_atual || 0}">
        </div>
        <div class="form-group">
          <label class="form-label">Prazo</label>
          <input class="form-input" id="m-prazo" type="date" value="${meta.data_alvo ? formatarDataISO(meta.data_alvo) : ''}">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Status</label>
          <select class="form-select" id="m-status">
            <option value="em_progresso" ${meta.status === 'em_progresso' ? 'selected' : ''}>Em progresso</option>
            <option value="concluida" ${meta.status === 'concluida' ? 'selected' : ''}>Concluída</option>
            <option value="abandonada" ${meta.status === 'abandonada' ? 'selected' : ''}>Abandonada</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Projeto</label>
          <select class="form-select" id="m-projeto">
            <option value="">Nenhum</option>
          </select>
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn-danger m-delete">Excluir</button>
        <button class="btn-ghost m-desvincular">Desvincular</button>
        <button class="btn-ghost m-cancel">Cancelar</button>
        <button class="btn-primary m-save" style="--accent:#f59e0b;">Salvar</button>
      </div>
    `;

    const { close } = showModal(content, { title: 'Editar meta' });

    get('/projetos/').then(projetos => {
      const sel = content.querySelector('#m-projeto');
      const list = Array.isArray(projetos) ? projetos : (projetos.projetos || []);
      list.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.id;
        opt.textContent = p.nome;
        if (meta.projeto_id == p.id) opt.selected = true;
        sel.appendChild(opt);
      });
    }).catch(() => {});

    content.querySelector('.m-cancel').addEventListener('click', close);
    content.querySelector('.m-save').addEventListener('click', async () => {
      const data = {
        nome: content.querySelector('#m-nome').value,
        descricao: content.querySelector('#m-desc').value || null,
        tipo: content.querySelector('#m-tipo').value,
        valor_alvo: parseFloat(content.querySelector('#m-alvo').value) || 0,
        valor_atual: parseFloat(content.querySelector('#m-atual').value) || 0,
        data_alvo: content.querySelector('#m-prazo').value || null,
        status: content.querySelector('#m-status').value,
        projeto_id: parseInt(content.querySelector('#m-projeto').value) || null,
      };
      try {
        await put(`/metas/${meta.id}`, data);
        toast.success('Meta atualizada');
        close();
        this.renderDetailTab(document.getElementById('projeto-detail-body'));
      } catch (err) { toast.error(err.message); }
    });

    content.querySelector('.m-desvincular').addEventListener('click', async () => {
      try {
        await put(`/metas/${meta.id}`, { projeto_id: null });
        toast.success('Meta desvinculada');
        close();
        this.renderDetailTab(document.getElementById('projeto-detail-body'));
      } catch (err) { toast.error(err.message); }
    });

    content.querySelector('.m-delete').addEventListener('click', async () => {
      const ok = await confirm({ title: 'Excluir meta?', message: 'Esta ação não pode ser desfeita.', danger: true, confirmText: 'Excluir' });
      if (ok) {
        try {
          await del(`/metas/${meta.id}`);
          toast.success('Meta excluída');
          close();
          this.renderDetailTab(document.getElementById('projeto-detail-body'));
        } catch (err) { toast.error(err.message); }
      }
    });
  }
}
