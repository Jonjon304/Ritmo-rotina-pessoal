const express = require('express')
const router = express.Router()
const hubService = require('./hub.service')
const { requireAuth } = require('../../middleware/auth')

router.get('/dashboard', requireAuth, (req, res, next) => {
  try { res.json(hubService.dashboard(req.session.userId)) } catch (e) { next(e) }
})

module.exports = router
