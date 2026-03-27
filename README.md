# [E-ficha]

> [!NOTE]
>
> Template para TCC
>
> Personalize este README com as informações do projeto.

Aplicação web que permite que usuários realizem o agendamento de consultas em postos de saúde de forma digital, reduzindo filas e deslocamentos desnecessários. A solução organiza o fluxo de pacientes, melhora o atendimento e torna o processo mais acessível e eficiente.

---

## ✨ Principais funcionalidades

* [ ] Cadastro e login de usuários
* [ ] Agendamento de consultas
* [ ] Visualização de horários disponíveis
* [ ] Cancelamento e reagendamento
* [ ] Área administrativa para gestão de atendimentos

---

## 🛠️ Tecnologias

### Back-end

* Java 17
* Spring Boot
* MySQL

### Front-end

* Angular 19
* TypeScript
* Node.js 22

---

## ⚙️ Instalação do ambiente

### 🔹 Pré-requisitos

Antes de começar, você precisa ter instalado:

* Node.js (v22 ou superior)
* Java JDK 17
* MySQL
* Git

---

### 🔹 Instalando o Angular 19

```bash
npm install -g @angular/cli@19
```

Verifique se instalou corretamente:

```bash
ng version
```

---

### 🔹 Instalando o Java 17

1. Baixe o JDK 17 (Oracle ou OpenJDK)
2. Instale normalmente
3. Configure a variável de ambiente:

**Windows (PowerShell):**

```bash
java -version
```

---

### 🔹 Instalando o Spring Boot

Você pode usar o Spring Initializr:

👉 [https://start.spring.io/](https://start.spring.io/)

Ou rodar o projeto com:

```bash
./mvnw spring-boot:run
```

Ou, se usar Maven instalado:

```bash
mvn spring-boot:run
```

---

### 🔹 Banco de dados (MySQL)

1. Instale o MySQL
2. Crie um banco de dados:

```sql
CREATE DATABASE eficha;
```

3. Configure no `application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/eficha
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha
```

---

## 🚀 Como rodar o projeto

### 🔹 Clonar o repositório

```bash
git clone https://github.com/seu-repositorio.git
cd nome-do-projeto
```

---

### 🔹 Rodar o back-end

```bash
cd backend
mvn spring-boot:run
```

---

### 🔹 Rodar o front-end

```bash
cd frontend
npm install
ng serve
```

Acesse:
👉 [http://localhost:4200](http://localhost:4200)

---

## 🔄 Comandos Git (Pull, Push)

### 🔹 Atualizar o projeto (pull)

```bash
git pull origin main
```

---

### 🔹 Adicionar alterações

```bash
git add .
```

---

### 🔹 Criar commit

```bash
git commit -m "Descrição das alterações"
```

---

### 🔹 Enviar para o repositório (push)

```bash
git push origin main
```

---

## 👥 Equipe

| Nome                   | Papel      | GitHub                                                 |
| ---------------------- | ---------- | ------------------------------------------------------ |
| Felipe Gadelha         | Full-stack | [@FelipeGadelha18](https://github.com/FelipeGadelha18) |
| Maria Eduarda Oliveira | Full-stack | [@eduhwwh](https://github.com/eduhwwh)                 |

