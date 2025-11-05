import fetch from 'node-fetch';
import { prisma } from '../prismaClient.js';

const BASE_URL = "https://susanavet.skolverket.se/api/1.1";
const PROGRAM_NAME_MAX = 200;
const SCHOOL_NAME_MAX = 120;

function isGymnasiumProgramFromInfo(info) {
  if (!info) return false;

  const typeCode = (info?.type?.code ?? '').toString().toLowerCase();
  const levels = Array.isArray(info?.educationLevel)
    ? info.educationLevel.map(l => (l?.code ?? '').toString().toLowerCase())
    : [];

  const titleSv = (svText(info?.title) ?? '').toLowerCase();
  const descSv  = (svText(info?.description) ?? '').toLowerCase();

  const isGY        = typeCode.includes('gy');               // SchoolTypeNode.code: GY
  const isISCED3    = levels.some(c => c.includes('3') || c.includes('isced3'));
  const mentionsGym = titleSv.includes('gymnas') || descSv.includes('gymnas');

  const excludeHigher = /(yh|universitet|högskola)\b/.test(typeCode);
  return (isGY || isISCED3 || mentionsGym) && !excludeHigher;
}

function safeSchoolName(name) {
  return safeTitle(name, SCHOOL_NAME_MAX);
}

const providerCache = new Map();

async function ensureSchoolForProvider(providerId) {
  if (!providerId) return null;

  const existing = await prisma.school.findUnique({
    where: { susa_provider_id: providerId },
    select: { id: true, name: true, city: true, website: true, is_gymnasium: true },
  });
  if (existing) return existing;

  if (!providerCache.has(providerId)) {
    const res = await fetch(`${BASE_URL}/educationProviders/${encodeURIComponent(providerId)}`);
    providerCache.set(providerId, res.ok ? await res.json() : null);
  }
  const p = providerCache.get(providerId);
  if (!p) return null;

  const rawName = svText(p?.name) ?? null;
  const name    = safeSchoolName(rawName);
  const city    = p?.visitAddress?.town ?? null;
  const site    = Array.isArray(p?.url?.url)
    ? (p.url.url.find(u => u?.lang?.toLowerCase() === 'sv')?.value ?? p.url.url[0]?.value ?? null)
    : null;

  if (!name) return null;

  const typeCode       = (p?.type?.code ?? '').toString().toLowerCase();
  const schoolYearCode = (p?.schoolYearCode?.code ?? '').toString().toLowerCase();
  const isGYProvider   = typeCode.includes('gy') || schoolYearCode.includes('gy');

  const excludeByName = /(komvux|vuxenutbildning|folkhögskola|universitet|högskola|arbetsförmedlingen)\b/i.test(name);
  const gymFlag = excludeByName ? false : !!isGYProvider;

  return prisma.school.upsert({
    where: { susa_provider_id: providerId },
    update: {
      name,
      city,
      website: site ?? undefined,
      is_gymnasium: gymFlag,               // <-- Boolean
    },
    create: {
      susa_provider_id: providerId,
      name,
      city,
      website: site ?? null,
      is_gymnasium: gymFlag,               // <-- Boolean
    },
    select: { id: true, name: true, city: true, website: true, is_gymnasium: true },
  });
}

// ---------------------------------------------
// Follow HAL-style pagination until there is no "next"
async function fetchPagedStream(baseUrl, endpoint, pageSize, onPage, maxPages = 200) {
  let page = 0;
  let nextUrl = `${baseUrl}/${endpoint}?page=${page}&size=${pageSize}`;

  while (nextUrl && page < maxPages) {
    const res = await fetch(nextUrl);
    if (!res.ok) throw new Error(`Fetch ${endpoint} page ${page} failed: ${res.status}`);
    const data = await res.json();

    const items = Array.isArray(data?.content) ? data.content : [];
    await onPage(items, page);

    const nextFromArray = Array.isArray(data?.links)
      ? data.links.find(l => l?.rel === 'next')?.href
      : null;
    const nextFromHal = data?._links?.next?.href ?? null;

    nextUrl = nextFromHal || nextFromArray || null;
    if (nextUrl && !nextUrl.startsWith('http')) {
      nextUrl = new URL(nextUrl, baseUrl).href;
    }

    page++;
    if (!nextUrl) break;
  }
}
// ---------------------------------------------
// small utilities
const svText = (multi) => {
  if (!multi) return null;

  // Case A: { string: [ { lang, value|content }, ... ] }
  if (Array.isArray(multi?.string)) {
    const sv = multi.string.find(e => e?.lang?.toLowerCase() === 'sv');
    return sv?.value ?? sv?.content ?? multi.string[0]?.value ?? multi.string[0]?.content ?? null;
  }

  // Case B: [ { lang, value|content }, ... ]
  if (Array.isArray(multi)) {
    const sv = multi.find(e => e?.lang?.toLowerCase() === 'sv');
    return sv?.value ?? sv?.content ?? multi[0]?.value ?? multi[0]?.content ?? null;
  }

  // Case C: { lang, value|content }
  if (multi?.lang) {
    return multi.value ?? multi.content ?? null;
  }

  return null;
};

