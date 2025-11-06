SET NAMES utf8mb4 COLLATE utf8mb4_swedish_ci;

-- =========================
-- Seed: Programs (EducationInfo)
-- =========================
INSERT INTO program
  (susa_education_id, name, description, is_vocational, is_gymnasium, education_levels, orientations_json, subjects_json, keywords_json)
VALUES
  ('demo:prog:teknik',        'Teknikprogrammet',        'Fokus på teknik, programmering och design.',            0, 1, JSON_ARRAY('ISCED 3'), NULL, JSON_ARRAY('Teknik','IT','Design'), JSON_ARRAY('teknik','programmering')),
  ('demo:prog:natur',         'Naturvetenskapsprogrammet','Biologi, fysik, kemi och matematik på fördjupad nivå.',0, 1, JSON_ARRAY('ISCED 3'), NULL, JSON_ARRAY('Biologi','Fysik','Kemi','Matematik'), JSON_ARRAY('natur','lab')),
  ('demo:prog:ekonomi',       'Ekonomiprogrammet',       'Företagande, marknadsföring och finans.',               0, 1, JSON_ARRAY('ISCED 3'), NULL, JSON_ARRAY('Ekonomi','Företag'), JSON_ARRAY('ekonomi','entreprenörskap')),
  ('demo:prog:estet',         'Estetiska programmet',    'Kreativ inriktning med musik, teater och bild.',        0, 1, JSON_ARRAY('ISCED 3'), JSON_ARRAY('Musik','Teater','Bild'), JSON_ARRAY('Estetik','Kultur'), JSON_ARRAY('estet','kreativitet')),
  ('demo:prog:vard',          'Vård- och omsorgsprogrammet','Utbildning inom hälsa, omsorg och vårdyrken.',      1, 1, JSON_ARRAY('ISCED 3'), NULL, JSON_ARRAY('Vård','Omsorg','Hälsa'), JSON_ARRAY('vård','omsorg'));

-- =========================
-- Seed: Schools (EducationProvider)
-- =========================
INSERT INTO school
  (susa_provider_id, name, website, email, city, municipality_code, is_gymnasium, is_showcase, showcase_rank)
VALUES
  ('demo:prov:sodra',     'Södra Gymnasiet',                 'https://sodragymnasiet.se',          'info@sodragymnasiet.se',        'Stockholm', '0180', 1, 1, 10),
  ('demo:prov:norrby',    'Norrby Tekniska',                 'https://norrbytekniska.se',          'info@norrbytekniska.se',        'Uppsala',   '0380', 1, 1, 20),
  ('demo:prov:gota',      'Göta Akademi',                    'https://gotaakademi.se',             'hej@gotaakademi.se',            'Göteborg',  '1480', 1, 1, 30),
  ('demo:prov:ostra',     'Östra Real',                      'https://ostrereal.se',               'info@ostrereal.se',             'Stockholm', '0180', 1, 1, 40),
  ('demo:prov:skane',     'Skåne Framtidsgymnasium',         'https://framtidsgymnasium.se',       'kontakt@framtidsgymnasium.se',  'Malmö',     '1280', 1, 1, 50),
  ('demo:prov:kunskap',   'Karlstad Kunskapsgymnasiet',      'https://kunskapkarlstad.se',         'info@kunskapkarlstad.se',       'Karlstad',  '1780', 1, 1, 60),
  ('demo:prov:vgym',      'Västerås Gymnasium',              'https://vgym.se',                    'info@vgym.se',                  'Västerås',  '1980', 1, 1, 70),
  ('demo:prov:kreativ',   'Helsingborg Kreativa Skola',      'https://helsingkreativ.se',          'hej@helsingkreativ.se',         'Helsingborg','1283',1, 1, 80);

-- Optional tags for curated labels
INSERT INTO school_tag (school_id, tag)
SELECT id, 'Showcase'
FROM school
WHERE is_showcase = 1;

-- =========================
-- Seed: School ↔ Program links
-- =========================
-- Map names to IDs for convenience
SET @p_teknik := (SELECT id FROM program WHERE susa_education_id = 'demo:prog:teknik' LIMIT 1);
SET @p_natur  := (SELECT id FROM program WHERE susa_education_id = 'demo:prog:natur'  LIMIT 1);
SET @p_eko    := (SELECT id FROM program WHERE susa_education_id = 'demo:prog:ekonomi'LIMIT 1);
SET @p_estet  := (SELECT id FROM program WHERE susa_education_id = 'demo:prog:estet'  LIMIT 1);
SET @p_vard   := (SELECT id FROM program WHERE susa_education_id = 'demo:prog:vard'   LIMIT 1);

SET @s_sodra   := (SELECT id FROM school WHERE name = 'Södra Gymnasiet'                LIMIT 1);
SET @s_norrby  := (SELECT id FROM school WHERE name = 'Norrby Tekniska'                LIMIT 1);
SET @s_gota    := (SELECT id FROM school WHERE name = 'Göta Akademi'                   LIMIT 1);
SET @s_ostral  := (SELECT id FROM school WHERE name = 'Östra Real'                     LIMIT 1);
SET @s_skane   := (SELECT id FROM school WHERE name = 'Skåne Framtidsgymnasium'        LIMIT 1);
SET @s_kunskap := (SELECT id FROM school WHERE name = 'Karlstad Kunskapsgymnasiet'     LIMIT 1);
SET @s_vgym    := (SELECT id FROM school WHERE name = 'Västerås Gymnasium'             LIMIT 1);
SET @s_kreativ := (SELECT id FROM school WHERE name = 'Helsingborg Kreativa Skola'     LIMIT 1);

