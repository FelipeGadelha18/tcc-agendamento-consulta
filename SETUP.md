# 🚀 Instalação e Configuração do Ambiente

## Pré-requisitos

Antes de executar o projeto, instale as seguintes tecnologias:

| Tecnologia         | Versão        |
| ------------------ | ------------- |
| Java               | 25.0.1        |
| Spring Boot        | 3.x           |
| Maven              | 3.9+          |
| MySQL (XAMPP)      | 8.x           |
| Node.js            | 22.x          |
| Angular CLI        | 19.x          |
| Visual Studio Code | Última versão |

---

# 1. Instalação do Java JDK 25

### Download

Acesse o site oficial da Oracle:

[Oracle JDK 25](https://www.oracle.com/java/technologies/downloads/?utm_source=chatgpt.com)

### Instalação

1. Baixe o instalador para Windows.
2. Execute o arquivo `.exe`.
3. Clique em **Next** até finalizar.
4. Reinicie o computador.

### Verificar instalação

Abra o Prompt de Comando:

```bash
java --version
javac --version
```

Resultado esperado:

```bash
java 25.0.1
javac 25.0.1
```

O Spring Boot requer Java 17 ou superior.

---

# 2. Instalação do Apache Maven

### Download

Site oficial:

[Apache Maven](https://maven.apache.org/maven.apache.org/download.cgi?utm_source=chatgpt.com)

### Instalação

1. Baixe o arquivo ZIP binário.
2. Extraia para:

```text
C:\Program Files\Apache\Maven
```

3. Configure as variáveis de ambiente:

#### Variável MAVEN_HOME

```text
C:\Program Files\Apache\Maven
```

#### Adicionar ao PATH

```text
%MAVEN_HOME%\bin
```

### Verificar instalação

```bash
mvn -version
```

Resultado esperado:

```bash
Apache Maven 3.9.x
Java version: 25.0.1
```

O Maven 3.9+ é a versão recomendada atualmente.

---

# 3. Instalação do XAMPP

### Download

Site oficial:

[XAMPP Download](https://www.apachefriends.org/pt_br/index.html?utm_source=chatgpt.com)

### Instalação

1. Execute o instalador.
2. Marque:

* Apache
* MySQL
* phpMyAdmin

3. Finalize a instalação.

### Iniciar serviços

Abra o painel do XAMPP e clique em:

```text
Start → Apache
Start → MySQL
```

Os dois devem ficar verdes.

---

# 4. Criação do Banco de Dados

### Acessar phpMyAdmin

Abra no navegador:

```text
http://localhost/phpmyadmin
```

### Criar banco

1. Clique em **Novo**.
2. Nome do banco:

```sql
agendamento_saude
```

3. Clique em **Criar**.

---

# 5. Importar o Banco de Dados

Após criar o banco:

1. Selecione o banco `agendamento_saude`.
2. Clique em **Importar**.
3. Escolha o arquivo:

```text
database.sql
```

4. Clique em **Executar**.

Se tudo estiver correto aparecerá:

```text
Importação concluída com sucesso.
```

---

# 6. Configuração do Spring Boot

Abra o projeto Back-end.

Localize:

```text
src/main/resources/application.properties
```

Configure:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/agendamento_saude
spring.datasource.username=root
spring.datasource.password=
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

Caso tenha senha no MySQL, informe no campo:

```properties
spring.datasource.password=suasenha
```

---

# 7. Instalação do Node.js

### Download

Site oficial:

[Node.js Download](https://nodejs.org/pt?utm_source=chatgpt.com)

Instale a versão LTS mais próxima da utilizada no projeto (22.x).

### Verificar instalação

```bash
node -v
npm -v
```

---

# 8. Instalação do Angular CLI

Abra o terminal:

```bash
npm install -g @angular/cli@19
```

Verifique:

```bash
ng version
```

---

# 9. Configuração do Front-end

Entre na pasta do projeto Angular:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Executar:

```bash
ng serve
```

A aplicação ficará disponível em:

```text
http://localhost:4200
```

---

# 10. Configuração do Back-end

Entre na pasta do projeto Spring:

```bash
cd backend
```

Instale as dependências:

```bash
mvn clean install
```

Executar:

```bash
mvn spring-boot:run
```

A API ficará disponível em:

```text
http://localhost:8080
```

---

# 11. Extensões Recomendadas para VS Code

## Java

Instale:

* Extension Pack for Java
* Language Support for Java™ by Red Hat
* Debugger for Java
* Maven for Java
* Test Runner for Java
* Project Manager for Java

Marketplace:

[Java Extension Pack](https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-java-pack&utm_source=chatgpt.com)

---

## Spring Boot

Instale:

* Spring Boot Extension Pack

Marketplace:

[Spring Boot Extension Pack](https://marketplace.visualstudio.com/items?itemName=vmware.vscode-boot-dev-pack&utm_source=chatgpt.com)

---

## Angular

Instale:

* Angular Language Service

Marketplace:

[Angular Language Service](https://marketplace.visualstudio.com/items?itemName=Angular.ng-template&utm_source=chatgpt.com)

---

## Banco de Dados

Instale:

* SQLTools
* SQLTools MySQL/MariaDB Driver

Marketplace:

[SQLTools](https://marketplace.visualstudio.com/items?itemName=mtxr.sqltools&utm_source=chatgpt.com)

---

# 12. Executando o Projeto

### 1º Passo

Inicie o XAMPP:

```text
Apache → Start
MySQL → Start
```

### 2º Passo

Execute o Back-end:

```bash
mvn spring-boot:run
```

### 3º Passo

Execute o Front-end:

```bash
ng serve
```

### 4º Passo

Acesse:

Frontend:

```text
http://localhost:4200
```

API:

```text
http://localhost:8080
```

---

# Estrutura do Projeto

```text
Projeto
│
├── backend
│   ├── src
│   ├── pom.xml
│
├── frontend
│   ├── src
│   ├── package.json
│
└── database
    └── database.sql
```
