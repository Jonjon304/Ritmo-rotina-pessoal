import { get, post, put, del } from '../../utils/api.js';
import { showModal } from '../../components/modal/modal.js';
import { toast } from '../../components/toast/toast.js';
import { confirm } from '../../components/confirm/confirm.js';
import { formatarMoeda } from '../../utils/formatCurrency.js';
import { formatarDataCurta, formatarDataISO, formatarMesAno } from '../../utils/formatDate.js';

export class FinancasModule {
  constructor() {
    this.perfis = [];
    this.categorias = [];
    this.transacoes = [];
    this.fixas = [];
    this.investimentos = [];
    this.tab = 'resumo';
    this.mesOffset = 0;
  }

  getMesFiltro() {
    const agora = new Date();
    agora.setDate(1);
    agora.setMonth(agora.getMonth() + this.mesOffset);
    return `${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, '0')}`;
  }

  getMesLabel() {
    const agora = new Date();
    agora.setDate(1);
    agora.setMonth(agora.getMonth() + this.mesOffset);
    return formatarMesAno(agora);
  }

  async render(container) {
    container.innerHTML = '';

    const header = document.createElement('header');
    header.className = 'module-header';
    header.innerHTML = `
      <div class="module-header-left">
        <span class="module-header-icon" style="color: #8b5cf6;">\uD83D\uDCB0</span>
        <h2 class="module-header-title">Finanças</h2>
      </div>
      <div class="section-actions">
        <div class="week-nav" style="margin:0;">
          <button class="btn-icon" id="financas-mes-prev">&larr;</button>
          <span class="week-label" id="financas-mes-label" style="min-width:0;">${this.getMesLabel()}</span>
          <button class="btn-icon" id="financas-mes-next">&rarr;</button>
        </div>
        <button class="btn-primary" style="--accent: #8b5cf6;" id="financas-nova">+ Transação</button>
        <button class="btn-ghost" id="financas-importar">Importar</button>
      </div>
    `;
    container.appendChild(header);

    const tabs = document.createElement('div');
    tabs.className = 'tabs';
    tabs.innerHTML = `
      <button class="tab-btn-inner active" data-tab="resumo">Resumo</button>
      <button class="tab-btn-inner" data-tab="transacoes">Transações</button>
      <button class="tab-btn-inner" data-tab="fixas">Fixas</button>
      <button class="tab-btn-inner" data-tab="investimentos">Investimentos</button>
      <button class="tab-btn-inner" data-tab="categorias">Categorias</button>
      <button class="tab-btn-inner" data-tab="perfis">Perfis</button>
    `;
    container.appendChild(tabs);

    const body = document.createElement('div');
    body.className = 'module-body';
    body.id = 'financas-body';
    container.appendChild(body);

    tabs.querySelectorAll('.tab-btn-inner').forEach(btn => {
      btn.addEventListener('click', () => {
        tabs.querySelectorAll('.tab-btn-inner').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.tab = btn.dataset.tab;
        this.renderTab(body);
      });
    });

    header.querySelector('#financas-nova').addEventListener('click', () => this.openTransacaoModal());
    header.querySelector('#financas-importar').addEventListener('click', () => this.openImportModal());
    header.querySelector('#financas-mes-prev').addEventListener('click', async () => {
      this.mesOffset--;
      await this.loadData();
      this.updateMesLabel();
      this.renderTab(document.getElementById('financas-body'));
    });
    header.querySelector('#financas-mes-next').addEventListener('click', async () => {
      this.mesOffset++;
      await this.loadData();
      this.updateMesLabel();
      this.renderTab(document.getElementById('financas-body'));
    });

    await this.loadData();
    this.renderTab(body);
  }

  updateMesLabel() {
    const label = document.getElementById('financas-mes-label');
    if (label) label.textContent = this.getMesLabel();
  }

  async loadData() {
    const mes = this.getMesFiltro();
    const qs = `?mes=${mes}`;
    try {
      const [stats, transacoes, fixas, investimentos, categorias, perfis] = await Promise.all([
        get(`/financas/relatorios/stats${qs}`).catch(() => ({})),
        get(`/financas/transacoes${qs}`).catch(() => ([])),
        get('/financas/fixas').catch(() => ([])),
        get('/financas/investimentos').catch(() => ([])),
        get('/financas/categorias').catch(() => ([])),
        get('/financas/perfis').catch(() => ([])),
      ]);
      this.stats = stats;
      this.transacoes = transacoes.dados || transacoes.transacoes || transacoes || [];
      this.fixas = fixas.fixas || fixas || [];
      this.investimentos = investimentos.investimentos || investimentos || [];
      this.categorias = categorias.categorias || categorias || [];
      this.perfis = perfis.perfis || perfis || [];
    } catch (err) {
      toast.error('Erro ao carregar finanças');
    }
  }

