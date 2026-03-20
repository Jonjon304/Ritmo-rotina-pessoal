const API = 'http://localhost:3000/api'

// busca todas as tarefas
async function getTarefas() {
  const res = await fetch(`${API}/tarefas`)
  return res.json()
}

// cria nova tarefa
async function criarTarefa(dados) {
  const res = await fetch(`${API}/tarefas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados)
  })
  return res.json()
}

// marca como concluída
async function concluirTarefa(id, concluida) {
  await fetch(`${API}/tarefas/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ concluida })
  })
}

// deleta uma tarefa
async function deletarTarefa(id) {
  await fetch(`${API}/tarefas/${id}`, { method: 'DELETE' })
}