const schoolController = require('../controllers/schoolController.js')
const express = require( 'express')
const router = express.Router()

router.get('/schools',schoolController.getSchools)
router.get('/ok', (req, res) => {
    return res.send('ok')
})

module.exports = router;