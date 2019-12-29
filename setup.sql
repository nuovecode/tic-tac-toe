CREATE DATABASE IF NOT EXISTS tictocDb;
USE tictocDb;
CREATE TABLE IF NOT EXISTS Game (
      slug varchar(255),
      players int,
      grid int,
      turn int,
      createdAt TIMESTAMP
   );
CREATE TABLE IF NOT EXISTS Grid (
      slug varchar(255),
      box int,
      player int
   );
