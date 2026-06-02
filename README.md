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
cd backend
mvn clean install
```

### Instalar dependências do Front-end

```bash
cd frontend
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
├── backend/
│   ├── src/
│   ├── pom.xml
│
├── frontend/
│   ├── src/
│   ├── package.json
│
├── database/
│   └── database.sql
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
