import { prisma } from '../prismaClient.js';

export async function listPrograms(){
    return await prisma.program.findMany({
        orderBy:{ name: 'asc'}
    })
}

export async function getProgramsById(id){
    return await prisma.program.findUnique({
        where: { id }
    })
}

export async function createProgram(data){
    return await prisma.program.create({
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