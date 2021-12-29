package com.airtnt.airtntapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

@SpringBootApplication
@ComponentScan({ "com.airtnt.airtntapp" })
@EntityScan({ "com.airtnt.entity" })
public class AirTntApplication extends SpringBootServletInitializer {

	public static void main(String[] args) {
		SpringApplication.run(AirTntApplication.class, args);
	}

}
