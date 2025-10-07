const schoolController = require('../controllers/schoolController.js')
const express = require( 'express')
const router = express.Router()

router.get('/schools',schoolController.getSchools)

module.exports = router;