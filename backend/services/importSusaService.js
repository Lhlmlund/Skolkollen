import fetch from 'node-fetch';
import { prisma } from '../prismaClient.js';

const BASE_URL = 'https://susanavet2.skolverket.se/api/1.1'; // their current base used in Swagger
const PAGE_SIZE = 200;
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

const normalizeEmpty = v => {
  if (v === undefined || v === null) return null;
  const s = String(v).trim();
  return s.length ? s : null;
};

// Format Swedish post code to "NNN NN" (6 chars) or return null
const normalizeSEPostCode = (v) => {
  if (v == null) return null;
  const digits = String(v).replace(/\D/g, '');
  if (digits.length < 5) return null;
  const d = digits.slice(0, 5);
  return `${d.slice(0, 3)} ${d.slice(3, 5)}`; // e.g. "181 32"
};

const toNumOrNull = v => (v === undefined || v === null || isNaN(Number(v)) ? null : Number(v));

async function ensureSchoolForProvider(providerId) {
  if (!providerId) return null;

  // ✅ 1) Try existing by susaProviderId FIRST → no extra HTTP if found
  const existing = await prisma.school.findUnique({
    where: { susaProviderId: providerId },
    select: { id: true, name: true, city: true, website: true, isGymnasium: true },
  });
  if (existing) return existing;

  // 2) Fetch + cache provider payload only if we don't have the school
  if (!providerCache.has(providerId)) {
    const res = await fetch(`${BASE_URL}/educationProviders/${encodeURIComponent(providerId)}`);
    providerCache.set(providerId, res.ok ? await res.json() : null);
  }
  const p = providerCache.get(providerId);
  if (!p) return null;

  // --- extract & normalize (unchanged) ---
  const rawName = svText(p?.name) ?? null;
  const name    = safeSchoolName(rawName);
  if (!name) return null;

  const site  = normalizeEmpty(pickUrlSv(p?.url));
  const email = normalizeEmpty(p?.emailAddress);

  const cityNorm    = normalizeEmpty(p?.visitAddress?.town);
  const countryNorm = normalizeEmpty(p?.visitAddress?.country);
  const muniNorm    = normalizeEmpty(p?.visitAddress?.municipalityCode);
  const streetNorm  = normalizeEmpty(p?.visitAddress?.streetAddress);
  const postNorm    = normalizeSEPostCode(p?.visitAddress?.postCode);

  const latNum = toNumOrNull(p?.visitAddress?.position?.lat);
  const lonNum = toNumOrNull(p?.visitAddress?.position?.lon);

  const rawPhones = Array.isArray(p?.phone) ? p.phone : (p?.phone ? [p.phone] : []);
  const phoneClean = rawPhones
    .map(ph => ({
      function: normalizeEmpty(ph?.function ?? ph?.role),
      number: normalizeEmpty(ph?.number),
    }))
    .filter(ph => ph.number);

  const responsibleBodyStr = normalizeEmpty(svText(p?.responsibleBody?.name));

  const typeCode       = (p?.type?.code ?? '').toString().toLowerCase();
  const schoolYearCode = (p?.schoolYearCode?.code ?? '').toString().toLowerCase();
  const isGYProvider   = typeCode.includes('gy') || schoolYearCode.includes('gy');

  const excludeByName = /(komvux|vuxenutbildning|folkhögskola|universitet|högskola|arbetsförmedlingen)\b/i.test(name);
  const gymHint = excludeByName ? false : !!isGYProvider;

  const lastEdited = toDate(p?.lastEdited);
  const expiresAt  = toDate(p?.expires);

  const dataCommon = {
    name,
    website: site,
    email,
    phoneJson: phoneClean.length ? phoneClean : null,
    country: countryNorm,
    municipalityCode: muniNorm,
    city: cityNorm,
    streetAddress: streetNorm,
    postCode: postNorm,
    lat: latNum,
    lon: lonNum,
    responsibleBody: responsibleBodyStr,
    accreditation: normalizeEmpty(p?.accreditation?.code),
    foundedYear: typeof p?.year === 'number' ? p?.year : null,
    lastEdited,
    expiresAt,
    extraJson: p?.extension ?? null,
  };

  // 3) Merge by (name, city) first to respect ux_school_name_city
  const byComposite = await prisma.school.findFirst({
    where: { name, city: cityNorm },
    select: { id: true, susaProviderId: true },
  });

  if (byComposite) {
    return prisma.school.update({
      where: { id: byComposite.id },
      data: { ...dataCommon, ...(byComposite.susaProviderId ? {} : { susaProviderId: providerId }) },
      select: { id: true, name: true, city: true, website: true, isGymnasium: true },
    });
  }

  // 4) No match → create new
  return prisma.school.create({
    data: { susaProviderId: providerId, ...dataCommon },
    select: { id: true, name: true, city: true, website: true, isGymnasium: true },
  });
}

