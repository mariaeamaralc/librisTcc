
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') NOT NULL
);

CREATE TABLE usuarios (
  id INT PRIMARY KEY,
  matricula VARCHAR(20) NOT NULL UNIQUE,
  nome VARCHAR(255) NOT NULL,
  FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE administradores (
  id INT PRIMARY KEY,
  cpf VARCHAR(11) NOT NULL UNIQUE,
  codigo_servidor VARCHAR(20) NOT NULL,
  nome VARCHAR(255) NOT NULL,
  FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE material (
    n_registro INT(12) PRIMARY KEY,
    idioma VARCHAR(30),
    ISBN BIGINT, 
    autor VARCHAR(100),
    data_aquisicao DATE,
    prateleira VARCHAR(10),
    titulo VARCHAR(150),
    n_paginas INT,
    tipo VARCHAR(30),
    editora VARCHAR(30),
    ano_publi INT(4)
);

CREATE TABLE categoria (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL
);

INSERT INTO categoria (nome) VALUES
  ('Romance'),
  ('Literatura Brasileira'),
  ('Literatura Inglesa'),
  ('Material Didático');