#!/bin/bash

rm -rf target
mvn clean package
cd target
sudo jar -xvf *.war
cd WEB-INF && java -classpath "lib/*:classes/." com.airtnt.airtntapp.AirTntApplication