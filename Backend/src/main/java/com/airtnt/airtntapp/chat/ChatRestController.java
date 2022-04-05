package com.airtnt.airtntapp.chat;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.airtnt.airtntapp.chat.dto.ChatReceiverDTO;
import com.airtnt.airtntapp.exception.NotAuthenticatedException;
import com.airtnt.airtntapp.exception.NullCookieException;
import com.airtnt.airtntapp.exception.UserNotFoundException;
import com.airtnt.airtntapp.middleware.Authenticate;
import com.airtnt.airtntapp.response.StandardJSONResponse;
import com.airtnt.airtntapp.response.error.BadResponse;
import com.airtnt.airtntapp.response.success.OkResponse;
import com.airtnt.airtntapp.user.UserService;
import com.airtnt.entity.Chat;
import com.airtnt.entity.User;

@RestController
@RequestMapping("/api/chat")
public class ChatRestController {

	@Autowired
	private Authenticate authenticate;

	@Autowired
	private ChatService chatService;

	@Autowired
	private UserService userService;

	@GetMapping("user")
	public ResponseEntity<StandardJSONResponse<List<Chat>>> fetchSenderChat(
			@CookieValue(value = "user", required = false) String cookie) {
		try {
			User sender = authenticate.getLoggedInUser(cookie);
			List<Chat> chats = chatService.findBySender(sender);
			return new OkResponse<List<Chat>>(chats).response();
		} catch (NullCookieException e) {
			return new BadResponse<List<Chat>>(e.getMessage()).response();
		} catch (NotAuthenticatedException e) {
			return new BadResponse<List<Chat>>(e.getMessage()).response();
		}
	}

	@GetMapping("receivers")
	public ResponseEntity<StandardJSONResponse<List<ChatReceiverDTO>>> fetchAllReceivers(
			@CookieValue(value = "user", required = false) String cookie) {
		try {
			User sender = authenticate.getLoggedInUser(cookie);
			List<ChatReceiverDTO> chats = chatService.findAllReceiversBySender(sender);
			return new OkResponse<List<ChatReceiverDTO>>(chats).response();
		} catch (NullCookieException e) {
			return new BadResponse<List<ChatReceiverDTO>>(e.getMessage()).response();
		} catch (NotAuthenticatedException e) {
			return new BadResponse<List<ChatReceiverDTO>>(e.getMessage()).response();
		}
	}

	@GetMapping("receiver/{receiverid}")
	public ResponseEntity<StandardJSONResponse<List<Chat>>> fetchInboxWithReceiver(
			@CookieValue(value = "user", required = false) String cookie,
			@PathVariable("receiverid") Integer receiverId) {
		try {
			User sender = authenticate.getLoggedInUser(cookie);
			try {
				User receiver = userService.findById(receiverId);
				List<Chat> chats = chatService.findBySenderAndReceiver(sender, receiver);
				return new OkResponse<List<Chat>>(chats).response();
			} catch (UserNotFoundException e) {
				return new BadResponse<List<Chat>>(e.getMessage()).response();
			}
		} catch (NullCookieException e) {
			return new BadResponse<List<Chat>>(e.getMessage()).response();
		} catch (NotAuthenticatedException e) {
			return new BadResponse<List<Chat>>(e.getMessage()).response();
		}
	}
}
