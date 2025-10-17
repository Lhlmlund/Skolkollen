import { prisma } from '../lib/prisma.js';

export async function getSchools() {
  return await prisma.school.findMany();
}


export async function getSchoolByID(id) {
  return await prisma.school.findUnique({
    where: {
      id: id
    }
  })
}

export async function createSchool(school) {
  const {
    name,
    city = null,
    programs = null,
    open_house_date = null,
    website = null,
  } = school;

  const [result] = await pool.query(
    `
    INSERT INTO school (name, city, programs, open_house_date, website)
    VALUES (?, ?, ?, ?, ?)
    `,
    [name, city, programs, open_house_date, website]
  );

  return getSchoolByID(result.insertId);
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
      id: id
    }
  })
}