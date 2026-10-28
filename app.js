'use strict';

const ICONS = {
  layout:
    '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M3 9h18M9 9v12"/>',
  gift:
    '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M5 12v9h14v-9M12 8v13"/><path d="M12 8H7.5A2.5 2.5 0 1 1 10 5.5L12 8Zm0 0h4.5A2.5 2.5 0 1 0 14 5.5L12 8Z"/>',
  settings:
    '<path d="m9 3-1 3-3 1v3l-2 2 2 2v3l3 1 1 3h6l1-3 3-1v-3l2-2-2-2V7l-3-1-1-3Z"/><circle cx="12" cy="12" r="3"/>',
  moon:
    '<path d="M20.5 13A9 9 0 0 1 11 3.5 9 9 0 1 0 20.5 13Z"/>',
  sun:
    '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
  sunset:
    '<path d="M3 17h18M5 21h14M6 13a6 6 0 0 1 12 0M12 2v3M3 7l2 2m14 0 2-2"/>',
  plus:
    '<path d="M12 5v14M5 12h14"/>',
  check:
    '<path d="m5 12 4 4L19 6"/>',
  clock:
    '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  repeat:
    '<path d="M17 2l4 4-4 4M3 11V8a2 2 0 0 1 2-2h16M7 22l-4-4 4-4m14-1v3a2 2 0 0 1-2 2H3"/>',
  edit:
    '<path d="m15 5 4 4M4 20l5-1L21 7a2.8 2.8 0 0 0-4-4L5 15Z"/>',
  coin:
    '<circle cx="12" cy="12" r="9"/><path d="m13 6-5 7h4l-1 5 5-7h-4Z"/>',
  download:
    '<path d="M12 3v12m-4-4 4 4 4-4M4 16v5h16v-5"/>',
  upload:
    '<path d="M12 16V3m-4 4 4-4 4 4M4 16v5h16v-5"/>'
};

const icon = (name) => `
  <svg viewBox="0 0 24 24" aria-hidden="true">
    ${ICONS[name] || ICONS.gift}
  </svg>
`;

const $ = (selector) => document.querySelector(selector);

const esc = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      })[character]
  );

const KEY = 'ritmo-v1';

const DAY_NAMES = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado'
];

const SHORT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const PERIODS = {
  manha: ['Manhã', 'sun', 'sun'],
  tarde: ['Tarde', 'sunset', 'afternoon'],
  noite: ['Noite', 'moon', 'night']
};

const today = () => new Date();

