SET NAMES utf8mb4 COLLATE utf8mb4_swedish_ci;

INSERT INTO program (name, category, description) VALUES
('Teknikprogrammet', 'Teknik', 'Fokus på teknik, programmering och design.'),
('Naturvetenskapsprogrammet', 'Naturvetenskap', 'Studera biologi, fysik, kemi och matematik.'),
('Ekonomiprogrammet', 'Ekonomi', 'Lär dig om företagande, marknadsföring och finans.'),
('Estetiska programmet', 'Estetik', 'Kreativ utbildning med musik, teater och bild.'),
('Vård- och omsorgsprogrammet', 'Vård', 'Utbildning inom hälsa, omsorg och vårdyrken.');

INSERT INTO school (name, city, website) VALUES
('Södra Gymnasiet', 'Stockholm', 'https://sodragymnasiet.se'),
('Norrby Tekniska', 'Uppsala', 'https://norrbytekniska.se'),
('Göta Akademi', 'Göteborg', 'https://gotaakademi.se'),
('Östra Real', 'Stockholm', 'https://ostrereal.se'),
('Skåne Framtidsgymnasium', 'Malmö', 'https://framtidsgymnasium.se'),
('Karlstad Kunskapsgymnasiet', 'Karlstad', 'https://kunskapkarlstad.se'),
('Västerås Gymnasium', 'Västerås', 'https://vgym.se'),
('Helsingborg Kreativa Skola', 'Helsingborg', 'https://helsingkreativ.se');

INSERT INTO school_program (school_id, program_id) VALUES
(1, 1), (1, 2), (1, 3),        -- Södra Gymnasiet offers Teknik, Natur, Ekonomi
(2, 1), (2, 3),                -- Norrby Tekniska: Teknik, Ekonomi
(3, 2), (3, 4),                -- Göta Akademi: Natur, Estetik
(4, 2), (4, 3), (4, 5),        -- Östra Real: Natur, Ekonomi, Vård
(5, 1), (5, 5),                -- Skåne Framtidsgymnasium: Teknik, Vård
(6, 2), (6, 4),                -- Karlstad Kunskapsgymnasiet: Natur, Estetik
(7, 1), (7, 3), (7, 4),        -- Västerås Gymnasium: Teknik, Ekonomi, Estetik
(8, 4), (8, 5);                -- Helsingborg Kreativa: Estetik, Vård


INSERT INTO open_house_event (school_id, starts_at, info_url, notes) VALUES
(1, '2025-11-10 17:00:00', 'https://sodragymnasiet.se/oppet-hus', 'Träffa lärare och elever'),
(2, '2025-11-12 18:00:00', 'https://norrbytekniska.se/info', 'Teknikdemo och rundvandring'),
(3, '2025-11-15 16:00:00', 'https://gotaakademi.se/oppet-hus', 'Musikframträdande och fika'),
(4, '2025-11-17 17:30:00', 'https://ostrereal.se/oppet-hus', 'Information om natur- och ekonomiprogrammen'),
(5, '2025-11-19 18:00:00', 'https://framtidsgymnasium.se/info', 'Prova-på lektioner'),
(6, '2025-11-20 17:00:00', 'https://kunskapkarlstad.se/oppet-hus', 'Öppet hus för hela familjen'),
(7, '2025-11-21 17:00:00', 'https://vgym.se/oppet-hus', 'Möt våra mentorer'),
(8, '2025-11-22 18:00:00', 'https://helsingkreativ.se/info', 'Kreativa workshops och musik');


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
