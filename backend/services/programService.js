import {prisma} from "../lib/prisma.js";

export async function getPrograms(){
    return await prisma.program.findMany()
}