  renderTab(body) {
    body.innerHTML = '';
    switch (this.tab) {
      case 'resumo': this.renderResumo(body); break;
      case 'transacoes': this.renderTransacoes(body); break;
      case 'fixas': this.renderFixas(body); break;
      case 'investimentos': this.renderInvestimentos(body); break;
      case 'categorias': this.renderCategorias(body); break;
      case 'perfis': this.renderPerfis(body); break;
    }
  }

  renderResumo(body) {
    const s = this.stats || {};
    const mesLabel = this.getMesLabel();
    const row = document.createElement('div');
    row.className = 'stats-row';
    row.innerHTML = `
      <div class="stat-card">
        <span class="stat-label">Saldo (${mesLabel})</span>
        <span class="stat-value mono">${formatarMoeda(s.saldo_total || 0)}</span>
      </div>
      <div class="stat-card positive">
        <span class="stat-label">Receitas (${mesLabel})</span>
        <span class="stat-value mono">${formatarMoeda(s.receitas_mes || 0)}</span>
      </div>
      <div class="stat-card negative">
        <span class="stat-label">Despesas (${mesLabel})</span>
        <span class="stat-value mono">${formatarMoeda(s.despesas_mes || 0)}</span>
      </div>
    `;
    body.appendChild(row);

    const section = document.createElement('div');
    section.innerHTML = `<div class="section-header"><h3>Últimas transações</h3></div>`;
    body.appendChild(section);

    const list = document.createElement('div');
    list.className = 'transaction-list';
    const recentes = (this.transacoes || []).slice(0, 10);
    if (recentes.length === 0) {
      list.innerHTML = '<div class="empty-state"><div class="empty-state-icon">\uD83D\uDCB0</div><div class="empty-state-text">Nenhuma transação registrada</div></div>';
    } else {
      recentes.forEach(t => {
        const item = document.createElement('div');
        item.className = 'transaction-item';
        const isReceita = t.tipo === 'receita';
        const perfilTag = t.perfil_nome ? `<span class="transaction-perfil">${t.perfil_icone || ''} ${t.perfil_nome}</span>` : '';
        item.innerHTML = `
          <span class="transaction-emoji">${isReceita ? '\uD83D\uDCB5' : '\uD83C\uDFE0'}</span>
          <span class="transaction-name">${t.nome || '—'}</span>
          <span class="transaction-category">${t.categoria_nome || t.categoria || ''}</span>
          ${perfilTag}
          <span class="transaction-amount ${isReceita ? 'positive' : 'negative'} mono">${isReceita ? '+' : '-'}${formatarMoeda(t.valor || 0)}</span>
          <span class="transaction-date">${t.data ? formatarDataCurta(t.data) : ''}</span>
        `;
        item.addEventListener('click', () => this.openTransacaoModal(t));
        list.appendChild(item);
      });
    }
    body.appendChild(list);
  }

  renderTransacoes(body) {
    const list = document.createElement('div');
    list.className = 'transaction-list';
    if ((this.transacoes || []).length === 0) {
      list.innerHTML = '<div class="empty-state"><div class="empty-state-icon">\uD83D\uDCCB</div><div class="empty-state-text">Nenhuma transação</div></div>';
    } else {
      this.transacoes.forEach(t => {
        const isReceita = t.tipo === 'receita';
        const item = document.createElement('div');
        item.className = 'transaction-item';
        const perfilTag = t.perfil_nome ? `<span class="transaction-perfil">${t.perfil_icone || ''} ${t.perfil_nome}</span>` : '';
        item.innerHTML = `
          <span class="transaction-emoji">${isReceita ? '\uD83D\uDCB5' : '\uD83C\uDFE0'}</span>
          <span class="transaction-name">${t.nome || '—'}</span>
          <span class="transaction-category">${t.categoria_nome || t.categoria || ''}</span>
          ${perfilTag}
          <span class="transaction-amount ${isReceita ? 'positive' : 'negative'} mono">${isReceita ? '+' : '-'}${formatarMoeda(t.valor || 0)}</span>
          <span class="transaction-date">${t.data ? formatarDataCurta(t.data) : ''}</span>
        `;
        item.addEventListener('click', () => this.openTransacaoModal(t));
        list.appendChild(item);
      });
    }
    body.appendChild(list);
  }

