import { prisma } from '../lib/prisma.js';

export async function getSchools() {
  return await prisma.school.findMany();
  //Reformat filtering to Prisma later
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

export async function updateSchoolByID(id, fields) {
  const allowed = ['name', 'city', 'programs', 'open_house_date', 'website'];
  const setParts = [];
  const params = [];

  for (const key of allowed) {
    if (fields[key] !== undefined) {
      setParts.push(`${key} = ?`);
      params.push(fields[key]);
    }
  }

  if (setParts.length === 0) {
    return null;
  }

  params.push(id);

  const [result] = await pool.query(
    `UPDATE school SET ${setParts.join(', ')} WHERE id = ?`,
    params
  );

  if (result.affectedRows === 0) {
    return null;
  }

  return getSchoolByID(id);
}

export async function deleteSchoolByID(id) {
  return await prisma.school.delete({
    where: {
      id
    }
  })
}