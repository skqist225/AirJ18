package com.airtnt.entity;

import java.time.LocalDateTime;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.validation.constraints.NotNull;

import com.airtnt.airtntapp.chat.dto.ChatDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "chats")
public class Chat {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@ManyToOne
	@JoinColumn(name = "sender_id")
	private User sender;

	@ManyToOne
	@JoinColumn(name = "receiver_id")
	private User receiver;

	@NotNull
	private String message;
	
	private LocalDateTime sendAt;

	@Transient
	public static Chat buildChatDTO(ChatDTO chatDTO) {
		return new Chat(new User(chatDTO.getSender()), new User(chatDTO.getReceiver()), chatDTO.getMessage(),
				LocalDateTime.now());
	}

	public Chat(User sender, User receiver, String message, LocalDateTime sendAt) {
		super();
		this.sender = sender;
		this.receiver = receiver;
		this.message = message;
		this.sendAt = sendAt;
	}
}
