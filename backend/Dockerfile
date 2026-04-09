# ---- Build Stage ----
FROM eclipse-temurin:21-jdk AS builder
WORKDIR /app

# Copy maven wrapper and pom.xml
COPY mvnw pom.xml ./
COPY .mvn .mvn
RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline

# Copy the source code and build the application
COPY src ./src
RUN ./mvnw clean package -DskipTests

# ---- Run Stage ----
FROM eclipse-temurin:21-jre
WORKDIR /app

# Copy only the compiled jar from the builder stage
COPY --from=builder /app/target/*.jar app.jar

# Expose the standard backend port
EXPOSE 8080

# Run the app securely
ENTRYPOINT ["java", "-jar", "app.jar"]
