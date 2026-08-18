-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 12/08/2026 às 19:00
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `tcc_agendamento`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `administrador`
--

CREATE TABLE `administrador` (
  `id` bigint(20) NOT NULL,
  `ativo` tinyint(4) NOT NULL DEFAULT 1,
  `cpf` varchar(11) NOT NULL,
  `email` varchar(120) NOT NULL,
  `id_posto` bigint(20) NOT NULL,
  `nome_completo` varchar(150) NOT NULL,
  `senha` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `administrador`
--

INSERT INTO `administrador` (`id`, `ativo`, `cpf`, `email`, `id_posto`, `nome_completo`, `senha`) VALUES
(1, 1, '97082814097', 'admin@example.com', 1, 'Administrador', '$2a$10$LglLFvaJRyhpH/gzSUPYMeZ89eLXGTBqzN0xuS6Zrw7lo1KRn8/nO');

-- --------------------------------------------------------

--
-- Estrutura para tabela `paciente`
--

CREATE TABLE `paciente` (
  `id` bigint(20) NOT NULL,
  `cpf` varchar(11) NOT NULL,
  `email` varchar(120) NOT NULL,
  `endereco` varchar(200) NOT NULL,
  `foto` longtext DEFAULT NULL,
  `nome_completo` varchar(150) NOT NULL,
  `numero_casa` varchar(10) NOT NULL,
  `senha` varchar(60) NOT NULL,
  `telefone` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `paciente`
--

INSERT INTO `paciente` (`id`, `cpf`, `email`, `endereco`, `foto`, `nome_completo`, `numero_casa`, `senha`, `telefone`) VALUES
(1, '71482892030', 'marciosilva@gmail.com', 'Rua Teste', NULL, 'Márcio da Silva Silvera', '123', '$2a$10$KtLRyYZXw4MHbp4HisNh1eINH8aSWkkeBTYAzLTE8D7aqL0apAuea', '68 996564321');

-- --------------------------------------------------------

--
-- Estrutura para tabela `posto_datas_bloqueadas`
--

CREATE TABLE `posto_datas_bloqueadas` (
  `posto_id` bigint(20) NOT NULL,
  `data_bloqueada` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `posto_datas_disponiveis`
--

CREATE TABLE `posto_datas_disponiveis` (
  `posto_id` bigint(20) NOT NULL,
  `data_disponivel` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `posto_saude`
--

CREATE TABLE `posto_saude` (
  `id` bigint(20) NOT NULL,
  `bairro` varchar(255) DEFAULT NULL,
  `cidade` varchar(255) DEFAULT NULL,
  `endereco` varchar(255) DEFAULT NULL,
  `estado` varchar(255) DEFAULT NULL,
  `fichas_disponiveis` int(11) NOT NULL,
  `latitude` double DEFAULT NULL,
  `limite_fichas_por_cpf` int(11) NOT NULL,
  `longitude` double DEFAULT NULL,
  `nome` varchar(255) DEFAULT NULL,
  `prazo_cancelamento_horas` int(11) NOT NULL,
  `telefone` varchar(255) DEFAULT NULL,
  `total_fichas` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `posto_saude`
--

INSERT INTO `posto_saude` (`id`, `bairro`, `cidade`, `endereco`, `estado`, `fichas_disponiveis`, `latitude`, `limite_fichas_por_cpf`, `longitude`, `nome`, `prazo_cancelamento_horas`, `telefone`, `total_fichas`) VALUES
(1, 'Estação Experimental', 'Rio Branco', 'Rua São Lázaro, 690 – Conj. Tangará', 'AC', 30, NULL, 1, NULL, 'Centro de Saúde Barral y Barral', 24, '(68) 99999-0000', 30),
(2, 'Conjunto Adalberto Sena', 'Rio Branco', 'R. Gavião, 2-96 - Conj. Adalberto Sena', 'AC', 30, NULL, 1, NULL, 'Urap Francisco Roney Meireles', 24, '(68) 99999-9000', 30);

-- --------------------------------------------------------

--
-- Estrutura para tabela `recepcionista`
--

CREATE TABLE `recepcionista` (
  `id` bigint(20) NOT NULL,
  `ativo` tinyint(4) NOT NULL DEFAULT 1,
  `cpf` varchar(11) NOT NULL,
  `email` varchar(120) NOT NULL,
  `id_posto` bigint(20) NOT NULL,
  `nome_completo` varchar(150) NOT NULL,
  `senha` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `reserva`
--

CREATE TABLE `reserva` (
  `id` bigint(20) NOT NULL,
  `data_criacao` date DEFAULT NULL,
  `data_reserva` date DEFAULT NULL,
  `status` enum('CANCELADA','CHAMADO','CONFIRMADA','NO_SHOW','PENDENTE','UTILIZADA') NOT NULL,
  `paciente_id` bigint(20) NOT NULL,
  `posto_saude_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `administrador`
--
ALTER TABLE `administrador`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKkq6i599492dc6088sfeeaoq0o` (`cpf`),
  ADD UNIQUE KEY `UKh121ki47maojpkmvdvqf87ybo` (`email`);

--
-- Índices de tabela `paciente`
--
ALTER TABLE `paciente`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKfvlo8m5kqpr7knbyw4rjyer2s` (`cpf`),
  ADD UNIQUE KEY `UK18lohpcm5raj5wjr9t02t9axb` (`email`);

--
-- Índices de tabela `posto_datas_bloqueadas`
--
ALTER TABLE `posto_datas_bloqueadas`
  ADD KEY `FKciep6vuox1c5297plmdjy1r66` (`posto_id`);

--
-- Índices de tabela `posto_datas_disponiveis`
--
ALTER TABLE `posto_datas_disponiveis`
  ADD KEY `FK37aktavkn52626ctexibv4jjs` (`posto_id`);

--
-- Índices de tabela `posto_saude`
--
ALTER TABLE `posto_saude`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `recepcionista`
--
ALTER TABLE `recepcionista`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKr2kyk6rpe0ynlv4bx3gs4gp7r` (`cpf`),
  ADD UNIQUE KEY `UKc02rq28uyfjm1ubjusk56e4fa` (`email`);

--
-- Índices de tabela `reserva`
--
ALTER TABLE `reserva`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK6295led8ybux1jc72r43d3q6j` (`paciente_id`),
  ADD KEY `FKkat4kqr75lc5ite6dn56pdcvr` (`posto_saude_id`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `administrador`
--
ALTER TABLE `administrador`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `paciente`
--
ALTER TABLE `paciente`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `posto_saude`
--
ALTER TABLE `posto_saude`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `recepcionista`
--
ALTER TABLE `recepcionista`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `reserva`
--
ALTER TABLE `reserva`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `posto_datas_bloqueadas`
--
ALTER TABLE `posto_datas_bloqueadas`
  ADD CONSTRAINT `FKciep6vuox1c5297plmdjy1r66` FOREIGN KEY (`posto_id`) REFERENCES `posto_saude` (`id`);

--
-- Restrições para tabelas `posto_datas_disponiveis`
--
ALTER TABLE `posto_datas_disponiveis`
  ADD CONSTRAINT `FK37aktavkn52626ctexibv4jjs` FOREIGN KEY (`posto_id`) REFERENCES `posto_saude` (`id`);

--
-- Restrições para tabelas `reserva`
--
ALTER TABLE `reserva`
  ADD CONSTRAINT `FK6295led8ybux1jc72r43d3q6j` FOREIGN KEY (`paciente_id`) REFERENCES `paciente` (`id`),
  ADD CONSTRAINT `FKkat4kqr75lc5ite6dn56pdcvr` FOREIGN KEY (`posto_saude_id`) REFERENCES `posto_saude` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
