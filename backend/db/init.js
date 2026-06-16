// =============================================================
// INIT.JS — Inicializa o banco de dados
// Lê o schema.sql e o seeds.sql e os executa no SQLite.
// Execute UMA vez antes de iniciar o servidor pela primeira vez.
//
// Como usar:
//   cd backend
//   node db/init.js
// =============================================================

const fs   = require('fs')
const path = require('path')
const db   = require('./database')

console.log('\n🔧 Inicializando banco de dados MyFinance...')
console.log(`📂 Arquivo do banco: ${path.join(__dirname, 'myfinance.db')}\n`)

// --- SCHEMA ---
const schemaPath = path.join(__dirname, 'schema.sql')
const schema     = fs.readFileSync(schemaPath, 'utf-8')

try {
  // db.exec() executa múltiplos comandos SQL separados por ponto-e-vírgula.
  // Diferente do db.prepare().run() que executa um comando por vez.
  db.exec(schema)
  console.log('✅ Tabelas criadas com sucesso! (19 tabelas)')
} catch (err) {
  console.error('❌ Erro ao criar tabelas:', err.message)
  process.exit(1)  // Encerra o processo com código de erro (não-zero = erro)
}

// --- SEEDS ---
const seedsPath = path.join(__dirname, 'seeds.sql')
const seeds     = fs.readFileSync(seedsPath, 'utf-8')

try {
  db.exec(seeds)
  console.log('✅ Dados iniciais inseridos!')
  console.log('   → Usuário: admin@myfinance.com')
  console.log('   → Senha:   admin123')
  console.log('   → 11 categorias financeiras padrão\n')
} catch (err) {
  console.error('❌ Erro ao inserir seeds:', err.message)
  process.exit(1)
}

// --- VERIFICAÇÃO ---
// Conta quantas tabelas foram criadas para confirmar
const tabelas = db.prepare(`
  SELECT count(*) as total
  FROM sqlite_master
  WHERE type = 'table' AND name NOT LIKE 'sqlite_%'
`).get()

console.log(`📊 Verificação: ${tabelas.total} tabelas encontradas no banco.`)
console.log('\n🎉 Banco de dados pronto! Agora execute: npm run dev\n')
