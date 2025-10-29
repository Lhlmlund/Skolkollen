import { prisma } from '../prismaClient.js'

export async function listUsers(){
    return await prisma.user.findMany()
}

export async function getUserById(id){
    return await prisma.user.findUnique({
        where: { id }
    })
}

export async function registerUser(data){
    return await prisma.user.create({
        data
    })
}

export function updateUserById(id, data) {
    return prisma.user.update({
        where: { id: Number(id) },
        data,
    });
}

export function deleteUserById(id) {
    return prisma.user.delete({
        where: { id: Number(id) },
    });
}

export function getUserByEmail(email){
    return prisma.user.findUnique({
        where : {email}
    });
}