  renderFixas(body) {
    const section = document.createElement('div');
    section.innerHTML = '<div class="section-header"><h3>Receitas e Despesas Fixas</h3></div>';
    body.appendChild(section);

    const list = document.createElement('div');
    list.className = 'fixas-list';
    if ((this.fixas || []).length === 0) {
      list.innerHTML = '<div class="empty-state"><div class="empty-state-icon">\uD83D\uDCCB</div><div class="empty-state-text">Nenhuma fixa</div></div>';
    } else {
      this.fixas.forEach(f => {
        const isReceita = f.tipo === 'receita';
        const perfilObj = (this.perfis || []).find(p => p.id == f.perfil_id);
        const perfilTag = perfilObj ? `<span class="transaction-perfil">${perfilObj.icone || ''} ${perfilObj.nome}</span>` : '';
        const item = document.createElement('div');
        item.className = 'fixa-item';
        item.innerHTML = `
          <span class="transaction-emoji">${isReceita ? '\uD83D\uDCB5' : '\uD83C\uDFE0'}</span>
          <span class="transaction-name">${f.nome || '—'}</span>
          ${perfilTag}
          <span class="transaction-amount ${isReceita ? 'positive' : 'negative'} mono">${isReceita ? '+' : '-'}${formatarMoeda(f.valor || 0)}</span>
          <span class="transaction-date">dia ${f.dia_mes || '?'}</span>
          <button class="btn-icon fixa-delete" data-id="${f.id}">\u2717</button>
        `;
        item.addEventListener('click', (e) => {
          if (!e.target.classList.contains('fixa-delete')) this.openFixaModal(f);
        });
        item.querySelector('.fixa-delete')?.addEventListener('click', async (e) => {
          e.stopPropagation();
          const ok = await confirm({ title: 'Excluir fixa?', message: 'Esta ação não pode ser desfeita.', danger: true, confirmText: 'Excluir' });
          if (ok) {
            try {
              await del(`/financas/fixas/${f.id}`);
              toast.success('Fixa excluída');
              await this.loadData();
              this.renderTab(document.getElementById('financas-body'));
            } catch (err) { toast.error(err.message); }
          }
        });
        list.appendChild(item);
      });
    }
    body.appendChild(list);

    const btn = document.createElement('button');
    btn.className = 'btn-primary';
    btn.style.setProperty('--accent', '#8b5cf6');
    btn.textContent = '+ Nova fixa';
    btn.addEventListener('click', () => this.openFixaModal());
    body.appendChild(btn);
  }

  renderInvestimentos(body) {
    const section = document.createElement('div');
    section.innerHTML = '<div class="section-header"><h3>Investimentos</h3></div>';
    body.appendChild(section);

    const list = document.createElement('div');
    list.className = 'investimentos-list';
    if ((this.investimentos || []).length === 0) {
      list.innerHTML = '<div class="empty-state"><div class="empty-state-icon">\uD83D\uDCB0</div><div class="empty-state-text">Nenhum investimento</div></div>';
    } else {
      this.investimentos.forEach(inv => {
        const item = document.createElement('div');
        item.className = 'investimento-item';
        const perfilObj = (this.perfis || []).find(p => p.id == inv.perfil_id);
        const perfilTag = perfilObj ? `<div style="font-size:12px;color:var(--text-muted);">${perfilObj.icone || ''} ${perfilObj.nome}</div>` : '';
        item.innerHTML = `
          <div>
            <div style="font-weight:600;margin-bottom:4px;">${inv.nome || '—'}</div>
            <div style="font-size:12px;color:var(--text-muted);">${inv.tipo || ''}</div>
            ${perfilTag}
          </div>
          <span class="mono" style="font-weight:700;">${formatarMoeda(inv.valor_aplicado || 0)}</span>
        `;
        item.addEventListener('click', () => this.openInvestimentoModal(inv));
        list.appendChild(item);
      });
    }
    body.appendChild(list);

    const btn = document.createElement('button');
    btn.className = 'btn-primary';
    btn.style.setProperty('--accent', '#8b5cf6');
    btn.textContent = '+ Novo investimento';
    btn.addEventListener('click', () => this.openInvestimentoModal());
    body.appendChild(btn);
  }

