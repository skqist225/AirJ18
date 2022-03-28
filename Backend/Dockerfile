FROM openjdk:11.0.11-jre
VOLUME /tmp
COPY target/WEB-INF WEB-INF
#jar -xvf target/*.war
CMD cd WEB-INF; java -classpath "lib/*:classes/." com.airtnt.airtntapp.AirTntApplication