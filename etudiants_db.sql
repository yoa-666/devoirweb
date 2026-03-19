CREATE DATABASE IF NOT EXISTS etudiants_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE etudiants_db;

CREATE TABLE IF NOT EXISTS etudiants (
  id         INT          AUTO_INCREMENT PRIMARY KEY,
  nom        VARCHAR(100) NOT NULL,
  prenom     VARCHAR(100) NOT NULL,
  email      VARCHAR(100) NOT NULL UNIQUE,
  telephone  VARCHAR(20)  NOT NULL,
  filiere    VARCHAR(50)  NOT NULL,
  created_at DATETIME     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO etudiants (nom, prenom, email, telephone, filiere) VALUES
  ('TOSSA',  'Yoann', 'yoann@exemple.com', '+22997001122', 'Génie Informatique'),
  ('DUPONT', 'Marie', 'marie@exemple.com', '+22996112233', 'Anglais'),
  ('MARTIN', 'Paul',  'paul@exemple.com',  '+22995223344', 'Génie Civil');
