FROM eclipse-temurin:17-jre-alpine
LABEL authors="Leo"
LABEL description="block-chain-safe-resume"

ENV WORK_DIR=/app
ARG JAR_FILE=*.jar
WORKDIR $WORK_DIR

EXPOSE 8080

COPY ${JAR_FILE} ./app.jar

ENTRYPOINT ["java", "-jar","./app.jar","--spring.profiles.active=test"]