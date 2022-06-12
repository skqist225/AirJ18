package com.airtnt.airtntapp.chat;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import com.airtnt.airtntapp.chat.dto.Message;
import com.airtnt.entity.Chat;

@Controller
public class ChatController {

//	@Autowired
//	private ChatService chatService;
//
//	@Autowired
//	private SimpMessagingTemplate simpMessagingTemplate;
//
//	@MessageMapping("/private-message") ///user/1/private
//	public Message sendPrivateMessage(@Payload Message message) {
//		chatService.saveMessage(Chat.buildChatDTO(message));
//		simpMessagingTemplate.convertAndSendToUser(message.getReceiver().toString(), "/private", message.getMessage());
//		return message;
//	}
}