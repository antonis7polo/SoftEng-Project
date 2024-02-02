-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
-- begin attached script 'script'
/*
This script creates the IMDb database tables.

To use the IMDb scripts:

1) Open MySQL in terminal:
$ mysql -u root -p --local-infile

2) Create IMDb data base in MySQL:
mysql> SOURCE path_to_ntuaflix_db.sql_file

3) Add constraints to the IMDb database in MySQL
mysql> SOURCE path_to_ntuaflix_db_constraints.sql

4) Add indexes to the IMDb database in MySQL
mysql> SOURCE path_to_ntuaflix_db_index.sql

5) Add data to the IMDb database in MySQL
mysql> SOURCE path_to_ntuaflix_db_data.sql

*/

-- Delete IMDb database if necessary
DROP DATABASE IF EXISTS IMDb;

-- Create IMDb database

CREATE DATABASE IMDb;

-- Use IMDb database

USE IMDb;

-- Character set
-- want to be able to distinguish text with accents
ALTER DATABASE IMDb CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;

-- Drop old tables if they exist

-- DROP TABLE IF EXISTS Titles;
-- DROP TABLE IF EXISTS Title_ratings;
-- DROP TABLE IF EXISTS Aliases;
-- DROP TABLE IF EXISTS Episode_belongs_to;
-- DROP TABLE IF EXISTS Title_genres;
-- DROP TABLE IF EXISTS Names_;
-- DROP TABLE IF EXISTS Name_worked_as;
-- DROP TABLE IF EXISTS Had_role;
-- DROP TABLE IF EXISTS Known_for;
-- DROP TABLE IF EXISTS Directors;
-- DROP TABLE IF EXISTS Writers;
-- DROP TABLE IF EXISTS Principals;

-- Create tables only

CREATE TABLE Titles (
  title_id 			  VARCHAR(255) NOT NULL, -- not null bc PK
  title_type 			VARCHAR(50),
  primary_title 	VARCHAR(255), -- some are really long
  original_title 	VARCHAR(255), -- some are really long
  is_adult 			  BOOLEAN,
  start_year			INTEGER, -- add better domain here (>1800)
  end_year 			  INTEGER, -- add better domain here (>0)
  runtime_minutes	INTEGER, -- add better domain here (>0)
  image_url_poster  VARCHAR(255) NULL,
  average_rating  DECIMAL(4,2),
  num_votes     INTEGER
);


CREATE TABLE Aliases (
  title_id          VARCHAR(255) NOT NULL, -- not null bc PK
  ordering          INTEGER NOT NULL, -- not null bc PK
  title             TEXT NOT NULL,
  region				    CHAR(4),
  language          CHAR(4),
  is_original_title	BOOLEAN,
  attribute         VARCHAR(255) NULL,
  type              VARCHAR(255) NULL
);



CREATE TABLE Episode_belongs_to (
  episode_title_id          VARCHAR(255) NOT NULL, -- not null bc PK
  parent_tv_show_title_id   VARCHAR(255) NOT NULL,
  season_number             INTEGER,
  episode_number            INTEGER
);

CREATE TABLE Title_genres (
  title_id    VARCHAR(255) NOT NULL, -- not null bc PK
  genre				VARCHAR(255) NOT NULL -- not null bc PK
);

-- Names and name is a reserved word in MySQL, so we add an underscore

CREATE TABLE Names_ (
  name_id       VARCHAR(255) NOT NULL, -- not null bc PK
  name_         VARCHAR(255) NOT NULL, -- everybody has a name
  birth_year    SMALLINT, -- add a better domain here
  death_year    SMALLINT, -- add a better domain here
  image_url     VARCHAR(255) NULL
);

CREATE TABLE Name_worked_as (
  name_id       VARCHAR(255) NOT NULL, -- not null bc PK
  profession    VARCHAR(255) NOT NULL -- not null bc PK
);

-- NOTE: All 3 must must be used as the primary key
-- role is a reserved word in MySQL, so we add an underscore

CREATE TABLE Had_role (
  title_id      VARCHAR(255) NOT NULL, -- not null bc PK
  name_id       VARCHAR(255) NOT NULL, -- not null bc PK
  role_         TEXT NOT NULL -- not null bc PK
);

CREATE TABLE Known_for (
  name_id       VARCHAR(255) NOT NULL, -- not null bc PK
  title_id      VARCHAR(255) NOT NULL -- not null bc PK
);

CREATE TABLE Directors (
  title_id      VARCHAR(255) NOT NULL, -- not null bc PK
  name_id       VARCHAR(255) NOT NULL -- not null bc PK
);

CREATE TABLE Writers (
  title_id      VARCHAR(255) NOT NULL, -- not null bc PK
  name_id       VARCHAR(255) NOT NULL -- not null bc PK
);

CREATE TABLE Principals (
  title_id      VARCHAR(255) NOT NULL, -- not null bc PK
  ordering      TINYINT NOT NULL, -- not null bc PK
  name_id       VARCHAR(255) NOT NULL,
  job_category  VARCHAR(255),
  job           TEXT,
  image_url     VARCHAR(255) NULL
);

-- Existing code for creating database and tables...

-- Add Users table
CREATE TABLE Users (
  user_id       INT AUTO_INCREMENT PRIMARY KEY,
  username      VARCHAR(255) NOT NULL UNIQUE,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password      VARCHAR(255) NOT NULL, -- Store hashed passwords, never plain text
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  isAdmin       BOOLEAN NOT NULL
);


CREATE TABLE User_Title_Ratings (
  user_id         INT NOT NULL,
  title_id        VARCHAR(255) NOT NULL,
  user_rating     FLOAT
  
);


-- end attached script 'script'