-- Södra Gymnasiet: Teknik, Natur, Ekonomi
INSERT INTO school_program (school_id, program_id) VALUES
(@s_sodra, @p_teknik), (@s_sodra, @p_natur), (@s_sodra, @p_eko);

-- Norrby Tekniska: Teknik, Ekonomi
INSERT INTO school_program (school_id, program_id) VALUES
(@s_norrby, @p_teknik), (@s_norrby, @p_eko);

-- Göta Akademi: Natur, Estetik
INSERT INTO school_program (school_id, program_id) VALUES
(@s_gota, @p_natur), (@s_gota, @p_estet);

-- Östra Real: Natur, Ekonomi, Vård
INSERT INTO school_program (school_id, program_id) VALUES
(@s_ostral, @p_natur), (@s_ostral, @p_eko), (@s_ostral, @p_vard);

-- Skåne Framtidsgymnasium: Teknik, Vård
INSERT INTO school_program (school_id, program_id) VALUES
(@s_skane, @p_teknik), (@s_skane, @p_vard);

-- Karlstad Kunskapsgymnasiet: Natur, Estetik
INSERT INTO school_program (school_id, program_id) VALUES
(@s_kunskap, @p_natur), (@s_kunskap, @p_estet);

-- Västerås Gymnasium: Teknik, Ekonomi, Estetik
INSERT INTO school_program (school_id, program_id) VALUES
(@s_vgym, @p_teknik), (@s_vgym, @p_eko), (@s_vgym, @p_estet);

-- Helsingborg Kreativa Skola: Estetik, Vård
INSERT INTO school_program (school_id, program_id) VALUES
(@s_kreativ, @p_estet), (@s_kreativ, @p_vard);

-- =========================
-- Seed: Events (EducationEvent)
-- =========================
-- A couple of upcoming offerings with dates/URLs
INSERT INTO event
  (susa_event_id, program_id, provider_school_id, title, url, language_json, start_date, end_date, time_of_study, pace_of_study, is_apprenticeship)
VALUES
  ('demo:event:1', @p_teknik, @s_sodra,  'HT 2026 – Teknik', 'https://sodragymnasiet.se/teknik', JSON_ARRAY('sv'), '2026-08-20','2029-06-10','Dag','Heltid', 0),
  ('demo:event:2', @p_natur,  @s_ostral, 'HT 2026 – Natur',  'https://ostrereal.se/natur',       JSON_ARRAY('sv'), '2026-08-20','2029-06-10','Dag','Heltid', 0),
  ('demo:event:3', @p_estet,  @s_kreativ,'HT 2026 – Estet',  'https://helsingkreativ.se/estet', JSON_ARRAY('sv'), '2026-08-20','2029-06-10','Dag','Heltid', 0);

-- =========================
-- Seed: Quiz system (same spirit as your old seed)
-- =========================
INSERT INTO quiz_question (prompt, order_index) VALUES
('Vilket ämne tycker du mest om?', 1),
('Hur gillar du att arbeta?', 2),
('Vad inspirerar dig mest?', 3),
('Vilken miljö trivs du bäst i?', 4),
('Vad ser du som viktigast i ditt framtida jobb?', 5);

INSERT INTO quiz_option (question_id, label, program_hint, weight) VALUES
-- Q1
(1, 'Matematik eller fysik', 'Teknik', 2),
(1, 'Biologi eller kemi', 'Naturvetenskap', 2),
(1, 'Ekonomi och företagande', 'Ekonomi', 2),
(1, 'Musik eller konst', 'Estetik', 2),
(1, 'Hjälpa människor', 'Vård', 2),
-- Q2
(2, 'Lösa problem och bygga saker', 'Teknik', 1),
(2, 'Forska och analysera', 'Naturvetenskap', 1),
(2, 'Planera och leda projekt', 'Ekonomi', 1),
(2, 'Skapa och uttrycka mig', 'Estetik', 1),
(2, 'Ta hand om andra', 'Vård', 1),
-- Q3
(3, 'Ny teknik och innovation', 'Teknik', 1),
(3, 'Naturen och miljön', 'Naturvetenskap', 1),
(3, 'Företag och marknad', 'Ekonomi', 1),
(3, 'Kreativitet och känslor', 'Estetik', 1),
(3, 'Att göra skillnad för människor', 'Vård', 1),
-- Q4
(4, 'Laboratorium eller verkstad', 'Teknik', 1),
(4, 'Bibliotek eller laboratorium', 'Naturvetenskap', 1),
(4, 'Kontor eller mötesrum', 'Ekonomi', 1),
(4, 'Ateljé eller scen', 'Estetik', 1),
(4, 'Sjukhus eller vårdhem', 'Vård', 1),
-- Q5
(5, 'Utveckla ny teknik', 'Teknik', 2),
(5, 'Utforska världen vetenskapligt', 'Naturvetenskap', 2),
(5, 'Starta eget företag', 'Ekonomi', 2),
(5, 'Uttrycka mig genom konst', 'Estetik', 2),
(5, 'Hjälpa andra att må bättre', 'Vård', 2);