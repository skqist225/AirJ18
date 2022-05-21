package com.airtnt.airtntapp.chat;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.airtnt.airtntapp.chat.dto.ChatReceiverDTO;
import com.airtnt.entity.Chat;
import com.airtnt.entity.User;

@Service
public class ChatService {

	@Autowired
	private ChatRepository chatRepository;

	public Chat saveMessage(Chat chat) {
		return chatRepository.save(chat);
	}

	public List<Chat> findBySender(User sender) {
		return chatRepository.findBySender(sender);
	}

	public List<Chat> findBySenderAndReceiver(User sender, User receiver) {
		return chatRepository.findBySenderAndReceiver(sender, receiver);
	}

	public List<ChatReceiverDTO> findAllReceiversBySender(User sender) {
		List<ChatReceiverDTO> receivers = (List<ChatReceiverDTO>) chatRepository.findAllReceiversBySender(sender)
				.stream().map(receiver -> ChatReceiverDTO.buildChatReceiverDTO(receiver)).collect(Collectors.toList());
		return receivers;
	}
}
