// backend/services/schoolService.js
import { prisma } from '../prismaClient.js';

// List with optional city filter
export function listSchools({ city } = {}) {
  return prisma.school.findMany({
    where: city ? { city: { equals: city } } : undefined,
    orderBy: { name: 'asc' },
  });
}

// NOTE: onlyGymnasium uses Prisma field name isGymnasium (camelCase)
export async function listSchoolsWithPrograms({ onlyGymnasium = false } = {}) {
  const where = onlyGymnasium ? { isGymnasium: true } : {};

  const schools = await prisma.school.findMany({
    where,
    include: {
      // join table + nested Program
      SchoolPrograms: {
        include: { Program: true },
      },
    },
    orderBy: { name: 'asc' },
  });

  // Flatten to match the old API shape the frontend expects
  return schools.map((s) => ({
    id: s.id,
    name: s.name,
    city: s.city,
    website: s.website,
    // keep both for backward compat if your FE reads snake_case:
    is_gymnasium: s.isGymnasium,
    isGymnasium: s.isGymnasium,
    programs: (s.SchoolPrograms ?? []).map((sp) => ({
      id: sp.Program.id,
      name: sp.Program.name,
      // category/description exist in new schema; include if your UI uses them:
      category: sp.Program.category ?? null,
      description: sp.Program.description ?? null,
    })),
  }));
}

export function getSchoolById(id) {
  return prisma.school.findUnique({
    where: { id: Number(id) },
    include: {
      SchoolPrograms: { include: { Program: true } }, // join + nested Program
    },
  });
}

// Create a school and (optionally) link programIds via join model
export async function createSchool(data, programIds = []) {
  const dataWithLinks = { ...data };

  if (Array.isArray(programIds) && programIds.length) {
    dataWithLinks.SchoolPrograms = {
      create: programIds.map((programId) => ({
        Program: { connect: { id: Number(programId) } },
      })),
    };
  }

  return prisma.school.create({
    data: dataWithLinks,
    include: {
      SchoolPrograms: { include: { Program: true } },
    },
  });
}

// Update a school and (optionally) replace all program links
export async function updateSchoolById(id, data, programIds) {
  const dataWithLinks = { ...data };

  if (Array.isArray(programIds)) {
    dataWithLinks.SchoolPrograms = {
      deleteMany: {}, // remove all existing links
      create: programIds.map((programId) => ({
        Program: { connect: { id: Number(programId) } },
      })),
    };
  }

  return prisma.school.update({
    where: { id: Number(id) },
    data: dataWithLinks,
    include: {
      SchoolPrograms: { include: { Program: true } },
    },
  });
}

export function deleteSchoolById(id) {
  return prisma.school.delete({
    where: { id: Number(id) },
  });
}
