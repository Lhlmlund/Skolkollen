import { prisma } from '../prismaClient.js';

export async function listUsers() {
  return prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
}

export async function getUserById(id) {
  return prisma.user.findUnique({
    where: { id: Number(id) },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
}

export async function registerUser(data) {
  return prisma.user.create({
    data,
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
}

export function updateUserById(id, data) {
  return prisma.user.update({
    where: { id: Number(id) },
    data,
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
}

export function deleteUserById(id) {
  return prisma.user.delete({
    where: { id: Number(id) },
  });
}

export function getUserByEmail(email) {
  return prisma.user.findUnique({
    where: { email },
    select: { id: true, name: true, email: true, role: true, passwordHash: true },
  });
}
