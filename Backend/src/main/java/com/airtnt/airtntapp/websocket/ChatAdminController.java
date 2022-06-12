package com.airtnt.airtntapp.websocket;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.*;
import org.springframework.stereotype.Controller;

@Controller
public class ChatAdminController {
	
	@Autowired
	private SimpMessagingTemplate simpmessagingTemplate;
	
	@MessageMapping("/message")
	@SendTo("/chatroom/public")
	private Message receivePublicMessage (@Payload Message message) {
		return message;
	}
	
	@MessageMapping("/private-message")
	public Message receivePrivateMessage (@Payload Message message) {
		
		simpmessagingTemplate.convertAndSendToUser(message.getReceiverName(), "/private", message);
		return message;
	}
}
