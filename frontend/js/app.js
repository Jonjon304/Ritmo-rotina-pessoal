// mostra a data de hoje no cabeçalho
const hoje = new Date().toLocaleDateString('pt-BR', {
  weekday: 'long', day: 'numeric', month: 'long'
})
document.getElementById('data-hoje').textContent = hoje

// carrega e exibe as tarefas
async function renderTarefas() {
  const tarefas = await getTarefas()
  const lista = document.getElementById('lista-tarefas')
  lista.innerHTML = ''

  tarefas.forEach(t => {
    const div = document.createElement('div')
    div.className = 'tarefa' + (t.concluida ? ' concluida' : '')
    div.innerHTML = `
      <span class="horario">${t.horario}</span>
      <span class="titulo">${t.titulo}</span>
      <button onclick="concluir(${t.id}, ${!t.concluida})">✓</button>
      <button onclick="deletar(${t.id})">🗑️</button>
    `
    lista.appendChild(div)
  })

  document.getElementById('resumo').textContent =
    `${tarefas.filter(t => t.concluida).length} de ${tarefas.length} concluídas`
}

async function concluir(id, status) {
  await concluirTarefa(id, status ? 1 : 0)
  renderTarefas()
}

async function deletar(id) {
  await deletarTarefa(id)
  renderTarefas()
}

document.getElementById('btn-adicionar')
  .addEventListener('click', async () => {
    const titulo   = prompt('Nome da tarefa:')
    const horario  = prompt('Horário (ex: 09:00):')
    const duracao  = prompt('Duração em minutos:')
    if (titulo && horario && duracao) {
      await criarTarefa({ titulo, horario, duracao: Number(duracao) })
      renderTarefas()
    }
  })

renderTarefas()  // carrega ao abrir a página