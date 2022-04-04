package com.airtnt.airtntapp.chat;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.airtnt.entity.Chat;
import com.airtnt.entity.User;

@Service
public class ChatService {

	@Autowired
	private ChatRepository chatRepository;
	
	public Chat saveMessage(Chat chat) {
		return chatRepository.save(chat);
	}
	
	public List<Chat> findBySender(User sender){
		return null;
	}


	public List<Chat> findBySenderAndReceiver(User sender, User receiver){
		return null;
	}
}