const cleanCdata = (htmlish) => {
  if (!htmlish) return null;
  return String(htmlish)
    .replace(/<!\[CDATA\[|\]\]>/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

const safeTitle = (input, max = 120) => {
  if (!input) return null;
  const plain = String(input)
    .replace(/<!\[CDATA\[|\]\]>/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return plain ? (plain.length > max ? plain.slice(0, max) : plain) : null;
};

async function importProviders() {
  let total = 0;

  await fetchPagedStream(BASE_URL, 'educationProviders', 200, async (pageItems, page) => {
    for (const p of pageItems) {
      const id    = p?.identifier ?? null;

      const rawName = svText(p?.name) ?? null;
      const name    = safeSchoolName(rawName);            // clamp to SCHOOL_NAME_MAX
      const city    = p?.visitAddress?.town ?? null;
      const site    = Array.isArray(p?.url?.url)
        ? (p.url.url.find(u => u?.lang?.toLowerCase() === 'sv')?.value ?? p.url.url[0]?.value ?? null)
        : null;

      if (!name) continue;

      // Provider-level classification (authoritative)
      const typeCode       = (p?.type?.code ?? '').toString().toLowerCase();
      const schoolYearCode = (p?.schoolYearCode?.code ?? '').toString().toLowerCase();
      const isGYProvider   = typeCode.includes('gy') || schoolYearCode.includes('gy');

      // Explicit exclusions by name (optional)
      const excludeByName = /(komvux|vuxenutbildning|folkhögskola|universitet|högskola|arbetsförmedlingen)\b/i.test(name);

      const gymFlag = excludeByName ? false : !!isGYProvider;

      await prisma.school.upsert({
        where: id ? { susa_provider_id: id } : { name }, // fallback by name only if no id
        update: {
          name,
          city,
          website: site ?? undefined,
          is_gymnasium: gymFlag,                          // <-- Boolean, not 0/1
        },
        create: Object.assign(
          id ? { susa_provider_id: id } : {},
          {
            name,
            city,
            website: site ?? null,
            is_gymnasium: gymFlag,                        // <-- Boolean
          },
        ),
      });

      total++;
    }
  }, 200);

  console.log(`Imported ${total} providers → schools`);
}

function categoryFromInfo(info) {
  const v = info?.isVocational;
  if (v === true)  return 'Yrkesutbildning';
  if (v === false) return 'Studieförberedande';
  return null;
}

export async function importInfos() {
  let total = 0, itemErrors = 0;

  await fetchPagedStream(BASE_URL, 'educationInfos', 200, async (infos, page) => {
    for (const info of infos) {
      try {
        const id = info?.identifier;
        if (!id) continue;

        const name = safeTitle(svText(info?.title), PROGRAM_NAME_MAX); // clamp to DB size
        if (!name) continue;

        const desc     = cleanCdata(svText(info?.description));
        const category = categoryFromInfo(info);
        const isGym    = isGymnasiumProgramFromInfo(info);

        await prisma.program.upsert({
          where:  { susa_education_id: id },
          update: {
            name,                                  // do update to keep latest official title
            description: desc ?? undefined,
            category:    category ?? undefined,
            is_gymnasium: isGym,                   // authoritative from Info
          },
          create: {
            susa_education_id: id,
            name,
            description: desc ?? null,
            category,
            is_gymnasium: isGym,
          },
        });

        total++;
      } catch (e) {
        itemErrors++;
        if (itemErrors <= 10) console.warn('info item error:', e?.message ?? e);
      }
    }
  }, /*maxPages*/ 400);

  console.log(`Imported/updated ${total} programs from Infos`);
}

// 2. Import programs + link schools ↔ programs from /educationEvents
function extractProviderIdsFromEvent(ev) {
  // provider can be a list of strings, or via _links
  const ids = new Set();

  // direct field (array of strings)
  if (Array.isArray(ev?.provider)) {
    ev.provider.forEach(p => { if (typeof p === 'string' && p) ids.add(p); });
  } else if (typeof ev?.provider === 'string' && ev.provider) {
    ids.add(ev.provider);
  }

  // HAL links
  const fromArray = Array.isArray(ev?.links)
    ? ev.links.filter(l => l?.rel === 'educationProvider').map(l => l.href)
    : [];
  const fromHal = ev?._links?.educationProvider?.href ? [ev._links.educationProvider.href] : [];

  [...fromArray, ...fromHal].forEach(href => {
    try {
      const seg = href.split('/').filter(Boolean).pop();
      if (seg) ids.add(decodeURIComponent(seg));
    } catch {}
  });

  return [...ids];
}

export async function importProgramsAndLinks() {
  let linked = 0, eventsSeen = 0, itemErrors = 0;

  await fetchPagedStream(BASE_URL, "educationEvents", 200, async (events, page) => {
    for (const ev of events) {
      try {
        eventsSeen++;

        // 1) Resolve program (by EducationInfo identifier)
        const infoId = ev?.education ?? null;
        if (!infoId) continue;

        // Ensure the Program exists (use event title/desc only as fallback)
        const fallbackName = safeTitle(svText(ev?.title) ?? null, PROGRAM_NAME_MAX);
        const fallbackDesc = cleanCdata(svText(ev?.description) ?? null);

        await prisma.program.upsert({
          where: { susa_education_id: infoId },
          update: {
            // Don't overwrite good data with nulls
            name:        fallbackName ?? undefined,
            description: fallbackDesc ?? undefined,
          },
          create: {
            susa_education_id: infoId,
            name:        fallbackName ?? "(utan namn)",
            description: fallbackDesc ?? null,
          },
        });

        // Fetch program id + gymnasium flag once
        const prog = await prisma.program.findUnique({
          where: { susa_education_id: infoId },
          select: { id: true, is_gymnasium: true },
        });
        if (!prog) continue; // extremely unlikely right after upsert

        // 2) Link to all providers present on the event
        const providerIds = extractProviderIdsFromEvent(ev);
        if (!providerIds.length) continue;

        for (const pid of providerIds) {
          const school = await ensureSchoolForProvider(pid);
          if (!school) continue;

          // Upsert the link
          await prisma.schoolProgram.upsert({
            where: { school_id_program_id: { school_id: school.id, program_id: prog.id } },
            create: { school_id: school.id, program_id: prog.id },
            update: {},
          });
          linked++;

          // Immediate authoritative tagging: if program is gymnasium, mark school as gymnasium
          if (prog.is_gymnasium === true) {
            await prisma.school.update({
              where: { id: school.id },
              data: { is_gymnasium: true },
            });
          }
        }
      } catch (e) {
        itemErrors++;
        if (itemErrors <= 10) {
          console.warn("event item error:", e?.message ?? e);
        }
      }
    }
  });

  console.log(`Linked ${linked} school↔program pairs from ${eventsSeen} events`);
}

// STEP 4: Tag schools with gymnasium programs (authoritative, link-based)
async function tagGymnasiumSchoolsSQL() {

  // 2) tag by links to gymnasium programs
  await prisma.$executeRawUnsafe(`
    UPDATE school s
    SET s.is_gymnasium = EXISTS (
      SELECT 1
      FROM school_program sp
      JOIN program p ON p.id = sp.program_id
      WHERE sp.school_id = s.id
        AND p.is_gymnasium = 1
    )
  `);

  // 3) (optional) hard exclusions AFTER tagging (keeps Kommun/uni out)
  await prisma.$executeRawUnsafe(`
    UPDATE school
    SET is_gymnasium = 0
    WHERE name REGEXP '(\\\\bkommun\\\\b|\\\\bstad\\\\b|komvux|vuxenutbildning|folkhögskola|universitet|högskola|arbetsförmedlingen)'
  `);

  // 4) Soft promotion by name (if any genuine gymnasiums slipped through)
 // await prisma.$executeRawUnsafe(`
 //   UPDATE school
 //   SET is_gymnasium = TRUE
 //   WHERE is_gymnasium = FALSE
 //     AND name REGEXP '(gymnas(ium|iet)\\\\b)'
 //     AND name NOT REGEXP '(\\\\bkommun\\\\b|\\\\bstad\\\\b|komvux|vuxenutbildning|folkhögskola|universitet|högskola|arbetsförmedlingen)'
 // `);
}
// Master sync function
export async function syncFromSusa() {
  console.log("STEP 1: Providers → schools");
  await importProviders();

  console.log("STEP 2: Infos → programs (+ gymnasium flag)");
  await importInfos();

  console.log("STEP 3: Events → school_program links");
  await importProgramsAndLinks();

  console.log("STEP 4: Tag schools with gymnasium programs");
  await tagGymnasiumSchoolsSQL();

  console.log("✅ SUSA sync done");
}