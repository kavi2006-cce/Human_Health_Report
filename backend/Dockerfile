# Build stage
FROM maven:3.9.13-eclipse-temurin-25 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:25-jdk-jammy
WORKDIR /app
EXPOSE 8081
COPY --from=build /app/target/healthmonitor-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
