function paginar(query) {
  const pagina = Math.max(1, parseInt(query.pagina) || 1)
  const limite = Math.min(100, Math.max(1, parseInt(query.limite) || 20))
  const offset = (pagina - 1) * limite
  return { limite, offset, pagina }
}

function formatarRespostaPaginada(dados, total, pagina, limite) {
  return {
    dados,
    total,
    pagina,
    limite,
    total_paginas: Math.ceil(total / limite)
  }
}

module.exports = { paginar, formatarRespostaPaginada }
