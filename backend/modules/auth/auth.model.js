const db = require('../../db/database')

function findByEmail(email) {
  return db.prepare('SELECT * FROM users WHERE email = ?').get(email)
}

function findById(id) {
  return db.prepare('SELECT id, nome, email, avatar, criado_em FROM users WHERE id = ?').get(id)
}

function updateSenha(id, senhaHash) {
  return db.prepare('UPDATE users SET senha_hash = ? WHERE id = ?').run(senhaHash, id)
}

function updateAvatar(id, avatar) {
  return db.prepare('UPDATE users SET avatar = ? WHERE id = ?').run(avatar, id)
}

function updateNome(id, nome) {
  return db.prepare('UPDATE users SET nome = ? WHERE id = ?').run(nome, id)
}

function getConfig(userId) {
  return db.prepare('SELECT moeda, fuso_horario, inicio_semana, tema, habito_reset_hora FROM configuracoes WHERE user_id = ?').get(userId)
}

function updateConfig(userId, dados) {
  const campos = []
  const valores = []
  const permitidos = ['moeda', 'fuso_horario', 'inicio_semana', 'tema', 'habito_reset_hora']
  for (const c of permitidos) {
    if (dados[c] !== undefined) {
      campos.push(`${c} = ?`)
      valores.push(dados[c])
    }
  }
  if (campos.length === 0) return null
  valores.push(userId)
  return db.prepare(`UPDATE configuracoes SET ${campos.join(', ')} WHERE user_id = ?`).run(...valores)
}

module.exports = { findByEmail, findById, updateSenha, updateAvatar, updateNome, getConfig, updateConfig }