const dateKey = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate()
  ).padStart(2, '0')}`;

const uid = () =>
  crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

// Estado inicial: nenhuma tarefa cadastrada.
const initial = () => ({
  version: 1,
  routineRevision: 1,
  theme: 'light',
  tasks: [],
  rewards: [
    {
      id: 'sample-r1',
      name: 'Meu hambúrguer favorito',
      description: 'Uma pausa gostosa para celebrar a constância.'
    },
    {
      id: 'sample-r2',
      name: 'Uma hora no celular',
      description: 'Um tempo livre para aproveitar sem pressa.'
    }
  ],
  completions: [],
  redemptions: []
});

// Confere a estrutura dos dados salvos ou importados.
function validData(data) {
  if (
    !data ||
    data.version !== 1 ||
    !['light', 'dark'].includes(data.theme) ||
    !['tasks', 'rewards', 'completions', 'redemptions'].every(
      (key) => Array.isArray(data[key]) && data[key].length <= 100000
    )
  ) {
    return false;
  }

  const str = (value, max) =>
    typeof value === 'string' && value.length > 0 && value.length <= max;

  const ids = (items) =>
    new Set(items.map((item) => item.id)).size === items.length;

  return (
    ids(data.tasks) &&
    ids(data.rewards) &&
    data.tasks.every(
      (task) =>
        str(task.id, 100) &&
        str(task.name, 120) &&
        task.name.trim() &&
        Object.hasOwn(PERIODS, task.period) &&
        typeof task.daily === 'boolean' &&
        Number.isInteger(task.day) &&
        task.day >= 0 &&
        task.day <= 6 &&
        typeof task.time === 'string' &&
        (task.time === '' ||
          /^([01]\d|2[0-3]):[0-5]\d$/.test(task.time))
    ) &&
    data.rewards.every(
      (reward) =>
        str(reward.id, 100) &&
        str(reward.name, 120) &&
        reward.name.trim() &&
        typeof reward.description === 'string' &&
        reward.description.length <= 300
    ) &&
    data.completions.every(
      (completion) =>
        str(completion.taskId, 100) &&
        typeof completion.date === 'string' &&
        /^\d{4}-\d{2}-\d{2}$/.test(completion.date)
    ) &&
    new Set(
      data.completions.map(
        (completion) => completion.taskId + '|' + completion.date
      )
    ).size === data.completions.length &&
    data.redemptions.every(
      (redemption) =>
        str(redemption.name, 120) &&
        typeof redemption.date === 'string' &&
        Number.isFinite(Date.parse(redemption.date))
    ) &&
    data.completions.length * 20 >= data.redemptions.length * 1000
  );
}

// Carrega os dados do navegador.
let state;
let storageError = false;

try {
  const stored = localStorage.getItem(KEY);

  if (stored) {
    state = JSON.parse(stored);

    if (!validData(state)) {
      throw Error('Dados inválidos');
    }
  } else {
    state = initial();
  }
} catch {
  state = initial();
  storageError = true;
}

// Limpa as tarefas anteriores uma única vez nesta atualização.
// Novas tarefas permanecem salvas nas próximas visitas.
if (state.routineRevision !== 1) {
  state.tasks = [];
  state.routineRevision = 1;
}

let page = 'rotina';
let selected = today();
let editing = null;
let confirmAction = null;
let toastTimer;

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
    return true;
  } catch {
    toast(
      'Não foi possível salvar. Exporte seus dados para preservar as alterações.'
    );
    return false;
  }
}

function balance() {
  return state.completions.length * 20 - state.redemptions.length * 1000;
}

function tasksFor(date) {
  return state.tasks.filter(
    (task) => task.daily || task.day === date.getDay()
  );
}

function done(task, date = selected) {
  return state.completions.some(
    (completion) =>
      completion.taskId === task.id &&
      completion.date === dateKey(date)
  );
}

function toast(message) {
  $('#toast').textContent = message;
  $('#toast').classList.add('show');

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    $('#toast').classList.remove('show');
  }, 3800);
}

// Tema claro e escuro.
function applyTheme() {
  document.body.classList.toggle('dark', state.theme === 'dark');

  $('.theme-toggle').innerHTML =
    icon(state.theme === 'dark' ? 'sun' : 'moon') +
    (state.theme === 'dark' ? 'Tema claro' : 'Tema escuro');

  $('.theme-toggle').setAttribute(
    'aria-label',
    state.theme === 'dark'
      ? 'Ativar tema claro'
      : 'Ativar tema escuro'
  );
}

function setTheme(theme) {
  state.theme = theme;
  persist();
  applyTheme();
  render();
}

function heading(eyebrow, title, description, button = '') {
  return `
    <div class="heading">
      <div>
        <h1>${title}</h1>
        ${description ? `<p class="subtext">${description}</p>` : ''}
      </div>
      ${button}
    </div>
  `;
}

function newTaskButton() {
  return `
    <button class="button primary" data-action="new-task">
      ${icon('plus')}Nova tarefa
    </button>
  `;
}

function weekDates() {
  const monday = new Date(selected);

  monday.setHours(12, 0, 0, 0);
  monday.setDate(
    monday.getDate() - ((monday.getDay() + 6) % 7)
  );

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday);
    date.setDate(date.getDate() + index);
    return date;
  });
}

function fmtDate(date, options) {
  return new Intl.DateTimeFormat('pt-BR', options).format(date);
}

// Tela da rotina.
function routine() {
  const list = tasksFor(selected);
  const completed = list.filter((task) => done(task)).length;
  const percentage = list.length
    ? Math.round((completed / list.length) * 100)
    : 0;

  const xp = balance();
  const week = weekDates();
  const isToday = dateKey(selected) === dateKey(today());

  const dateLabel = fmtDate(selected, {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });

  return (
    heading(
      '',
      'Minha rotina',
      dateLabel.charAt(0).toUpperCase() +
        dateLabel.slice(1) +
        (isToday ? ' · Hoje' : ''),
      newTaskButton()
    ) +
    `
    <section class="day-summary" aria-label="Resumo do dia">
      <div class="summary-progress">
        <div>
          <strong>${completed} de ${list.length} tarefas concluídas</strong>
          <span>${percentage}% do dia</span>
        </div>

        <div
          class="progress"
          role="progressbar"
          aria-label="Progresso do dia"
          aria-valuenow="${percentage}"
          aria-valuemin="0"
          aria-valuemax="100"
        >
          <span style="width:${percentage}%"></span>
        </div>
      </div>

      <div class="summary-balance">
        ${icon('coin')}
        <div>
          <strong>${xp.toLocaleString('pt-BR')} <small>XP</small></strong>
          <p class="subtext">Saldo disponível</p>
        </div>
      </div>
    </section>

    <section aria-label="Dias da semana">
      <div class="week-header">
        <span class="section-label">Sua semana</span>

        <div class="week-nav">
          <button
            class="icon-button"
            data-action="prev-week"
            aria-label="Semana anterior"
          >‹</button>

          ${fmtDate(week[0], {
            day: '2-digit',
            month: 'short'
          }).replace('.', '')}
          –
          ${fmtDate(week[6], {
            day: '2-digit',
            month: 'short'
          }).replace('.', '')}

          <button
            class="icon-button"
            data-action="next-week"
            aria-label="Próxima semana"
          >›</button>

          <button class="text-button" data-action="today">
            Hoje
          </button>
        </div>
      </div>

      <div class="week">
        ${week
          .map(
            (date) => `
            <button
              class="day ${
                dateKey(date) === dateKey(selected) ? 'selected' : ''
              } ${dateKey(date) === dateKey(today()) ? 'today' : ''}"
              data-date="${dateKey(date)}"
              aria-pressed="${dateKey(date) === dateKey(selected)}"
              ${
                dateKey(date) === dateKey(today())
                  ? 'aria-current="date"'
                  : ''
              }
            >
              <span class="day-label">${SHORT[date.getDay()]}</span>
              <span class="day-number">
                ${String(date.getDate()).padStart(2, '0')}
              </span>
            </button>
          `
          )
          .join('')}
      </div>
    </section>

    ${
      !isToday
        ? '<p class="date-notice">Você pode editar a rotina. A conclusão fica disponível no dia atual.</p>'
        : ''
    }

    <div class="periods-grid">
      ${Object.entries(PERIODS)
        .map(([key, [name, iconName, className]]) => {
          const items = list
            .filter((task) => task.period === key)
            .sort((a, b) =>
              (a.time || '99:99').localeCompare(b.time || '99:99')
            );

          return `
            <section
              class="period"
              aria-label="Tarefas da ${name.toLowerCase()}"
            >
              <div class="period-heading">
                <div class="period-title">
                  <span class="${className}">${icon(iconName)}</span>
                  ${name}
                  <span class="period-count">${items.length}</span>
                </div>

                <button
                  class="icon-button"
                  data-action="new-task"
                  data-period="${key}"
                  aria-label="Adicionar tarefa: ${name}"
                >
                  ${icon('plus')}
                </button>
              </div>

              <div class="task-list">
                ${
                  items.length
                    ? items.map(taskRow).join('')
                    : '<div class="empty">Nenhuma tarefa.</div>'
                }
              </div>
            </section>
          `;
        })
        .join('')}
    </div>

    <p class="routine-hint">
      20 XP por tarefa concluída · 1.000 XP por recompensa
    </p>
  `
  );
}

function taskRow(task) {
  const completed = done(task);
  const isToday = dateKey(selected) === dateKey(today());

  return `
    <div class="task ${completed ? 'done' : ''}">
      <button
        class="check ${completed ? 'checked' : ''}"
        data-complete="${esc(task.id)}"
        aria-label="${completed ? 'Concluída' : 'Concluir'}: ${esc(task.name)}"
        ${completed || !isToday ? 'disabled' : ''}
      >
        ${completed ? icon('check') : ''}
      </button>

      <div class="task-info">
        <p class="task-title">${esc(task.name)}</p>

        <div class="task-meta">
          <span>${icon('clock')}${task.time || 'Sem horário'}</span>
          ${
            task.daily
              ? `<span>${icon('repeat')}Todos os dias</span>`
              : ''
          }
        </div>
      </div>

      <button
        class="icon-button edit-task"
        data-edit-task="${esc(task.id)}"
        aria-label="Editar ${esc(task.name)}"
      >
        ${icon('edit')}
      </button>
    </div>
  `;
}

// Tela das recompensas.
function rewards() {
  const xp = balance();

  return (
    heading(
      '',
      'Recompensas',
      'Cada recompensa custa 1.000 XP.',
      `
        <button class="button primary" data-action="new-reward">
          ${icon('plus')}Nova recompensa
        </button>
      `
    ) +
    `
    <div class="notice balance-notice">
      ${icon('coin')}
      <span>
        Saldo disponível: <strong>${xp.toLocaleString('pt-BR')} XP</strong>
      </span>
    </div>

    <div class="rewards-grid">
      ${
        state.rewards
          .map(
            (reward) => `
            <article class="reward-card">
              <button
                class="icon-button"
                data-edit-reward="${esc(reward.id)}"
                aria-label="Editar ${esc(reward.name)}"
              >
                ${icon('edit')}
              </button>

              <div class="gift-art">${icon('gift')}</div>

              <h3>${esc(reward.name)}</h3>

              ${
                reward.description
                  ? `<p class="reward-description">${esc(reward.description)}</p>`
                  : ''
              }

              <div class="reward-cost">1.000 XP</div>

              <button
                class="button ${xp >= 1000 ? 'primary' : 'secondary'}"
                data-redeem="${esc(reward.id)}"
                ${xp < 1000 ? 'disabled' : ''}
              >
                ${
                  xp >= 1000
                    ? 'Resgatar'
                    : `Faltam ${(1000 - xp).toLocaleString('pt-BR')} XP`
                }
              </button>
            </article>
          `
          )
          .join('') ||
        '<div class="panel empty">Adicione sua primeira recompensa.</div>'
      }
    </div>

    ${
      state.redemptions.length
        ? `
          <section class="history panel">
            <h2>Resgates</h2>

            ${state.redemptions
              .slice()
              .reverse()
              .map(
                (redemption) => `
                <div class="history-row">
                  <div>
                    ${esc(redemption.name)}
                    <p class="subtext">
                      ${fmtDate(new Date(redemption.date), {
                        dateStyle: 'short'
                      })}
                    </p>
                  </div>
                  <span>−1.000 XP</span>
                </div>
              `
              )
              .join('')}
          </section>
        `
        : ''
    }
  `
  );
}

let backupFeedback = '';
let backupError = false;

function backupStatus(message, error = false) {
  backupFeedback = message;
  backupError = error;

  const element = $('#backup-feedback');

  if (element) {
    element.textContent = message;
    element.classList.toggle('error', error);
  }

  toast(message);
}

// Tela das configurações.
function settings() {
  return (
    heading('', 'Configurações', 'Tema e backup da sua rotina.') +
    `
    <div class="settings-grid">
      <section class="panel">
        <h2>Aparência</h2>

        <div class="theme-choices">
          <button
            class="theme-choice ${state.theme === 'light' ? 'active' : ''}"
            data-theme="light"
            aria-pressed="${state.theme === 'light'}"
          >
            ${icon('sun')}Claro
          </button>

          <button
            class="theme-choice ${state.theme === 'dark' ? 'active' : ''}"
            data-theme="dark"
            aria-pressed="${state.theme === 'dark'}"
          >
            ${icon('moon')}Escuro
          </button>
        </div>
      </section>

      <section class="panel">
        <h2>Backup dos dados</h2>

        <p class="subtext">
          Tarefas, XP e recompensas ficam salvos neste navegador.
        </p>

        <div class="backup-actions">
          <button class="button secondary" data-action="export">
            ${icon('download')}Exportar backup
          </button>

          <button class="button secondary" data-action="import">
            ${icon('upload')}Importar backup
          </button>
        </div>

        <p class="backup-help">
          Para trocar de dispositivo, exporte o arquivo JSON e importe
          no outro. A importação substitui os dados atuais após sua confirmação.
        </p>

        <p
          id="backup-feedback"
          class="backup-feedback ${backupError ? 'error' : ''}"
          role="status"
        >${esc(backupFeedback)}</p>
      </section>

      <p class="rules-note">
        Limpar os dados do navegador apaga sua rotina. Guarde um backup.
      </p>
    </div>
  `
  );
}

function render() {
  document.querySelectorAll('.nav').forEach((button) => {
    button.classList.toggle('active', button.dataset.page === page);
  });

  $('#main').innerHTML =
    page === 'rotina'
      ? routine()
      : page === 'recompensas'
        ? rewards()
        : settings();
}

// Formulário de criação e edição.
function openEditor(kind, id = null, period = 'manha') {
  const isTask = kind === 'task';

  const item = id
    ? (isTask ? state.tasks : state.rewards).find(
        (entry) => entry.id === id
      )
    : null;

  if (id && !item) return;

  editing = { kind, id };

  $('#modal-eyebrow').textContent =
    isTask ? 'SUA ROTINA' : 'SUA MOTIVAÇÃO';

  $('#modal-title').textContent =
    `${id ? 'Editar' : 'Nova'} ${isTask ? 'tarefa' : 'recompensa'}`;

  $('#form-fields').innerHTML =
    `
      <label for="item-name">
        Nome ${isTask ? 'da tarefa' : 'da recompensa'}
      </label>

      <input
        name="name"
        id="item-name"
        required
        maxlength="120"
        value="${esc(item?.name || '')}"
        placeholder="${
          isTask
            ? 'Ex.: caminhar por 20 minutos'
            : 'Ex.: uma tarde de cinema'
        }"
      >
    ` +
    (isTask
      ? `
        <div class="field-grid">
          <div>
            <label for="item-period">Período</label>

            <select name="period" id="item-period">
              ${Object.entries(PERIODS)
                .map(
                  ([key, value]) => `
                  <option
                    value="${key}"
                    ${(item?.period || period) === key ? 'selected' : ''}
                  >
                    ${value[0]}
                  </option>
                `
                )
                .join('')}
            </select>
          </div>

          <div>
            <label for="item-time">
              Horário <span class="subtext">(opcional)</span>
            </label>

            <input
              name="time"
              id="item-time"
              type="time"
              value="${esc(item?.time || '')}"
            >
          </div>
        </div>

        <p class="form-note">
          Você escolhe o período. O horário não muda essa escolha.
        </p>

        <label class="checkbox-label">
          <input
            name="daily"
            type="checkbox"
            ${item?.daily ? 'checked' : ''}
          >
          Repetir todos os dias (tarefa fixa)
        </label>

        <div id="day-field">
          <label for="item-day">Dia da semana</label>

          <select name="day" id="item-day">
            ${[1, 2, 3, 4, 5, 6, 0]
              .map(
                (day) => `
                <option
                  value="${day}"
                  ${
                    day === (item?.day ?? selected.getDay())
                      ? 'selected'
                      : ''
                  }
                >
                  ${DAY_NAMES[day]}
                </option>
              `
              )
              .join('')}
          </select>
        </div>

        <p class="form-note">
          ${
            id
              ? 'Alterações valem para todas as próximas ocorrências desta tarefa.'
              : 'Sem repetição diária, a tarefa se repete semanalmente no dia escolhido.'
          }
        </p>

        <div class="fixed-value">
          ${icon('coin')}20 XP por conclusão · valor fixo
        </div>
      `
      : `
        <label for="item-description">
          Descrição <span class="subtext">(opcional)</span>
        </label>

        <textarea
          id="item-description"
          name="description"
          maxlength="300"
          placeholder="Um incentivo do seu jeito…"
        >${esc(item?.description || '')}</textarea>

        <div class="fixed-value">
          ${icon('gift')}1.000 XP por resgate · valor fixo
        </div>
      `);

  const oldDelete = $('.delete-button');

  if (oldDelete) {
    oldDelete.remove();
  }

  if (id) {
    const button = document.createElement('button');

    button.type = 'button';
    button.className = 'delete-button';
    button.textContent = 'Excluir';

    button.addEventListener('click', () => {
      const target = { ...editing };

      $('#editor').close();

      askConfirm(
        'Excluir ' + (isTask ? 'tarefa' : 'recompensa') + '?',
        `“${item.name}” será removida${
          isTask
            ? ' de todos os dias. O XP já conquistado será mantido'
            : '. O histórico de resgates será mantido'
        }.`,
        () => {
          const collection = isTask ? 'tasks' : 'rewards';

          state[collection] = state[collection].filter(
            (entry) => entry.id !== target.id
          );

          persist();
          render();
          toast('Item excluído.');
        }
      );
    });

    $('.modal-actions').prepend(button);
  }

  if (isTask) {
    const checkbox = $('[name=daily]');

    const update = () => {
      $('#day-field').hidden = checkbox.checked;
    };

    checkbox.addEventListener('change', update);
    update();
  }

  $('#editor').showModal();
}

function askConfirm(title, description, action) {
  $('#confirm-title').textContent = title;
  $('#confirm-description').textContent = description;
  confirmAction = action;

  $('#confirmation').showModal();
}

// Salva a tarefa ou recompensa criada/editada.
$('#editor-form').addEventListener('submit', (event) => {
  event.preventDefault();

  const form = new FormData(event.target);
  const name = form.get('name').trim();

  if (!name) {
    $('#item-name').setCustomValidity(
      'Informe um nome para continuar.'
    );
    $('#item-name').reportValidity();
    return;
  }

  const { kind, id } = editing;
  const list = state[kind === 'task' ? 'tasks' : 'rewards'];

  const item =
    kind === 'task'
      ? {
          id: id || uid(),
          name,
          period: form.get('period'),
          time: form.get('time'),
          daily: form.get('daily') === 'on',
          day: Number(form.get('day'))
        }
      : {
          id: id || uid(),
          name,
          description: form.get('description').trim()
        };

  if (id) {
    list[list.findIndex((entry) => entry.id === id)] = item;
  } else {
    list.push(item);
  }

  persist();
  $('#editor').close();
  render();

  toast(
    id
      ? 'Alterações salvas.'
      : kind === 'task'
        ? 'Nova tarefa adicionada.'
        : 'Sua recompensa foi criada.'
  );
});

$('#editor-form').addEventListener('input', () => {
  $('#item-name').setCustomValidity('');
});

document.querySelectorAll('.close-modal').forEach((button) => {
  button.addEventListener('click', () => {
    $('#editor').close();
  });
});

['#confirm-close', '#confirm-cancel'].forEach((selector) => {
  $(selector).addEventListener('click', () => {
    $('#confirmation').close();
    confirmAction = null;
  });
});

$('#confirm-yes').addEventListener('click', () => {
  const action = confirmAction;
  confirmAction = null;

  $('#confirmation').close();
  action?.();
});

$('#confirmation').addEventListener('cancel', () => {
  confirmAction = null;
});

$('.theme-toggle').addEventListener('click', () => {
  setTheme(state.theme === 'light' ? 'dark' : 'light');
});

// Ações dos botões da interface.
document.addEventListener('click', (event) => {
  const button = event.target.closest('button,a[data-page]');

  if (!button) return;

  if (button.dataset.page) {
    event.preventDefault();
    page = button.dataset.page;

    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (button.dataset.theme) {
    setTheme(button.dataset.theme);
  }

  if (button.dataset.date) {
    selected = new Date(button.dataset.date + 'T12:00:00');
    render();
  }

  if (button.dataset.editTask) {
    openEditor('task', button.dataset.editTask);
  }

  if (button.dataset.editReward) {
    openEditor('reward', button.dataset.editReward);
  }

  if (button.dataset.complete) {
    const task = state.tasks.find(
      (entry) => entry.id === button.dataset.complete
    );

    if (
      task &&
      !done(task) &&
      dateKey(selected) === dateKey(today()) &&
      tasksFor(selected).includes(task)
    ) {
      state.completions.push({
        taskId: task.id,
        date: dateKey(selected)
      });

      persist();
      render();
      toast('+20 XP! Mais um passo na sua rotina.');
    }
  }

  if (button.dataset.redeem) {
    const reward = state.rewards.find(
      (entry) => entry.id === button.dataset.redeem
    );

    if (reward && balance() >= 1000) {
      askConfirm(
        'Resgatar recompensa?',
        `Você vai usar 1.000 XP para resgatar “${reward.name}”.`,
        () => {
          if (balance() < 1000) {
            return toast('Saldo insuficiente.');
          }

          state.redemptions.push({
            name: reward.name,
            date: new Date().toISOString()
          });

          persist();
          render();

          toast('Recompensa resgatada. Aproveite sua conquista!');
        }
      );
    }
  }

  const action = button.dataset.action;

  if (action === 'new-task') {
    openEditor('task', null, button.dataset.period || 'manha');
  }

  if (action === 'new-reward') {
    openEditor('reward');
  }

  if (action === 'today') {
    selected = today();
    render();
  }

  if (action === 'prev-week' || action === 'next-week') {
    selected.setDate(
      selected.getDate() + (action === 'prev-week' ? -7 : 7)
    );

    render();
  }

  if (action === 'export') {
    exportBackup();
  }

  if (action === 'import') {
    $('#import-file').value = '';
    $('#import-file').click();
  }
});

// Exporta os dados para um arquivo JSON.
function exportBackup() {
  let url;

  try {
    const blob = new Blob(
      [JSON.stringify(state, null, 2)],
      { type: 'application/json;charset=utf-8' }
    );

    url = URL.createObjectURL(blob);

    const link = document.createElement('a');

    link.href = url;
    link.download = `ritmo-backup-${dateKey(today())}.json`;
    link.hidden = true;

    document.body.append(link);
    link.click();
    link.remove();

    backupStatus('Backup exportado. Guarde o arquivo JSON.');
  } catch {
    backupStatus(
      'Não foi possível exportar o backup. Tente novamente.',
      true
    );
  } finally {
    if (url) {
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    }
  }
}

// Seleciona os campos permitidos de um backup.
function cleanBackup(data) {
  return {
    version: 1,
    routineRevision: 1,
    theme: data.theme,

    tasks: data.tasks.map((task) => ({
      id: task.id,
      name: task.name,
      period: task.period,
      time: task.time,
      daily: task.daily,
      day: task.day
    })),

    rewards: data.rewards.map((reward) => ({
      id: reward.id,
      name: reward.name,
      description: reward.description
    })),

    completions: data.completions.map((completion) => ({
      taskId: completion.taskId,
      date: completion.date
    })),

    redemptions: data.redemptions.map((redemption) => ({
      name: redemption.name,
      date: redemption.date
    }))
  };
}

// Importa os dados após validação e confirmação.
$('#import-file').addEventListener('change', async (event) => {
  const file = event.target.files[0];

  event.target.value = '';

  if (!file) return;

  if (file.size > 10 * 1024 * 1024) {
    return backupStatus(
      'O backup deve ter no máximo 10 MB.',
      true
    );
  }

  try {
    const data = JSON.parse(
      (await file.text()).replace(/^\uFEFF/, '')
    );

    if (!validData(data)) {
      throw Error('invalid');
    }

    const clean = cleanBackup(data);

    const xp =
      clean.completions.length * 20 -
      clean.redemptions.length * 1000;

    askConfirm(
      'Importar backup?',
      `${file.name}\n${clean.tasks.length} tarefas · ${
        clean.rewards.length
      } recompensas · ${xp.toLocaleString(
        'pt-BR'
      )} XP\n\nEste backup substituirá os dados atuais. Exporte antes se quiser mantê-los.`,
      () => {
        try {
          localStorage.setItem(KEY, JSON.stringify(clean));
        } catch {
          return backupStatus(
            'Não foi possível salvar o backup. Os dados atuais foram mantidos.',
            true
          );
        }

        state = clean;
        applyTheme();
        selected = today();

        backupFeedback = 'Backup importado com sucesso.';
        backupError = false;

        render();
        backupStatus(backupFeedback);
      }
    );
  } catch {
    backupStatus(
      'Arquivo inválido. Use um backup JSON exportado pelo Ritmo.',
      true
    );
  }
});

// Inicialização da interface.
document.querySelectorAll('[data-icon]').forEach((element) => {
  element.innerHTML = icon(element.dataset.icon);
});

applyTheme();
render();

if (!storageError) {
  persist();
} else {
  toast(
    'Não foi possível ler seus dados locais. Importe um backup para recuperar sua rotina.'
  );
}

// Atualiza o dia quando a página permanece aberta após a meia-noite.
let lastDay = dateKey(today());

setInterval(() => {
  if (lastDay !== dateKey(today())) {
    lastDay = dateKey(today());
    selected = today();
    render();
  }
}, 30000);

// Atualiza a interface quando outra aba altera os dados.
window.addEventListener('storage', (event) => {
  if (event.key === KEY && event.newValue) {
    try {
      const data = JSON.parse(event.newValue);

      if (validData(data)) {
        state = data;
        applyTheme();
        render();
      }
    } catch {
      // Ignora alterações com conteúdo inválido.
    }
  }
});