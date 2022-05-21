package com.airtnt.airtntapp;

import java.security.Principal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

@SpringBootApplication
@ComponentScan({ "com.airtnt.airtntapp" })
@EntityScan({ "com.airtnt.entity" })
@RestController
public class AirTntApplication extends SpringBootServletInitializer {

	public static void main(String[] args) {
		SpringApplication.run(AirTntApplication.class, args);
	}

	@GetMapping("/user")
	public Principal user(Principal principal) {
		return principal;
	}

}
