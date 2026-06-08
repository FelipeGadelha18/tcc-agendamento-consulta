# [E-ficha]

> [!NOTE]
>
> ## Configuração do Ambiente
>
> Todas as instruções de instalação, configuração das tecnologias, clonagem do repositório, configuração do banco de dados, importação do arquivo SQL e execução do projeto estão documentadas no arquivo **SETUP.md**.
>
> Consulte o guia antes de executar a aplicação:
>
> ```text
> SETUP.md
> ```

## 📋 Sobre o Projeto

Desenvolver uma aplicação web que permite que usuários realizem o agendamento de consultas em postos de saúde de forma digital, reduzindo filas e deslocamentos desnecessários. A solução organiza o fluxo de pacientes, melhora o atendimento e torna o processo mais acessível e eficiente.

---

## ✨ Principais Funcionalidades

* [ ] Cadastro e autenticação de usuários
* [ ] Agendamento de consultas online
* [ ] Gerenciamento de horários disponíveis
* [ ] Cancelamento e reagendamento de consultas
* [ ] Histórico de consultas do paciente
* [ ] Painel administrativo para gerenciamento dos atendimentos

---

## 🛠️ Tecnologias

### Back-end

* Java 25.0.1
* Spring Boot
* Spring Data JPA
* Maven
* MySQL

### Front-end

* Angular 19
* TypeScript
* Node.js 22
* HTML5
* CSS3
---


## ⚙️ Pré-requisitos e Instalação
Antes de começar, você precisará instalar as seguintes ferramentas em sua máquina. Siga o mini-tutorial abaixo para cada uma delas:

### 1. Git (Para clonar o projeto)
Download: Acesse o site oficial do Git:

```bash
https://git-scm.com/install/
```

Como Instalar: * Windows/macOS: Baixe o instalador e siga o avançar padrão ("Next" até o fim).

Linux (Ubuntu/Debian): Execute no terminal: sudo apt install git

Verificação: Abra seu terminal e digite git --version para confirmar.

### 2. Java JDK 25
Download: Acesse o site da Oracle:

```bash
https://www.oracle.com/java/technologies/downloads/
```

Como Instalar:

Baixe o instalador de acordo com o seu sistema operacional e execute-o.

Dica para Windows: Certifique-se de marcar a opção de adicionar o Java às variáveis de ambiente (PATH), ou configure a variável JAVA_HOME manualmente após a instalação.

Verificação: No terminal, digite java -version.

### 3. Node.js (Versão 22) & npm
Download: Acesse o site oficial do Node.js (Procure pela aba "Downloads" e selecione a versão 22 LTS).

```bash
https://nodejs.org/pt-br
```

Como Instalar:

Execute o instalador baixado. O gerenciador de pacotes npm será instalado automaticamente junto com o Node.

Verificação: No terminal, use node -v e npm -v.

Angular CLI: Com o Node instalado, instale a interface de linha de comando do Angular globalmente rodando:

Bash
npm install -g @angular/cli@19

### 4. MySQL
Download: [link suspeito removido] ou o MySQL Installer para Windows.

```bash
https://www.apachefriends.org/pt_br/download.html
```

Como Instalar:

Avance pelas etapas recomendadas (instalação do Servidor + MySQL Workbench).

Atenção: Durante o processo, será solicitado que você defina uma senha para o usuário root. Guarde essa senha, pois ela será necessária para configurar a conexão do banco no Spring Boot (application.properties).

---

## 📥 Clonando o Projeto

```bash
git clone https://github.com/FelipeGadelha18/tcc-agendamento-consulta.git
```

Entre na pasta do projeto:

```bash
cd tcc-agendamento-consulta
```

---

## ⚡ Comandos Rápidos

### Instalar dependências do Back-end

```bash
cd Eficha
mvn clean install
```

### Instalar dependências do Front-end

```bash
cd Efichaapp
npm install
```

### Executar o Front-end

```bash
ng serve
```

Aplicação disponível em:

```text
http://localhost:4200
```

### Executar o Back-end

```bash
mvn spring-boot:run
```

API disponível em:

```text
http://localhost:8080
```

---

## 📂 Estrutura do Projeto

```text
tcc-agendamento-consulta/
│
├── Eficha/
│   ├── src/
│   ├── pom.xml
│
├── Efichaapp/
│   ├── src/
│   ├── package.json
│
├── database/
│   └── tcc_agendamento.sql
│
├── SETUP.md
│
└── README.md
```

---

## 📖 Documentação

A documentação completa de instalação e configuração encontra-se em:

```text
SETUP.md
```

---

## 👥 Equipe

| Nome                   | Papel                | GitHub           |
| ---------------------- | -------------------- | ---------------- |
| Felipe Gadelha         | Full Stack Developer | @FelipeGadelha18 |
| Maria Eduarda Oliveira | Full Stack Developer | @eduhwwh         |

### GitHub dos Integrantes

* Felipe Gadelha: https://github.com/FelipeGadelha18
* Maria Eduarda Oliveira: https://github.com/eduhwwh

---

## 📌 Status do Projeto

🚧 Em desenvolvimento

---

## 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos como Trabalho de Conclusão de Curso (TCC).