  renderCategorias(body) {
    const section = document.createElement('div');
    section.innerHTML = '<div class="section-header"><h3>Categorias</h3></div>';
    body.appendChild(section);

    const list = document.createElement('div');
    list.className = 'categorias-list';
    if ((this.categorias || []).length === 0) {
      list.innerHTML = '<div class="empty-state"><div class="empty-state-icon">\uD83C\uDFAF</div><div class="empty-state-text">Nenhuma categoria</div></div>';
    } else {
      this.categorias.forEach(c => {
        const chip = document.createElement('span');
        chip.className = 'category-chip';
        chip.textContent = c.nome || '—';
        chip.addEventListener('click', () => this.openCategoriaModal(c));
        list.appendChild(chip);
      });
    }
    body.appendChild(list);

    const btn = document.createElement('button');
    btn.className = 'btn-primary';
    btn.style.setProperty('--accent', '#8b5cf6');
    btn.textContent = '+ Nova categoria';
    btn.addEventListener('click', () => this.openCategoriaModal());
    body.appendChild(btn);
  }

  renderPerfis(body) {
    const section = document.createElement('div');
    section.innerHTML = '<div class="section-header"><h3>Perfis (Bancos / Contas)</h3></div>';
    body.appendChild(section);

    const list = document.createElement('div');
    list.className = 'perfis-list';
    if ((this.perfis || []).length === 0) {
      list.innerHTML = '<div class="empty-state"><div class="empty-state-icon">🏦</div><div class="empty-state-text">Nenhum perfil cadastrado</div></div>';
    } else {
      this.perfis.forEach(p => {
        const item = document.createElement('div');
        item.className = 'perfil-item';
        const cor = p.cor || '#8b5cf6';
        const icone = p.icone || '🏦';
        item.innerHTML = `
          <span class="perfil-icon" style="background:${cor}20;color:${cor};">${icone}</span>
          <span class="perfil-nome">${p.nome || '—'}</span>
          <span class="perfil-cor-dot" style="background:${cor};"></span>
          <button class="btn-icon perfil-delete" data-id="${p.id}">✗</button>
        `;
        item.addEventListener('click', (e) => {
          if (!e.target.classList.contains('perfil-delete')) this.openPerfilModal(p);
        });
        item.querySelector('.perfil-delete')?.addEventListener('click', async (e) => {
          e.stopPropagation();
          const ok = await confirm({ title: 'Excluir perfil?', message: 'Esta ação não pode ser desfeita.', danger: true, confirmText: 'Excluir' });
          if (ok) {
            try {
              await del(`/financas/perfis/${p.id}`);
              toast.success('Perfil excluído');
              await this.loadData();
              this.renderTab(document.getElementById('financas-body'));
            } catch (err) { toast.error(err.message); }
          }
        });
        list.appendChild(item);
      });
    }
    body.appendChild(list);

    const btn = document.createElement('button');
    btn.className = 'btn-primary';
    btn.style.setProperty('--accent', '#8b5cf6');
    btn.textContent = '+ Novo perfil';
    btn.addEventListener('click', () => this.openPerfilModal());
    body.appendChild(btn);
  }

