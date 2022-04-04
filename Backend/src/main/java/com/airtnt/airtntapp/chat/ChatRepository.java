package com.airtnt.airtntapp.chat;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.airtnt.entity.Chat;
import com.airtnt.entity.User;

@Repository
public interface ChatRepository extends CrudRepository<Chat, Integer> {
	List<Chat> findBySender(User sender);
	
	List<Chat> findBySenderAndReceiver(User sender, User receiver);
}
