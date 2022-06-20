package com.airtnt.airtntapp.security;

import com.airtnt.airtntapp.jwt.AuthEntryPointJwt;
import com.airtnt.airtntapp.jwt.JwtFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

	@Autowired
	private JwtFilter jwtFilter;

	@Autowired
	private UserDetailsServiceImpl userDetailsServiceImpl;

	@Autowired
	private AuthEntryPointJwt unauthorizedHandler;

	@Override
	@Bean
	public AuthenticationManager authenticationManagerBean() throws Exception {
		return super.authenticationManagerBean();
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Override
	protected void configure(AuthenticationManagerBuilder auth) throws Exception {
		auth.userDetailsService(userDetailsServiceImpl).passwordEncoder(passwordEncoder());
	}

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.csrf().disable().exceptionHandling().authenticationEntryPoint(unauthorizedHandler).and()
				.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and().authorizeRequests()
                .antMatchers(HttpMethod.GET, "/api/listings/**").authenticated()
                .antMatchers(HttpMethod.POST, "/api/booking/*/create").authenticated()
                .antMatchers(HttpMethod.GET, "/api/booking/*/canceled", "/api/booking/*/approved").hasRole("Host")
				.antMatchers("/api/auth/**").permitAll()
                .antMatchers("/progress/**",
                        "/user/bookings", "/hosting/listings/*", "/wishlists*",
                        "/become-a-host/*",
                        "/user/personal-info", "/user/add-to-wishlists/*", "/user/remove-from-wishlists/*", "/booking/**")
                .authenticated()
				.anyRequest().authenticated()
				.and().formLogin().loginPage("/login").usernameParameter("email").permitAll().and().logout().permitAll()
				.and().rememberMe().rememberMeCookieName("rememberme").key("remember-me-token")
				.tokenValiditySeconds(365 * 24 * 60 * 60).alwaysRemember(true);

		http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
	}

	@Override
	public void configure(WebSecurity web) throws Exception {
		web.ignoring().antMatchers("/images/**", "/js/**", "/webjars/**", "/js/settings/**");
	}

}