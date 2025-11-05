-- Drop tables if re-running locally
DROP TABLE IF EXISTS submission_answer;
DROP TABLE IF EXISTS quiz_submission;
DROP TABLE IF EXISTS quiz_option;
DROP TABLE IF EXISTS quiz_question;
DROP TABLE IF EXISTS open_house_event;
DROP TABLE IF EXISTS school_program;
DROP TABLE IF EXISTS user_favorite_school;
DROP TABLE IF EXISTS school;
DROP TABLE IF EXISTS program;
DROP TABLE IF EXISTS user;

SET NAMES utf8mb4 COLLATE utf8mb4_swedish_ci;

CREATE TABLE user (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('STUDENT','ADMIN') DEFAULT 'STUDENT',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_swedish_ci;


CREATE TABLE program (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)CHARACTER SET utf8mb4 COLLATE utf8mb4_swedish_ci;

CREATE TABLE school (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  city VARCHAR(60),
  website VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)CHARACTER SET utf8mb4 COLLATE utf8mb4_swedish_ci;  

CREATE TABLE user_favorite_school (
  user_id   INT NOT NULL,
  school_id INT NOT NULL,
  PRIMARY KEY (user_id, school_id),
  FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
  FOREIGN KEY (school_id) REFERENCES school(id) ON DELETE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_swedish_ci;

CREATE TABLE school_program (
  school_id INT NOT NULL,
  program_id INT NOT NULL,
  PRIMARY KEY (school_id, program_id),
  FOREIGN KEY (school_id) REFERENCES school(id) ON DELETE CASCADE,
  FOREIGN KEY (program_id) REFERENCES program(id) ON DELETE CASCADE
)CHARACTER SET utf8mb4 COLLATE utf8mb4_swedish_ci;

CREATE TABLE open_house_event (
  id INT AUTO_INCREMENT PRIMARY KEY,
  school_id INT NOT NULL,
  starts_at DATETIME NOT NULL,
  info_url VARCHAR(255),
  notes VARCHAR(255),
  FOREIGN KEY (school_id) REFERENCES school(id) ON DELETE CASCADE
)CHARACTER SET utf8mb4 COLLATE utf8mb4_swedish_ci;

CREATE TABLE quiz_question (
  id INT AUTO_INCREMENT PRIMARY KEY,
  prompt VARCHAR(255) NOT NULL,
  order_index INT NOT NULL
)CHARACTER SET utf8mb4 COLLATE utf8mb4_swedish_ci;

CREATE TABLE quiz_option (
  id INT AUTO_INCREMENT PRIMARY KEY,
  question_id INT NOT NULL,
  label VARCHAR(255) NOT NULL,
  program_hint VARCHAR(50),
  weight INT DEFAULT 1,
  FOREIGN KEY (question_id) REFERENCES quiz_question(id) ON DELETE CASCADE
)CHARACTER SET utf8mb4 COLLATE utf8mb4_swedish_ci;

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
