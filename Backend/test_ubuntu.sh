#!/bin/bash

mvn clean package
cd target
sudo jar -xvf target/*.war
cd WEB-INF && java -classpath "lib/*:classes/." com.airtnt.airtntapp.AirTntApplication