// ---------------------------------------------
// Follow HAL-style pagination until there is no "next"
async function fetchPagedStream(baseUrl, endpoint, pageSize, onPage, maxPages = 400) {
  let page = 0;
  let nextUrl = `${baseUrl}/${endpoint}?page=${page}&size=${pageSize}`;

  while (nextUrl && page < maxPages) {
    const res = await fetch(nextUrl);
    if (!res.ok) throw new Error(`Fetch ${endpoint} page ${page} failed: ${res.status}`);
    const data = await res.json();

    const items = Array.isArray(data?.content) ? data.content : [];
    await onPage(items, page);

        if (page % 5 === 0) {   // every 5 pages — change to 1 if you want very frequent logs
      console.log(`[${endpoint}] page=${page} items=${items.length}`);
    }

    // HAL-style
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

const toDate = (s) => (s ? new Date(s) : null);

const pickUrlSv = (urlNode) => {
  // url can be { url: [{ lang, value }, ...] } or string-ish
  if (Array.isArray(urlNode?.url)) {
    const sv = urlNode.url.find(u => u?.lang?.toLowerCase() === 'sv');
    return sv?.value ?? urlNode.url[0]?.value ?? null;
  }
  if (typeof urlNode === 'string') return urlNode;
  return null;
};

async function importProviders() {
  let total = 0;
  await fetchPagedStream(BASE_URL, 'educationProviders', PAGE_SIZE, async (providers, page) => {
    for (const p of providers) {
      const id = p?.identifier ?? null;
      if (!id) continue;
      await ensureSchoolForProvider(id);
      total++;
    }
  }, 400);
  console.log(`Imported ${total} providers → schools`);
}

// ---------- Infos → Program ----------
const categoryFromInfo = (info) => {
  const v = info?.isVocational;
  if (v === true)  return true;
  if (v === false) return false;
  return null;
};

async function importInfos() {
  let total = 0, itemErrors = 0;

  await fetchPagedStream(BASE_URL, 'educationInfos', PAGE_SIZE, async (infos, page) => {
    for (const info of infos) {
      try {
        const id = info?.identifier;
        if (!id) continue;

        const name     = safeTitle(svText(info?.title), PROGRAM_NAME_MAX);
        if (!name) continue;
        const desc     = cleanCdata(svText(info?.description));
        const isGym    = isGymnasiumProgramFromInfo(info);
        const isVoc    = categoryFromInfo(info);

        const levels   = Array.isArray(info?.educationLevel) ? info.educationLevel : null;
        const orients  = Array.isArray(info?.orientation) ? info.orientation : null;
        const subjects = Array.isArray(info?.subject) ? info.subject : null;
        const keywords = Array.isArray(info?.keyword) ? info.keyword : null;

        await prisma.program.upsert({
          where:  { susaEducationId: id },
          update: {
            name,
            description: desc ?? undefined,
            isGymnasium: isGym,
            isVocational: isVoc,
            educationLevels: levels ?? undefined,
            orientationsJson: orients ?? undefined,
            subjectsJson: subjects ?? undefined,
            qualification: info?.qualificationLevel?.code ?? undefined,
            resultDegree: info?.degree?.code ?? undefined,
            credits: info?.credits?.value ?? undefined,
            keywordsJson: keywords ?? undefined,
            lastEdited: toDate(info?.lastEdited) ?? undefined,
            expiresAt: toDate(info?.expires) ?? undefined,
            extraJson: info?.extension ?? undefined,
          },
          create: {
            susaEducationId: id,
            name,
            description: desc ?? null,
            isGymnasium: isGym,
            isVocational: isVoc,
            educationLevels: levels ?? null,
            orientationsJson: orients ?? null,
            subjectsJson: subjects ?? null,
            qualification: info?.qualificationLevel?.code ?? null,
            resultDegree: info?.degree?.code ?? null,
            credits: info?.credits?.value ?? null,
            keywordsJson: keywords ?? null,
            lastEdited: toDate(info?.lastEdited),
            expiresAt: toDate(info?.expires),
            extraJson: info?.extension ?? null,
          },
        });

        total++;
      } catch (e) {
        itemErrors++;
        if (itemErrors <= 10) console.warn('info item error:', e?.message ?? e);
      }
    }
  }, 400);

  console.log(`Imported/updated ${total} programs from Infos`);
}

// ---------- Events → Links + Event rows ----------
function extractProviderIdsFromEvent(ev) {
  // provider can be a list of strings, or via _links
  const ids = new Set();

  // direct field (array of strings)
  if (Array.isArray(ev?.provider)) ev.provider.forEach(p => { if (typeof p === 'string' && p) ids.add(p); });
  else if (typeof ev?.provider === 'string' && ev.provider) ids.add(ev.provider);

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

function extractEventDates(exe) {
  // execution: { condition, start, end }
  const start = exe?.start ?? null;
  const end   = exe?.end ?? null;
  return { start: start ? start.substring(0,10) : null, end: end ? end.substring(0,10) : null };
}

async function importProgramsAndLinksAndEvents() {
  let linked = 0, eventsSeen = 0, eventRows = 0, itemErrors = 0;

  await fetchPagedStream(BASE_URL, 'educationEvents', PAGE_SIZE, async (events, page) => {
    for (const ev of events) {
      try {
        eventsSeen++;

        // 1) Resolve the referenced education info (program)
        const infoId = ev?.education ?? null;
        if (!infoId) continue;

        // ensure the Program exists (fallback from event if Info pass missed it)
        const fallbackName = safeTitle(svText(ev?.title), PROGRAM_NAME_MAX) ?? '(utan namn)';
        const fallbackDesc = cleanCdata(svText(ev?.description));

        await prisma.program.upsert({
          where: { susaEducationId: infoId },
          update: {
            name: fallbackName ?? undefined,
            description: fallbackDesc ?? undefined,
          },
          create: {
            susaEducationId: infoId,
            name: fallbackName,
            description: fallbackDesc ?? null,
          },
        });

        const program = await prisma.program.findUnique({
          where: { susaEducationId: infoId },
          select: { id: true, isGymnasium: true },
        });
        if (!program) continue;

        // 2) Resolve/ensure providers (schools) referenced by the event
        const providerIds = extractProviderIdsFromEvent(ev);
        if (!providerIds.length) continue;

        // 3) Common event fields (same for all providers in this event)
        const title   = safeTitle(svText(ev?.title), 200);
        const url     = pickUrlSv(ev?.url);
        const langs   = Array.isArray(ev?.languageOfInstruction) ? ev.languageOfInstruction : null;

        const exe = ev?.execution ?? null;
        const { start, end } = extractEventDates(exe); // "YYYY-MM-DD" or null
        const timeOfStudy   = ev?.timeOfStudy?.code ?? null;
        const paceOfStudy   = ev?.paceOfStudy?.code ?? null;
        const isApprentice  = ev?.isApprenticeship ?? null;

        const feeJson       = ev?.fee ?? null;
        const placesJson    = ev?.places ?? null;
        const distanceJson  = ev?.distance ?? null;
        const appJson       = ev?.application ?? null;
        const appHist       = ev?.applicationHistory ?? null;
        const locationJson  = ev?.location ?? null;

        const lastEdited    = toDate(ev?.lastEdited);
        const expiresAt     = toDate(ev?.expires);

        // 4) For each provider: ensure school, link school↔program, and upsert the event
        for (const pid of providerIds) {
          const school = await ensureSchoolForProvider(pid);
          if (!school) continue;

          // Link M:N (dedupe-safe)
          await prisma.schoolProgram.upsert({
            where: { schoolId_programId: { schoolId: school.id, programId: program.id } },
            update: {},
            create: { schoolId: school.id, programId: program.id },
          });
          linked++;

const startDateVal = start ? new Date(start) : null;
const endDateVal   = end   ? new Date(end)   : null;

// Prefer the API identifier, else synth
const evId = (ev?.identifier && String(ev.identifier).trim())
  ? String(ev.identifier).trim()
  : `ev:${infoId}:${pid}:${start || ''}`;

// 1) Try by susaEventId first
let existing = evId
  ? await prisma.event.findUnique({
      where: { susaEventId: evId },
      select: { id: true, susaEventId: true }
    })
  : null;

if (!existing) {
  // 2) Fallback: try existing row by composite (program, provider, start)
  // Note: equals: null works for nullable columns in Prisma where filters
  existing = await prisma.event.findFirst({
    where: {
      programId: program.id,
      providerSchoolId: school.id,
      ...(startDateVal ? { startDate: startDateVal } : { startDate: null }),
    },
    select: { id: true, susaEventId: true }
  });
}

const eventData = {
  programId: program.id,
  providerSchoolId: school.id,

  title: title ?? null,
  url: url ?? null,
  languageJson: langs ?? null,

  startDate: startDateVal,
  endDate: endDateVal,
  timeOfStudy: timeOfStudy ?? null,
  paceOfStudy: paceOfStudy ?? null,
  isApprenticeship: isApprentice ?? null,

  feeJson:      feeJson ?? null,
  placesJson:   placesJson ?? null,
  distanceJson: distanceJson ?? null,
  applicationJson: appJson ?? null,
  applicationHist: appHist ?? null,
  locationJson:  locationJson ?? null,

  lastEdited: lastEdited,
  expiresAt:  expiresAt,
  extraJson:  ev?.extension ?? null,
};

if (existing) {
  // If that row has no susaEventId yet, attach this one (avoid changing if it’s already different)
  const safeData =
    !existing.susaEventId && evId ? { ...eventData, susaEventId: evId } : eventData;

  await prisma.event.update({
    where: { id: existing.id },
    data: safeData,
  });
} else {
  await prisma.event.create({
    data: {
      susaEventId: evId, // may be synthetic if API id missing
      ...eventData,
    },
  });
}
eventRows++;
        }

      } catch (e) {
        itemErrors++;
        if (itemErrors <= 10) console.warn('event item error:', e?.message ?? e);
      }
    }
  }, 400);

  console.log(`Linked ${linked} school↔program pairs from ${eventsSeen} events; upserted ${eventRows} event rows`);
}
// STEP 4: Tag schools with gymnasium programs (authoritative, link-based)
async function tagGymnasiumSchoolsSQL() {
  // tag by links to gymnasium programs
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

  // Exclude authorities/kommun/universities by name (belt & suspenders)
  await prisma.$executeRawUnsafe(`
    UPDATE school
    SET is_gymnasium = 0
    WHERE name REGEXP '(\\\\bkommun\\\\b|\\\\bstad\\\\b|komvux|vuxenutbildning|folkhögskola|universitet|högskola|arbetsförmedlingen)'
  `);
}

async function resetAllSchoolGymnasiumFlags() {
 
 await prisma.$executeRawUnsafe(`UPDATE school SET is_gymnasium = 0`);

}

async function autoTagGymnasium() {
  // 1) Reset (deterministic)
  await prisma.$executeRawUnsafe(`UPDATE school SET is_gymnasium = 0`);

  // 2) Tag schools that look like real gymnasiums based on their linked program names
  //    - has ≥ 3 linked programs
  //    - at least 1 program name matches common gymnasium tracks
  //    - school name does NOT look like kommun/AF/komvux/folkhögskola
  await prisma.$executeRawUnsafe(`
    UPDATE school s
    JOIN (
      SELECT sp.school_id,
             COUNT(*) AS total_links,
             SUM(
               p.name REGEXP
               '(teknik|natur|samh(ä|a)ll|ekonomi|estet|bygg|fordon|el( |-|/)|industri|vård|omtanke|barn|fritid|handel|administration|hotell|restaurang|turism|humanist|medie|musik|dans|teater|design|sjöfart|flyg|fastighet)'
             ) AS gym_hits
      FROM school_program sp
      JOIN program p ON p.id = sp.program_id
      GROUP BY sp.school_id
    ) stats ON stats.school_id = s.id
    SET s.is_gymnasium =
      (stats.total_links >= 3
       AND stats.gym_hits >= 1
       AND s.name NOT REGEXP '(kommun|stad|arbetsförmedlingen|komvux|vuxenutbildning|folkh(ö|o)gskola)'
      )
  `);
}


// ---------- Master sync ----------
export async function syncFromSusa() {
  console.log('STEP 1: Providers → schools');
  await importProviders();

  console.log('STEP 2: Infos → programs (+ gymnasium flag)');
  await importInfos();

  console.log('STEP 3: Events → links + event rows');
  await importProgramsAndLinksAndEvents();

  console.log('STEP 4: Reset school gymnasium flags to 0');
  await resetAllSchoolGymnasiumFlags();

  console.log('STEP 4: Auto-tag gymnasiums with 3 programs or more');
  await autoTagGymnasium();
  console.log('✅ SUSA sync done');

}