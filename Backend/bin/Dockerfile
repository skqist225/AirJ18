FROM openjdk:11.0.11-jre
WORKDIR /Backend
VOLUME /tmp
ENV WORKINGFOLER /Backend/WEB-INF
COPY */target/WEB-INF ${WORKINGFOLER}
ENV MAIN_CLASS com.airtnt.airtntapp.AirTntApplication
ENTRYPOINT [ "sh", "-c", "cd ${WORKINGFOLER} && java -classpath \"lib/*:classes/.\" ${MAIN_CLASS}" ]

