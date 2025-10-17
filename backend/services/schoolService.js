import { prisma } from '../lib/prisma.js';

export async function getSchools() {
  return await prisma.school.findMany();
  //Refactor filtering to Prisma later
}


export async function getSchoolByID(id) {
  return await prisma.school.findUnique({
    where: {
      id
    }
  })
}

export async function createSchool(name, city, website, programIds = []) {
  return await prisma.school.create({
    data: {
      name,
      city,
      website,
      programs: {
        create: programIds.map((id) => ({
          program: { connect: { id } },
        })),
      },
    },
    include: { programs: { include: { program: true } } },
  });
}

export async function updateSchoolByID(id, data) {
  await prisma.school.update({
    where: {
      id
    },
    data,
    include: { programs: { include: { program: true } } },
  })

  return getSchoolByID(id);
}

export async function deleteSchoolByID(id) {
  return await prisma.school.delete({
    where: {
      id
    }
  })
}