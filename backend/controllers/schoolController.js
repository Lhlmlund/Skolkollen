const schoolService = require('../services/schoolService.js')

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