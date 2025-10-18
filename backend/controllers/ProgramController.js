export async function getPrograms(req, res){
    try {
        const rows = getProgramsSvc()
        res.status(200).json(rows)
    }catch (error) {
        console.error('getPrograms error:', error)
        res.status(500).send('failed to fetch programs')
    }
}

export async function getProgramById(req, res){
    const id = Number(req.params.id)
    try {
        const row = getProgramByIdSvc(id)
        res.status(200).json(row)
    }catch(error){
        console.error('getProgramByID error:', error)
        res.status(500).send('failed to fetch program by Id:', id)
    }
}

export async function createProgram(req, res){
    const {name, category, description } = res.body
    try {
        const program = await creatProgramSvc(name, category, description)
        res.status(200).json({
            success: true,
            program
        })
    } catch (error) {
        console.error('createProgram error:', error)
        res.status(500).send('failed to create program')
    }
}