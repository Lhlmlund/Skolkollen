import { prisma } from '../prismaClient.js';

export async function listOpenHouseEvents(){
    return await prisma.openHouseEvent.findMany({
        orderBy:{ name: 'asc'}
    })
}

export async function getOpenHouseEventById(id){
    return await prisma.openHouseEvent.findUnique({
        where: { id }
    })
}

export async function createOpenHouseEvent(data){
    return await prisma.openHouseEvent.create({
        data
    })
}

export function updateProgramById(id, data) {
    return prisma.program.update({
        where: { id: Number(id) },
        data,
    });
}

export function deleteProgramById(id) {
    return prisma.program.delete({
        where: { id: Number(id) },
    });
}
