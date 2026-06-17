export function showModal(content, { title, onClose } = {}) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';

  const modal = document.createElement('div');
  modal.className = 'modal';

  if (title) {
    const titleEl = document.createElement('h3');
    titleEl.className = 'modal-title';
    titleEl.textContent = title;
    modal.appendChild(titleEl);
  }

  if (typeof content === 'string') {
    const body = document.createElement('div');
    body.innerHTML = content;
    modal.appendChild(body);
  } else if (content instanceof HTMLElement) {
    modal.appendChild(content);
  }

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      overlay.classList.add('visible');
    });
  });

  const close = () => {
    overlay.classList.remove('visible');
    setTimeout(() => {
      overlay.remove();
      if (onClose) onClose();
    }, 200);
  };

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  const escHandler = (e) => {
    if (e.key === 'Escape') {
      close();
      document.removeEventListener('keydown', escHandler);
    }
  };
  document.addEventListener('keydown', escHandler);

  return { close, modal, overlay };
}

export function createForm(fields) {
  const form = document.createElement('div');

  fields.forEach(field => {
    const group = document.createElement('div');

    if (field.row) {
      group.className = 'form-row';
      field.row.forEach(subField => {
        const subGroup = createFormField(subField);
        group.appendChild(subGroup);
      });
    } else {
      group.className = 'form-group';
      const el = createFormField(field);
      group.appendChild(el);
    }

    form.appendChild(group);
  });

  return form;
}

function createFormField(field) {
  const group = document.createElement('div');
  group.className = 'form-group';

  if (field.label) {
    const label = document.createElement('label');
    label.className = 'form-label';
    label.textContent = field.label;
    if (field.id) label.setAttribute('for', field.id);
    group.appendChild(label);
  }

  let input;
  if (field.type === 'select') {
    input = document.createElement('select');
    input.className = 'form-select';
    (field.options || []).forEach(opt => {
      const option = document.createElement('option');
      option.value = opt.value;
      option.textContent = opt.label;
      if (opt.selected) option.selected = true;
      input.appendChild(option);
    });
  } else if (field.type === 'textarea') {
    input = document.createElement('textarea');
    input.className = 'form-textarea';
  } else {
    input = document.createElement('input');
    input.type = field.type || 'text';
    input.className = 'form-input';
  }

  if (field.id) input.id = field.id;
  if (field.name) input.name = field.name;
  if (field.value !== undefined) input.value = field.value;
  if (field.placeholder) input.placeholder = field.placeholder;
  if (field.required) input.required = true;

  group.appendChild(input);
  return group;
}
