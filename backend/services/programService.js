import {prisma} from "../lib/prisma.js";

export async function listPrograms(){
    return await prisma.program.findMany({
        orderBy:{ name: 'asc'}
    })
}

export async function getProgramsById(id){
    return await prisma.program.find(id)
}

export async function createProgram(name, category, description){
    return await prisma.program.create({
        data: {
            name,
            category,
            description
        }
    })
}

export async function updateProgramById(id, data){
    return await prisma.program.update({
        where: {
            id
        },
        data
    })
}

export async function deleteProgramById(id){
    return await prisma.program.delete({
        where: {
            id
        }
    })
}