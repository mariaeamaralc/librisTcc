-- MySQL dump 10.13  Distrib 8.4.5, for Win64 (x86_64)
--
-- Host: localhost    Database: libris
-- ------------------------------------------------------
-- Server version	8.4.5

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `administradores`
--

DROP TABLE IF EXISTS `administradores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `administradores` (
  `id` int NOT NULL,
  `cpf` varchar(20) DEFAULT NULL,
  `codigo_servidor` varchar(20) NOT NULL,
  `nome` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cpf` (`cpf`),
  CONSTRAINT `administradores_ibfk_1` FOREIGN KEY (`id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `administradores`
--

LOCK TABLES `administradores` WRITE;
/*!40000 ALTER TABLE `administradores` DISABLE KEYS */;
INSERT INTO `administradores` VALUES (5,'050.824.110-39','8080','maria eduarda do amaral costa'),(8,'1234567856','2020','maria eduarda do amaral costa'),(19,'12345678912','123456','adminLibris');
/*!40000 ALTER TABLE `administradores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categoria`
--

DROP TABLE IF EXISTS `categoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categoria` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categoria`
--

LOCK TABLES `categoria` WRITE;
/*!40000 ALTER TABLE `categoria` DISABLE KEYS */;
INSERT INTO `categoria` VALUES (1,'Romance'),(2,'Literatura Brasileira'),(4,'Material Didático'),(5,'Ficção'),(6,'Não-Ficção'),(7,'Ficção Científica'),(8,'Suspense'),(9,'Poesia'),(10,'Biografia'),(11,'Literatura Infantil'),(12,'Literatura Infantojuvenil'),(13,'Periódico'),(14,'Outro'),(15,'Literatura Estrangeira');
/*!40000 ALTER TABLE `categoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `emprestimos`
--

DROP TABLE IF EXISTS `emprestimos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `emprestimos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `n_registro` int NOT NULL,
  `status` enum('pendente','autorizado','recusado','devolvido') NOT NULL DEFAULT 'pendente',
  `data_devolucao` date DEFAULT NULL,
  `data_renovacao_aprovada` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `emprestimos_ibfk_2` (`n_registro`),
  CONSTRAINT `emprestimos_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `emprestimos_ibfk_2` FOREIGN KEY (`n_registro`) REFERENCES `material` (`n_registro`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `emprestimos`
--

LOCK TABLES `emprestimos` WRITE;
/*!40000 ALTER TABLE `emprestimos` DISABLE KEYS */;
INSERT INTO `emprestimos` VALUES (31,17,95047456,'devolvido','2025-10-18','2025-10-16'),(33,21,95047456,'devolvido','2025-10-18',NULL),(34,21,10000023,'devolvido','2025-11-03',NULL),(35,17,10000023,'recusado',NULL,NULL),(36,17,95047456,'devolvido','2025-10-21','2026-01-25'),(37,21,10000023,'autorizado','2025-11-20','2025-10-21'),(38,22,79878677,'autorizado','2025-11-06',NULL),(39,17,10000023,'recusado',NULL,NULL);
/*!40000 ALTER TABLE `emprestimos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `material`
--

DROP TABLE IF EXISTS `material`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `material` (
  `n_registro` int NOT NULL,
  `idioma` varchar(30) DEFAULT NULL,
  `ISBN` varchar(13) NOT NULL,
  `autor` varchar(100) DEFAULT NULL,
  `data_aquisicao` date DEFAULT NULL,
  `prateleira` varchar(10) DEFAULT NULL,
  `titulo` varchar(150) DEFAULT NULL,
  `n_paginas` int DEFAULT NULL,
  `tipo` varchar(30) DEFAULT NULL,
  `editora` varchar(30) DEFAULT NULL,
  `ano_publi` int DEFAULT NULL,
  `categoria` int DEFAULT NULL,
  `disponivel` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`n_registro`),
  UNIQUE KEY `UQ_ISBN` (`ISBN`),
  UNIQUE KEY `ISBN` (`ISBN`),
  UNIQUE KEY `ISBN_2` (`ISBN`),
  CONSTRAINT `CHK_ISBN_13_DIGITOS` CHECK ((length(`ISBN`) = 13)),
  CONSTRAINT `CHK_ISBN_TAMANHO` CHECK ((length(`ISBN`) = 13)),
  CONSTRAINT `chk_n_registro_8_digitos_exatos` CHECK ((`n_registro` between 10000000 and 99999999))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `material`
--

LOCK TABLES `material` WRITE;
/*!40000 ALTER TABLE `material` DISABLE KEYS */;
INSERT INTO `material` VALUES (10000008,'portugues','9786559212347','Eliana Alves Cruz ','2025-10-21','15','Solitária',168,'livro','Globo',2022,1,1),(10000023,'Inglês','9786558380542','matt haig','2025-10-23','20','A biblioteca da meia-noite',308,'livro','bertrand brasil',2021,15,1),(12345678,'portugues','9788535932621','ana miranda','2025-11-11','11','boca do inferno',345,'livro','Companhia das Letras',2020,2,1),(56784392,'portugues','9788594318703','Clarice Lispector','2025-10-22','20','A hora da estrela',88,'livro','Rocco',2020,9,1),(78789798,'portugues','9788501104687','Alvaro Campos','2025-10-21','10','O outro lado da bola',216,'revista','Intrínseca',2020,5,1),(79878677,'portugues','9788594318831','Aluísio de Azevedo','2025-10-05','20','O Cortiço',224,'livro','Principis',2019,2,1),(89765643,'portugues','9788594318787','Franz Kafka','2025-10-15','20','A metamorfose',96,'livro','LoveCraft',2020,5,1),(95047456,'portugues','9786559210572','João Guimarães Rosa','2025-10-05','23','Grande sertão: veredas',504,'livro','Companhia de Bolso',2021,4,1);
/*!40000 ALTER TABLE `material` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'lanadelreys2','ventiladorradical@gmail.com','$2b$10$apq8kI/NL.sG0q2vrfbUW.59P0TzLYQ4savc45C8BhbiEOn6b9kAa','user'),(2,'oi','meac2307@gmail.com','$2b$10$OU5o0BetcXC1z04z/gYqE.j3ozowHj83XFQcrzOOTljx0S1BX7qey','user'),(3,'alanroxo09','alanroxo@gmail.com','$2b$10$vV6HCJNTIuX1HZSfnGn9We6DbdH4EdmRtIoSdNLokZ4en2p5Cwhxu','user'),(5,'maria','maria@gmail.com','$2b$10$mNHMjwioJWFROAFiaRTEbuURdKC7O5hmWmatIEZLCllZSHZlPkw4e','admin'),(8,'maria78','maria78@gmail.com','$2b$10$nMXIxILcAKpBlOKr49OeGekyP341BAXMLsoXjuyGaT89dkoZZL/MO','admin'),(9,'eeevv','ev@gmail.com','$2b$10$59qeXmlivTxu8nl4kBHlL.9ojiqqS5Zfl/Vj28VZZ6UtSoGWJddKi','user'),(10,'alaaa','alanroxo06@gmail.com','$2b$10$Fwf7mhzDoIqyuXoKfFgDQeQyUfRyFr3jEC9iw/d3a2IgV8aCnRrBS','user'),(11,'gigicdosantos','gigicdosantos@gmail.com','$2b$10$qtvll.k4eQ6bmMaMYjrtvetbNdWO/mksW9LAzFBtKYcMmprXdg/qW','user'),(12,'boladeneve','porda@gmail.com','$2b$10$n1.beH384Aseifrw5LlWc.saPK3xqiPQvvH7WmbJKZ.8dkvCD3A6C','user'),(17,'mariamaralp','mari.amaralpinto@gmail.com','$2b$10$nixlWYsg7mAyC1qLsz6.1.xmEqO2QKfctSSOTWRWqwQtRcxbon4wW','user'),(19,'admin_master','AdminLibris@gmail.com','$2b$10$fkLTJqnz6ARDwUTi/lbIROEMQ3x11zwyJBYTVGQZzsKRMKn1zccZi','admin'),(21,'ilca1209','ilcaamaralqk@gmail.com','$2b$10$PnWXf0PsIFIlFhqEuQiSHuHHnpjhay8SbPXZ7T0Qkp0KtUXsMKBwi','user'),(22,'alanroxo','alanroxo01@gmail.com','$2b$10$9o.8TDiW.qu5Fp03orfPjOzUl.U3zPBhmz7.H0yBM.7WOx6dg4QDC','user');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL,
  `matricula` char(7) DEFAULT NULL,
  `nome` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `senha` varchar(255) DEFAULT NULL,
  `role` varchar(50) NOT NULL DEFAULT 'user',
  PRIMARY KEY (`id`),
  UNIQUE KEY `matricula` (`matricula`),
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chk_matricula_digitos` CHECK (((length(`matricula`) = 7) and regexp_like(`matricula`,_utf8mb4'^[0-9]{7}$')))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (17,'5646598','mariana do amaral pinto','mari.amaralpinto@gmail.com','','user'),(21,'1587161','Ilca  Amaral Pinto','ilcaamaralqk@gmail.com',NULL,'user'),(22,'1234567','Alan','alanroxo1@gmail.com',NULL,'user');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-03 17:00:28
