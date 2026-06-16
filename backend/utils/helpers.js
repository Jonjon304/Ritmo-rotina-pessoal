function formatarMoedaBRL(valor) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)
}

function formatarDataISO(data) {
  if (!data) return null
  return new Date(data).toISOString().split('T')[0]
}

function obterMesAtual() {
  const agora = new Date()
  return `${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, '0')}`
}

function obterHoje() {
  return new Date().toISOString().split('T')[0]
}

function calcularStreak(dias) {
  if (!dias || dias.length === 0) return 0
  const ordenados = dias.map(d => d.data).sort().reverse()
  const hoje = obterHoje()
  let streak = 0
  let diaAtual = hoje

  for (const d of ordenados) {
    if (d === diaAtual) {
      streak++
      const dt = new Date(diaAtual)
      dt.setDate(dt.getDate() - 1)
      diaAtual = dt.toISOString().split('T')[0]
    } else if (d < diaAtual) {
      break
    }
  }
  return streak
}

module.exports = { formatarMoedaBRL, formatarDataISO, obterMesAtual, obterHoje, calcularStreak }
