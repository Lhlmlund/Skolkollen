const schoolService = require('../services/schoolService.js')

/**
 * Retrieves all schools from the database.
 * @param req
 * @param res
 * @returns {Promise<*>} json with [schools] or error message
 */
async function getSchools(req, res){
    try {
        const result = await schoolService.getSchools()
        return res.json({result})
    } catch (error) {
        return res.json({
            error: error.message
        })
    }

}


module.exports = {
    getSchools
}