  openPerfilModal(perfil = null) {
    const isEdit = !!perfil;
    const content = document.createElement('div');
    content.innerHTML = `
      <div class="form-group">
        <label class="form-label">Nome</label>
        <input class="form-input" id="p-nome" value="${isEdit ? (perfil.nome || '') : ''}" placeholder="Ex: Nubank, Itaú, Bradesco">
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Ícone</label>
          <select class="form-select" id="p-icone">
            <option value="🏦" ${!isEdit || perfil.icone === '🏦' ? 'selected' : ''}>🏦 Banco</option>
            <option value="💳" ${isEdit && perfil.icone === '💳' ? 'selected' : ''}>💳 Cartão</option>
            <option value="📱" ${isEdit && perfil.icone === '📱' ? 'selected' : ''}>📱 Digital</option>
            <option value="💰" ${isEdit && perfil.icone === '💰' ? 'selected' : ''}>💰 Poupança</option>
            <option value="📈" ${isEdit && perfil.icone === '📈' ? 'selected' : ''}>📈 Investimento</option>
            <option value="🏠" ${isEdit && perfil.icone === '🏠' ? 'selected' : ''}>🏠 Casa</option>
            <option value="🤑" ${isEdit && perfil.icone === '🤑' ? 'selected' : ''}>🤑 Dinheiro</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Cor</label>
          <input class="form-input" id="p-cor" type="color" value="${isEdit ? (perfil.cor || '#8b5cf6') : '#8b5cf6'}" style="height:40px;padding:4px;">
        </div>
      </div>
      <div class="modal-actions">
        ${isEdit ? '<button class="btn-danger p-delete">Excluir</button>' : ''}
        <button class="btn-ghost p-cancel">Cancelar</button>
        <button class="btn-primary p-save" style="--accent:#8b5cf6;">Salvar</button>
      </div>
    `;

    const { close } = showModal(content, { title: isEdit ? 'Editar perfil' : 'Novo perfil' });

    content.querySelector('.p-cancel').addEventListener('click', close);
    content.querySelector('.p-save').addEventListener('click', async () => {
      const data = {
        nome: content.querySelector('#p-nome').value,
        icone: content.querySelector('#p-icone').value,
        cor: content.querySelector('#p-cor').value,
      };
      try {
        if (isEdit) await put(`/financas/perfis/${perfil.id}`, data);
        else await post('/financas/perfis', data);
        toast.success(isEdit ? 'Perfil atualizado' : 'Perfil criado');
        close();
        await this.loadData();
        this.renderTab(document.getElementById('financas-body'));
      } catch (err) { toast.error(err.message); }
    });

    if (isEdit) {
      content.querySelector('.p-delete')?.addEventListener('click', async () => {
        const ok = await confirm({ title: 'Excluir perfil?', message: 'Esta ação não pode ser desfeita.', danger: true, confirmText: 'Excluir' });
        if (ok) {
          try {
            await del(`/financas/perfis/${perfil.id}`);
            toast.success('Perfil excluído');
            close();
            await this.loadData();
            this.renderTab(document.getElementById('financas-body'));
          } catch (err) { toast.error(err.message); }
        }
      });
    }
  }

