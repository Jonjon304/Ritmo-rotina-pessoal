// =============================================================
// SQLITE SESSION STORE — Store de sessão para express-session
// Usa better-sqlite3 (síncrono, sem dependências vulneráveis)
// Substitui connect-sqlite3 (que dependia de sqlite3 legado)
// =============================================================

const Database = require('better-sqlite3')
const path = require('path')
const { EventEmitter } = require('events')

const ONE_DAY = 86400000
const DEFAULT_TABLE = 'sessions'
const DEFAULT_DB = 'sessions.db'

module.exports = function (session) {
  const Store = session.Store

  function BetterSQLite3Store(options) {
    options = options || {}
    Store.call(this, options)

    this.table = options.table || DEFAULT_TABLE
    const dbName = options.db || DEFAULT_DB
    const dbDir = options.dir || '.'
    const dbPath = dbName.includes(':memory:')
      ? dbName
      : path.join(dbDir, dbName)

    this.db = new Database(dbPath)
    this.db.pragma('journal_mode = WAL')
    this.db.exec(
      `CREATE TABLE IF NOT EXISTS ${this.table} (` +
        'sid TEXT PRIMARY KEY, ' +
        'expired INTEGER NOT NULL, ' +
        'sess TEXT NOT NULL)'
    )

    this._client = new EventEmitter()

    const cleanup = this._cleanup.bind(this)
    cleanup()
    setInterval(cleanup, ONE_DAY).unref()

    const self = this
    process.nextTick(() => self._client.emit('connect'))
  }

  BetterSQLite3Store.prototype = Object.create(Store.prototype)
  BetterSQLite3Store.prototype.constructor = BetterSQLite3Store

  BetterSQLite3Store.prototype._cleanup = function () {
    const now = Date.now()
    this.db.prepare(`DELETE FROM ${this.table} WHERE expired < ?`).run(now)
  }

  BetterSQLite3Store.prototype.get = function (sid, fn) {
    try {
      const now = Date.now()
      const row = this.db.prepare(
        `SELECT sess FROM ${this.table} WHERE sid = ? AND expired >= ?`
      ).get(sid, now)
      if (!row) return fn(null, null)
      return fn(null, JSON.parse(row.sess))
    } catch (err) {
      return fn(err)
    }
  }

  BetterSQLite3Store.prototype.set = function (sid, sess, fn) {
    try {
      const maxAge = sess.cookie.maxAge
      const now = Date.now()
      const expired = maxAge ? now + maxAge : now + ONE_DAY
      this.db.prepare(
        `INSERT OR REPLACE INTO ${this.table} (sid, expired, sess) VALUES (?, ?, ?)`
      ).run(sid, expired, JSON.stringify(sess))
      if (fn) fn(null)
    } catch (err) {
      if (fn) fn(err)
    }
  }

  BetterSQLite3Store.prototype.destroy = function (sid, fn) {
    try {
      this.db.prepare(`DELETE FROM ${this.table} WHERE sid = ?`).run(sid)
      if (fn) fn(null)
    } catch (err) {
      if (fn) fn(err)
    }
  }

  BetterSQLite3Store.prototype.touch = function (sid, sess, fn) {
    try {
      if (sess.cookie && sess.cookie.expires) {
        const expired = new Date(sess.cookie.expires).getTime()
        const now = Date.now()
        this.db.prepare(
          `UPDATE ${this.table} SET expired = ?, sess = ? WHERE sid = ? AND expired >= ?`
        ).run(expired, JSON.stringify(sess), sid, now)
      }
      if (fn) fn(null)
    } catch (err) {
      if (fn) fn(err)
    }
  }

  BetterSQLite3Store.prototype.all = function (fn) {
    try {
      const now = Date.now()
      const rows = this.db.prepare(
        `SELECT sess FROM ${this.table} WHERE expired >= ?`
      ).all(now)
      return fn(null, rows.map(r => JSON.parse(r.sess)))
    } catch (err) {
      return fn(err)
    }
  }

  BetterSQLite3Store.prototype.length = function (fn) {
    try {
      const now = Date.now()
      const row = this.db.prepare(
        `SELECT COUNT(*) AS count FROM ${this.table} WHERE expired >= ?`
      ).get(now)
      return fn(null, row.count)
    } catch (err) {
      return fn(err)
    }
  }

  BetterSQLite3Store.prototype.clear = function (fn) {
    try {
      this.db.exec(`DELETE FROM ${this.table}`)
      if (fn) fn(null, true)
    } catch (err) {
      if (fn) fn(err)
    }
  }

  return BetterSQLite3Store
}
