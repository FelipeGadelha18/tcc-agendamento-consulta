# ---------- Build stage ----------
FROM maven:3.9-eclipse-temurin-25 AS build
WORKDIR /app

# Copia só o pom primeiro para cachear o download das dependências.
# Enquanto o pom.xml não mudar, essa camada é reaproveitada.
COPY pom.xml .
RUN mvn -B dependency:go-offline

# Agora o código-fonte e o empacotamento (sem rodar os testes no build da imagem)
COPY src ./src
RUN mvn -B clean package -DskipTests

# ---------- Runtime stage ----------
# Imagem baseada em Ubuntu (não Alpine) de propósito: openpdf/zxing usam java.awt
# para gerar PDF e QR Code, e no Alpine isso costuma exigir pacotes de fonte extras.
FROM eclipse-temurin:25-jdk AS runtime
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

# Roda como usuário não-root
RUN groupadd -r spring && useradd -r -g spring spring && chown spring:spring app.jar
USER spring

EXPOSE 8080
ENTRYPOINT ["java", "-Djava.awt.headless=true", "-jar", "app.jar"]
