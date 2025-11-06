// backend/services/schoolService.js
import { prisma } from '../prismaClient.js';

// List with optional city filter
export function listSchools({ city } = {}) {
  return prisma.school.findMany({
    where: city ? { city: { equals: city } } : undefined,
    orderBy: { name: 'asc' },
  });
}
export async function listSchoolsWithPrograms() {
  const schools = await prisma.school.findMany({
    include: {

      SchoolPrograms: {
        include: { Program: true },
      },
    },
    orderBy: { name: 'asc' },
  });

  // keep the same flattened shape Home.vue expects
  return schools.map((s) => ({
    id: s.id,
    name: s.name,
    city: s.city,
    website: s.website,
    // return program *names* just like before
    programs: (s.SchoolPrograms ?? []).map((sp) => sp.Program.name),
  }));
}

// NOTE: onlyGymnasium uses Prisma field name isGymnasium (camelCase)
export async function listGymSchoolsWithPrograms({ onlyGymnasium = false } = {}) {
  const where = onlyGymnasium ? { isGymnasium: true } : {};

  const schools = await prisma.school.findMany({
    where,
    include: {
      SchoolPrograms: {
        include: { Program: true },
      },
    },
    orderBy: { name: 'asc' },
  });

  const mapPhone = (json) => {
    try {
      if (!json) return [];
      // json is stored as JSON in DB; Prisma returns JS object already
      const arr = Array.isArray(json) ? json : [];
      return arr
        .map(p => {
          const num = (p?.number ?? '').toString().trim();
          const fn  = (p?.function ?? '')?.toString().trim();
          if (!num) return null;
          return fn ? `${fn}: ${num}` : num;
        })
        .filter(Boolean);
    } catch {
      return [];
    }
  };

  return schools.map((s) => ({
    id: s.id,
    name: s.name,
    website: s.website ?? null,
    email: s.email ?? null,
    phone: mapPhone(s.phoneJson),               // <- nice, flat array of strings
    country: s.country ?? null,
    municipality_code: s.municipalityCode ?? null,
    city: s.city ?? null,
    street_address: s.streetAddress ?? null,
    post_code: s.postCode ?? null,

    // keep both for FE compatibility
    is_gymnasium: s.isGymnasium,
    isGymnasium: s.isGymnasium,

    programs: (s.SchoolPrograms ?? []).map((sp) => ({
      id: sp.Program.id,
      name: sp.Program.name,
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
