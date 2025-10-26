// backend/scripts/importSchoolsFromJson.js
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { prisma } from '../prismaClient.js';
import { schoolCreateSchema } from '../zodSchema/schoolSchema.js';
import { createSchool } from '../services/schoolService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const jsonPath = path.join(__dirname, 'schools.json'); // put a sample json school file here
  const raw = await fs.readFile(jsonPath, 'utf8');
  const payload = JSON.parse(raw);

  // Validate either an array of schools or a single school
  const arraySchema = schoolCreateSchema.array();
  const parsed = arraySchema.safeParse(payload);
  if (!parsed.success) {
    console.error('Validation failed:\n', JSON.stringify(parsed.error.format(), null, 2));
    process.exit(1);
  }

  for (const school of parsed.data) {
    await createSchool(school);
  }

  console.log(`Imported ${parsed.data.length} school(s) successfully.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());