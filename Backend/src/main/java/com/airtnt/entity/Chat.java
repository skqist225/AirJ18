package com.airtnt.entity;

import java.time.LocalDateTime;

import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.MapsId;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.validation.constraints.NotNull;

import com.airtnt.airtntapp.chat.ChatId;
import com.airtnt.airtntapp.chat.dto.Message;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@Builder
@Entity
@Table(name = "chats")
public class Chat {
	@EmbeddedId
	// @GeneratedValue(strategy = GenerationType.IDENTITY)
	private ChatId id;

	@JsonIgnore
	@ManyToOne
	@MapsId("senderId")
	// @JoinColumn(name = "sender_id")
	private User sender;

	@JsonIgnore
	@ManyToOne
	@MapsId("receiverId")
	// @JoinColumn(name = "receiver_id")
	private User receiver;

	@NotNull
	private String message;

	@JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss")
	private LocalDateTime sendAt;

	@Transient
	public static Chat buildChatDTO(Message chatDTO) {
		return new Chat(new ChatId(chatDTO.getSender(), chatDTO.getReceiver()), new User(chatDTO.getSender()),
				new User(chatDTO.getReceiver()), chatDTO.getMessage(), LocalDateTime.now());
	}

	// @Transient
	// public ObjectNode getReceiverInfo() throws JsonProcessingException {
	// ObjectMapper mapper = new ObjectMapper();
	// ObjectNode rootNode = mapper.createObjectNode();
	//
	// if (this.receiver != null) {
	// String receiverImage = this.receiver.getAvatarPath();
	// String receiverFullName = this.receiver.getFullName();
	//
	// rootNode.put("avatar", receiverImage);
	// rootNode.put("fullName", receiverFullName);
	// }
	//
	// return rootNode;
	// }

	// public Chat(User sender, User receiver, String message, LocalDateTime sendAt)
	// {
	// super();
	// this.sender = sender;
	// this.receiver = receiver;
	// this.message = message;
	// this.sendAt = sendAt;
	// }
}
