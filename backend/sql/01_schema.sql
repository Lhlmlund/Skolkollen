-- =========================================================
-- Skolkollen Full Base Schema (MySQL 8)
-- =========================================================
-- Swedish collation + full rebuild ready
-- =========================================================

-- Drop tables if re-running locally
DROP TABLE IF EXISTS submission_answer;
DROP TABLE IF EXISTS quiz_submission;
DROP TABLE IF EXISTS quiz_option;
DROP TABLE IF EXISTS quiz_question;

DROP TABLE IF EXISTS user_favorite_school;
DROP TABLE IF EXISTS school_tag;
DROP TABLE IF EXISTS provider_fanout;

DROP TABLE IF EXISTS event;
DROP TABLE IF EXISTS school_program;
DROP TABLE IF EXISTS program;

DROP TABLE IF EXISTS school;
DROP TABLE IF EXISTS user;

SET NAMES utf8mb4 COLLATE utf8mb4_swedish_ci;

-- =========================================================
-- Table: user
-- =========================================================
CREATE TABLE user (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('STUDENT','ADMIN') DEFAULT 'STUDENT',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_swedish_ci;

-- =========================================================
-- Table: program (EducationInfo)
-- =========================================================
CREATE TABLE program (
  id                  INT AUTO_INCREMENT PRIMARY KEY,
  susa_education_id   VARCHAR(250) UNIQUE NOT NULL,
  name                VARCHAR(200) NOT NULL,
  description         MEDIUMTEXT,

  is_vocational       TINYINT(1) DEFAULT NULL,
  is_gymnasium        TINYINT(1) NOT NULL DEFAULT 0,
  education_levels    JSON,
  orientations_json   JSON,
  subjects_json       JSON,
  qualification       VARCHAR(120),
  result_degree       VARCHAR(120),
  credits             VARCHAR(60),
  keywords_json       JSON,

  last_edited         DATETIME,
  expires_at          DATETIME,
  extra_json          JSON,

  created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_swedish_ci;

CREATE INDEX idx_program_gym ON program(is_gymnasium);
CREATE FULLTEXT INDEX ft_program_name_desc ON program(name, description);

-- =========================================================
-- Table: school (EducationProvider)
-- =========================================================
CREATE TABLE school (
  id                 INT AUTO_INCREMENT PRIMARY KEY,
  susa_provider_id   VARCHAR(250) UNIQUE,
  name               VARCHAR(120) NOT NULL,
  website            VARCHAR(512),
  email              VARCHAR(255),
  phone_json         JSON,
  country            VARCHAR(60),
  municipality_code  CHAR(4),
  city               VARCHAR(80),
  street_address     VARCHAR(255),
  post_code          CHAR(6),
  lat                DECIMAL(10,7),
  lon                DECIMAL(10,7),

  location           POINT GENERATED ALWAYS AS (
    IF(lat IS NULL OR lon IS NULL, NULL, ST_SRID(POINT(lon, lat), 4326))
  ) STORED,

  responsible_body   VARCHAR(255),
  accreditation      VARCHAR(120),
  founded_year       INT,

  is_gymnasium       TINYINT(1) NOT NULL DEFAULT 0,
  is_showcase        TINYINT(1) NOT NULL DEFAULT 0,
  showcase_rank      INT UNIQUE,

  last_edited        DATETIME,
  expires_at         DATETIME,
  extra_json         JSON,

  created_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_swedish_ci;

CREATE INDEX idx_school_city ON school(city);
CREATE INDEX idx_school_muni ON school(municipality_code);
CREATE UNIQUE INDEX ux_school_name_city ON school(name, city);
CREATE FULLTEXT INDEX ft_school_name ON school(name);
CREATE INDEX idx_school_lat_lon ON school(lat, lon);

-- =========================================================
-- Table: user_favorite_school
-- =========================================================
CREATE TABLE user_favorite_school (
  user_id   INT NOT NULL,
  school_id INT NOT NULL,
  PRIMARY KEY (user_id, school_id),
  FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
  CONSTRAINT fk_fav_school FOREIGN KEY (school_id) REFERENCES school(id) ON DELETE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_swedish_ci;
CREATE INDEX idx_fav_user ON user_favorite_school (user_id);

-- =========================================================
-- Table: school_program (link)
-- =========================================================
CREATE TABLE school_program (
  school_id   INT NOT NULL,
  program_id  INT NOT NULL,
  PRIMARY KEY (school_id, program_id),
  CONSTRAINT fk_sp_school  FOREIGN KEY (school_id)  REFERENCES school(id)  ON DELETE CASCADE,
  CONSTRAINT fk_sp_program FOREIGN KEY (program_id) REFERENCES program(id) ON DELETE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_swedish_ci;

CREATE INDEX idx_sp_school  ON school_program(school_id);
CREATE INDEX idx_sp_program ON school_program(program_id);

-- =========================================================
-- Table: event (EducationEvent)
-- =========================================================
CREATE TABLE event (
  id                  INT AUTO_INCREMENT PRIMARY KEY,
  susa_event_id       VARCHAR(250) UNIQUE NOT NULL,
  program_id          INT NOT NULL,
  provider_school_id  INT NOT NULL,

  title               VARCHAR(200),
  url                 VARCHAR(512),
  language_json       JSON,
  start_date          DATE,
  end_date            DATE,
  time_of_study       VARCHAR(100),
  pace_of_study       VARCHAR(100),
  is_apprenticeship   TINYINT(1) DEFAULT NULL,
  fee_json            JSON,
  places_json         JSON,
  distance_json       JSON,
  application_json    JSON,
  application_hist    JSON,
  location_json       JSON,

  last_edited         DATETIME,
  expires_at          DATETIME,
  extra_json          JSON,

  created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_event_program  FOREIGN KEY (program_id)         REFERENCES program(id) ON DELETE CASCADE,
  CONSTRAINT fk_event_provider FOREIGN KEY (provider_school_id) REFERENCES school(id)  ON DELETE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_swedish_ci;

CREATE INDEX idx_event_program  ON event(program_id);
CREATE INDEX idx_event_provider ON event(provider_school_id);
CREATE UNIQUE INDEX ux_event_program_provider_start ON event(program_id, provider_school_id, start_date);

-- =========================================================
-- Table: provider_fanout (kommun → school mapping)
-- =========================================================
CREATE TABLE provider_fanout (
  id                   INT AUTO_INCREMENT PRIMARY KEY,
  kommun_provider_id   VARCHAR(250) NOT NULL,
  school_provider_id   VARCHAR(250) NOT NULL,
  UNIQUE KEY ux_pf_pair (kommun_provider_id, school_provider_id),

  CONSTRAINT fk_pf_kommun FOREIGN KEY (kommun_provider_id) REFERENCES school(susa_provider_id) ON DELETE CASCADE,
  CONSTRAINT fk_pf_school  FOREIGN KEY (school_provider_id)  REFERENCES school(susa_provider_id) ON DELETE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_swedish_ci;

-- =========================================================
-- Table: school_tag (curation labels)
-- =========================================================
CREATE TABLE school_tag (
  school_id INT NOT NULL,
  tag       VARCHAR(60) NOT NULL,
  PRIMARY KEY (school_id, tag),
  CONSTRAINT fk_tag_school FOREIGN KEY (school_id) REFERENCES school(id) ON DELETE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_swedish_ci;

-- =========================================================
-- Quiz system
-- =========================================================
CREATE TABLE quiz_question (
  id INT AUTO_INCREMENT PRIMARY KEY,
  prompt VARCHAR(255) NOT NULL,
  order_index INT NOT NULL
) CHARACTER SET utf8mb4 COLLATE utf8mb4_swedish_ci;

CREATE TABLE quiz_option (
  id INT AUTO_INCREMENT PRIMARY KEY,
  question_id INT NOT NULL,
  label VARCHAR(255) NOT NULL,
  program_hint VARCHAR(50),
  weight INT DEFAULT 1,
  FOREIGN KEY (question_id) REFERENCES quiz_question(id) ON DELETE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_swedish_ci;

CREATE TABLE quiz_submission (
  id CHAR(36) PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  suggested_program_id INT NULL,
  user_id INT NULL,
  FOREIGN KEY (suggested_program_id) REFERENCES program(id),
  FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE SET NULL
) CHARACTER SET utf8mb4 COLLATE utf8mb4_swedish_ci;

CREATE TABLE submission_answer (
  submission_id CHAR(36) NOT NULL,
  question_id INT NOT NULL,
  option_id INT NOT NULL,
  PRIMARY KEY (submission_id, question_id),
  FOREIGN KEY (submission_id) REFERENCES quiz_submission(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES quiz_question(id) ON DELETE CASCADE,
  FOREIGN KEY (option_id) REFERENCES quiz_option(id) ON DELETE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_swedish_ci;
