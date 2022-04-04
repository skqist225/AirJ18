package com.airtnt.airtntapp.chat;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;

import com.airtnt.airtntapp.chat.dto.ChatDTO;
import com.airtnt.airtntapp.websocket.dto.ChatMessage;
import com.airtnt.entity.Chat;

@Controller
public class ChatController {
	
	@Autowired 
	private ChatService chatService;

    @GetMapping("/chat")
    public String chat(ModelMap modelMap) {
        return "chat";
    }

    @MessageMapping("/chat.register")
    @SendTo("/topic/public")
    public ChatMessage register(@Payload ChatMessage chatMessage, SimpMessageHeaderAccessor headerAccessor) {
        headerAccessor.getSessionAttributes().put("username", chatMessage.getSender());
        return chatMessage;
    }

    @MessageMapping("/chat.send")
    @SendTo("/topic/public")
    public ChatDTO sendMessage(@Payload ChatDTO chatMessage) {
//    	chatService.saveMessage(Chat.buildChatDTO(chatMessage));
    	
        return chatMessage;
    }
    
    @MessageMapping("/private-message")
    @SendTo("/topic/private-messages")
    public ChatDTO sendPrivateMessage(@Payload ChatDTO chatMessage) {
    	chatService.saveMessage(Chat.buildChatDTO(chatMessage));
    	
        return chatMessage;
    }
    
    
    
    
    
    
    
    
    
    
    
}