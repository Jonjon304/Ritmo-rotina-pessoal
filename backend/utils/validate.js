function validarCamposObrigatorios(campos, corpo) {
  const faltantes = campos.filter(c => corpo[c] === undefined || corpo[c] === null || corpo[c] === '')
  if (faltantes.length > 0) {
    const err = new Error(`Campos obrigatórios ausentes: ${faltantes.join(', ')}`)
    err.status = 400
    throw err
  }
}

function validarEmail(email) {
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    const err = new Error('Email inválido')
    err.status = 400
    throw err
  }
}

function validarEnum(valor, valores, campo) {
  if (valor !== undefined && !valores.includes(valor)) {
    const err = new Error(`Valor inválido para ${campo}. Permitidos: ${valores.join(', ')}`)
    err.status = 400
    throw err
  }
}

function validarInteiroPositivo(valor, campo) {
  if (valor !== undefined && (isNaN(valor) || parseInt(valor) <= 0)) {
    const err = new Error(`${campo} deve ser um número inteiro positivo`)
    err.status = 400
    throw err
  }
}

function validarNumeroPositivo(valor, campo) {
  if (valor !== undefined && (isNaN(valor) || parseFloat(valor) < 0)) {
    const err = new Error(`${campo} deve ser um número positivo`)
    err.status = 400
    throw err
  }
}

function sanitizarString(str) {
  if (typeof str !== 'string') return str
  return str.trim()
}

module.exports = {
  validarCamposObrigatorios,
  validarEmail,
  validarEnum,
  validarInteiroPositivo,
  validarNumeroPositivo,
  sanitizarString
}
