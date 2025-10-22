// backend/services/schoolService.js
import { prisma } from '../prismaClient.js';

// List with optional city filter
export function listSchools({ city } = {}) {
  return prisma.school.findMany({
    where: city ? { city: { equals: city } } : undefined,
    orderBy: { name: 'asc' },
  });
}

export function getSchoolById(id) {
  return prisma.school.findUnique({
    where: { id: Number(id) },
    include: {
      programs: { include: { program: true } }, // SchoolProgram[] + nested Program
    },
  });
}

export async function createSchool(data, programIds) {
  // If School.programs is the JOIN model, create join rows that connect to Program
  if (programIds.length) {
    data.programs = {
      create: programIds.map((programId) => ({
        program: { connect: { id: programId } },
      })),
    };
  }

  return prisma.school.create({
    data,
    include: {
      programs: { include: { program: true } },
    },
  });
}

export async function updateSchoolById(id, data, programIds) {
  // Replace all links when programIds provided
  if (Array.isArray(programIds)) {
    data.programs = {
      deleteMany: {}, // remove existing join rows
      create: programIds.map((programId) => ({
        program: { connect: { id: programId } },
      })),
    };
  }

  return prisma.school.update({
    where: { id: Number(id) },
    data,
    include: {
      programs: { include: { program: true } },
    },
  });
}

export function deleteSchoolById(id) {
  return prisma.school.delete({
    where: { id: Number(id) },
  });
}
