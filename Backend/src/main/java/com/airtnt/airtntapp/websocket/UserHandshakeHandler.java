package com.airtnt.airtntapp.websocket;


import java.nio.file.attribute.UserPrincipal;
import java.security.Principal;
import java.util.Map;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;

public class UserHandshakeHandler extends DefaultHandshakeHandler {
	private final Logger LOG = LoggerFactory.getLogger(UserHandshakeHandler.class);
	
	@Override
	protected Principal determineUser(
			ServerHttpRequest request, WebSocketHandler wsHandler, Map<String, Object> attributes) {
		final String randomId = UUID.randomUUID().toString();
		LOG.info(randomId);
		
		return new UserPrincipal() {
			
			@Override
			public String getName() {
				// TODO Auto-generated method stub
				return randomId;
			}
		};
	}}