  openTransacaoModal(transacao = null) {
    const isEdit = !!transacao;
    const content = document.createElement('div');
    content.innerHTML = `
      <div class="form-group">
        <label class="form-label">Tipo</label>
        <select class="form-select" id="t-tipo">
          <option value="despesa" ${!isEdit || transacao.tipo === 'despesa' ? 'selected' : ''}>Despesa</option>
          <option value="receita" ${isEdit && transacao.tipo === 'receita' ? 'selected' : ''}>Receita</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Nome</label>
        <input class="form-input" id="t-nome" value="${isEdit ? (transacao.nome || '') : ''}" placeholder="Ex: Mercado">
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Valor</label>
          <input class="form-input" id="t-valor" type="number" step="0.01" value="${isEdit ? (transacao.valor || '') : ''}" placeholder="0.00">
        </div>
        <div class="form-group">
          <label class="form-label">Data</label>
          <input class="form-input" id="t-data" type="date" value="${isEdit ? (transacao.data ? formatarDataISO(transacao.data) : '') : formatarDataISO(new Date())}">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Categoria</label>
        <select class="form-select" id="t-cat">
          ${(this.categorias || []).map(c => `<option value="${c.id}" ${isEdit && transacao.categoria_id == c.id ? 'selected' : ''}>${c.nome}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Perfil (Banco/Conta)</label>
        <select class="form-select" id="t-perfil">
          <option value="">Nenhum</option>
          ${(this.perfis || []).map(p => `<option value="${p.id}" ${isEdit && transacao.perfil_id == p.id ? 'selected' : ''}>${p.icone || ''} ${p.nome}</option>`).join('')}
        </select>
      </div>
      <div class="modal-actions">
        ${isEdit ? '<button class="btn-danger t-delete">Excluir</button>' : ''}
        <button class="btn-ghost t-cancel">Cancelar</button>
        <button class="btn-primary t-save" style="--accent:#8b5cf6;">Salvar</button>
      </div>
    `;

    const { close } = showModal(content, { title: isEdit ? 'Editar transação' : 'Nova transação' });

    const updateCatOptions = () => {
      const tipo = content.querySelector('#t-tipo').value;
      const catSelect = content.querySelector('#t-cat');
      const currentVal = catSelect.value;
      catSelect.innerHTML = (this.categorias || [])
        .filter(c => c.tipo === tipo)
        .map(c => `<option value="${c.id}">${c.nome}</option>`)
        .join('');
      if (catSelect.querySelector(`option[value="${currentVal}"]`)) catSelect.value = currentVal;
    };
    content.querySelector('#t-tipo').addEventListener('change', updateCatOptions);
    updateCatOptions();

    content.querySelector('.t-cancel').addEventListener('click', close);
    content.querySelector('.t-save').addEventListener('click', async () => {
      const data = {
        tipo: content.querySelector('#t-tipo').value,
        nome: content.querySelector('#t-nome').value,
        valor: parseFloat(content.querySelector('#t-valor').value) || 0,
        data: content.querySelector('#t-data').value,
        categoria_id: parseInt(content.querySelector('#t-cat').value) || null,
        perfil_id: parseInt(content.querySelector('#t-perfil').value) || null,
      };
      try {
        if (isEdit) await put(`/financas/transacoes/${transacao.id}`, data);
        else await post('/financas/transacoes', data);
        toast.success(isEdit ? 'Transação atualizada' : 'Transação criada');
        close();
        await this.loadData();
        this.renderTab(document.getElementById('financas-body'));
      } catch (err) { toast.error(err.message); }
    });

    if (isEdit) {
      content.querySelector('.t-delete')?.addEventListener('click', async () => {
        const ok = await confirm({ title: 'Excluir transação?', message: 'Esta ação não pode ser desfeita.', danger: true, confirmText: 'Excluir' });
        if (ok) {
          try {
            await del(`/financas/transacoes/${transacao.id}`);
            toast.success('Transação excluída');
            close();
            await this.loadData();
            this.renderTab(document.getElementById('financas-body'));
          } catch (err) { toast.error(err.message); }
        }
      });
    }
  }

  openFixaModal(fixa = null) {
    const isEdit = !!fixa;
    const content = document.createElement('div');
    content.innerHTML = `
      <div class="form-group">
        <label class="form-label">Tipo</label>
        <select class="form-select" id="f-tipo">
          <option value="despesa" ${!isEdit || fixa.tipo === 'despesa' ? 'selected' : ''}>Despesa</option>
          <option value="receita" ${isEdit && fixa.tipo === 'receita' ? 'selected' : ''}>Receita</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Nome</label>
        <input class="form-input" id="f-nome" value="${isEdit ? (fixa.nome || '') : ''}" placeholder="Ex: Aluguel">
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Valor</label>
          <input class="form-input" id="f-valor" type="number" step="0.01" value="${isEdit ? (fixa.valor || '') : ''}" placeholder="0.00">
        </div>
        <div class="form-group">
          <label class="form-label">Dia do mês</label>
          <input class="form-input" id="f-dia-mes" type="number" min="1" max="31" value="${isEdit ? (fixa.dia_mes || '') : ''}" placeholder="1">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Categoria</label>
        <select class="form-select" id="f-cat">
          ${(this.categorias || []).map(c => `<option value="${c.id}" ${isEdit && fixa.categoria_id == c.id ? 'selected' : ''}>${c.nome}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Perfil (Banco/Conta)</label>
        <select class="form-select" id="f-perfil">
          <option value="">Nenhum</option>
          ${(this.perfis || []).map(p => `<option value="${p.id}" ${isEdit && fixa.perfil_id == p.id ? 'selected' : ''}>${p.icone || ''} ${p.nome}</option>`).join('')}
        </select>
      </div>
      <div class="modal-actions">
        ${isEdit ? '<button class="btn-danger f-delete">Excluir</button>' : ''}
        <button class="btn-ghost f-cancel">Cancelar</button>
        <button class="btn-primary f-save" style="--accent:#8b5cf6;">Salvar</button>
      </div>
    `;

    const { close } = showModal(content, { title: isEdit ? 'Editar fixa' : 'Nova fixa' });

    content.querySelector('.f-cancel').addEventListener('click', close);
    content.querySelector('.f-save').addEventListener('click', async () => {
      const data = {
        tipo: content.querySelector('#f-tipo').value,
        nome: content.querySelector('#f-nome').value,
        valor: parseFloat(content.querySelector('#f-valor').value) || 0,
        dia_mes: parseInt(content.querySelector('#f-dia-mes').value) || 1,
        categoria_id: parseInt(content.querySelector('#f-cat').value) || null,
        perfil_id: parseInt(content.querySelector('#f-perfil').value) || null,
      };
      try {
        if (isEdit) await put(`/financas/fixas/${fixa.id}`, data);
        else await post('/financas/fixas', data);
        toast.success(isEdit ? 'Fixa atualizada' : 'Fixa criada');
        close();
        await this.loadData();
        this.renderTab(document.getElementById('financas-body'));
      } catch (err) { toast.error(err.message); }
    });

    if (isEdit) {
      content.querySelector('.f-delete')?.addEventListener('click', async () => {
        const ok = await confirm({ title: 'Excluir fixa?', message: 'Esta ação não pode ser desfeita.', danger: true, confirmText: 'Excluir' });
        if (ok) {
          try {
            await del(`/financas/fixas/${fixa.id}`);
            toast.success('Fixa excluída');
            close();
            await this.loadData();
            this.renderTab(document.getElementById('financas-body'));
          } catch (err) { toast.error(err.message); }
        }
      });
    }
  }

  openInvestimentoModal(inv = null) {
    const isEdit = !!inv;
    const content = document.createElement('div');
    content.innerHTML = `
      <div class="form-group">
        <label class="form-label">Nome</label>
        <input class="form-input" id="i-nome" value="${isEdit ? (inv.nome || '') : ''}" placeholder="Ex: Tesouro Direto">
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Tipo</label>
          <select class="form-select" id="i-tipo">
            <option value="cdb" ${!isEdit || inv.tipo === 'cdb' ? 'selected' : ''}>CDB</option>
            <option value="tesouro" ${isEdit && inv.tipo === 'tesouro' ? 'selected' : ''}>Tesouro Direto</option>
            <option value="acoes" ${isEdit && inv.tipo === 'acoes' ? 'selected' : ''}>Ações</option>
            <option value="fii" ${isEdit && inv.tipo === 'fii' ? 'selected' : ''}>FIIs</option>
            <option value="poupanca" ${isEdit && inv.tipo === 'poupanca' ? 'selected' : ''}>Poupança</option>
            <option value="outro" ${isEdit && inv.tipo === 'outro' ? 'selected' : ''}>Outro</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Valor aplicado</label>
          <input class="form-input" id="i-valor" type="number" step="0.01" value="${isEdit ? (inv.valor_aplicado || '') : ''}" placeholder="0.00">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Perfil (Banco/Conta)</label>
        <select class="form-select" id="i-perfil">
          <option value="">Nenhum</option>
          ${(this.perfis || []).map(p => `<option value="${p.id}" ${isEdit && inv.perfil_id == p.id ? 'selected' : ''}>${p.icone || ''} ${p.nome}</option>`).join('')}
        </select>
      </div>
      <div class="modal-actions">
        ${isEdit ? '<button class="btn-danger i-delete">Excluir</button>' : ''}
        <button class="btn-ghost i-cancel">Cancelar</button>
        <button class="btn-primary i-save" style="--accent:#8b5cf6;">Salvar</button>
      </div>
    `;

    const { close } = showModal(content, { title: isEdit ? 'Editar investimento' : 'Novo investimento' });

    content.querySelector('.i-cancel').addEventListener('click', close);
    content.querySelector('.i-save').addEventListener('click', async () => {
      const data = {
        nome: content.querySelector('#i-nome').value,
        tipo: content.querySelector('#i-tipo').value,
        valor_aplicado: parseFloat(content.querySelector('#i-valor').value) || 0,
        perfil_id: parseInt(content.querySelector('#i-perfil').value) || null,
      };
      try {
        if (isEdit) await put(`/financas/investimentos/${inv.id}`, data);
        else await post('/financas/investimentos', data);
        toast.success(isEdit ? 'Investimento atualizado' : 'Investimento criado');
        close();
        await this.loadData();
        this.renderTab(document.getElementById('financas-body'));
      } catch (err) { toast.error(err.message); }
    });

    if (isEdit) {
      content.querySelector('.i-delete')?.addEventListener('click', async () => {
        const ok = await confirm({ title: 'Excluir?', message: 'Esta ação não pode ser desfeita.', danger: true, confirmText: 'Excluir' });
        if (ok) {
          try {
            await del(`/financas/investimentos/${inv.id}`);
            toast.success('Investimento excluído');
            close();
            await this.loadData();
            this.renderTab(document.getElementById('financas-body'));
          } catch (err) { toast.error(err.message); }
        }
      });
    }
  }

  openCategoriaModal(cat = null) {
    const isEdit = !!cat;
    const content = document.createElement('div');
    content.innerHTML = `
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Nome</label>
          <input class="form-input" id="c-nome" value="${isEdit ? (cat.nome || '') : ''}" placeholder="Ex: Alimentação">
        </div>
        <div class="form-group">
          <label class="form-label">Tipo</label>
          <select class="form-select" id="c-tipo">
            <option value="despesa" ${!isEdit || cat.tipo === 'despesa' ? 'selected' : ''}>Despesa</option>
            <option value="receita" ${isEdit && cat.tipo === 'receita' ? 'selected' : ''}>Receita</option>
          </select>
        </div>
      </div>
      <div class="modal-actions">
        ${isEdit ? '<button class="btn-danger c-delete">Excluir</button>' : ''}
        <button class="btn-ghost c-cancel">Cancelar</button>
        <button class="btn-primary c-save" style="--accent:#8b5cf6;">Salvar</button>
      </div>
    `;

    const { close } = showModal(content, { title: isEdit ? 'Editar categoria' : 'Nova categoria' });

    content.querySelector('.c-cancel').addEventListener('click', close);
    content.querySelector('.c-save').addEventListener('click', async () => {
      const data = {
        nome: content.querySelector('#c-nome').value,
        tipo: content.querySelector('#c-tipo').value,
      };
      try {
        if (isEdit) await put(`/financas/categorias/${cat.id}`, data);
        else await post('/financas/categorias', data);
        toast.success(isEdit ? 'Categoria atualizada' : 'Categoria criada');
        close();
        await this.loadData();
        this.renderTab(document.getElementById('financas-body'));
      } catch (err) { toast.error(err.message); }
    });

    if (isEdit) {
      content.querySelector('.c-delete')?.addEventListener('click', async () => {
        const ok = await confirm({ title: 'Excluir categoria?', message: 'Esta ação não pode ser desfeita.', danger: true, confirmText: 'Excluir' });
        if (ok) {
          try {
            await del(`/financas/categorias/${cat.id}`);
            toast.success('Categoria excluída');
            close();
            await this.loadData();
            this.renderTab(document.getElementById('financas-body'));
          } catch (err) { toast.error(err.message); }
        }
      });
    }
  }

  openImportModal() {
    const content = document.createElement('div');
    content.innerHTML = `
      <div class="import-area" id="import-drop">
        <div style="font-size:40px;margin-bottom:12px;">📄</div>
        <div style="font-weight:600;margin-bottom:4px;">Toque para selecionar um CSV</div>
        <div style="font-size:12px;color:var(--text-muted);">Extrato bancário em formato CSV</div>
        <input type="file" accept=".csv" id="import-file" style="display:none;">
      </div>
      <div id="import-preview" style="display:none;"></div>
      <div class="modal-actions">
        <button class="btn-ghost imp-cancel">Cancelar</button>
      </div>
    `;

    const { close } = showModal(content, { title: 'Importar extrato CSV' });

    const dropArea = content.querySelector('#import-drop');
    const fileInput = content.querySelector('#import-file');

    dropArea.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', async () => {
      const file = fileInput.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('file', file);

      try {
        const result = await post('/financas/importar/csv', formData);
        const preview = content.querySelector('#import-preview');
        preview.style.display = 'block';
        preview.innerHTML = `
          <div style="margin-bottom:12px;font-weight:600;">${result.transacoes?.length || 0} transações encontradas</div>
          <button class="btn-primary" style="--accent:#8b5cf6;" id="import-confirm">Confirmar importação</button>
        `;
        content.querySelector('#import-confirm')?.addEventListener('click', async () => {
          try {
            await post('/financas/importar/confirmar', { transacoes: result.transacoes || [] });
            toast.success('Importação concluída');
            close();
            const datas = (result.transacoes || []).map(t => t.data).filter(Boolean).sort();
            if (datas.length) {
              const primeiroMes = datas[0].substring(0, 7);
              const mesAtual = this.getMesFiltro();
              if (primeiroMes !== mesAtual) {
                const [y, m] = primeiroMes.split('-').map(Number);
                const [cy, cm] = mesAtual.split('-').map(Number);
                this.mesOffset = (y - cy) * 12 + (m - cm);
                this.updateMesLabel();
              }
            }
            await this.loadData();
            this.renderTab(document.getElementById('financas-body'));
          } catch (err) { toast.error(err.message); }
        });
      } catch (err) {
        toast.error(err.message);
      }
    });

    content.querySelector('.imp-cancel').addEventListener('click', close);
  }
}
