const hubModel = require('./hub.model')

function dashboard(userId) {
  return hubModel.dashboard(userId)
}

module.exports = { dashboard }
