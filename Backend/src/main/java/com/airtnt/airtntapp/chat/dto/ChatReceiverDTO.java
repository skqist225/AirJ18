package com.airtnt.airtntapp.chat.dto;

import com.airtnt.entity.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatReceiverDTO {

	private String avatar;
	private String fullName;

	public static ChatReceiverDTO buildChatReceiverDTO(User user) {
		return ChatReceiverDTO.builder()
				.avatar(user.getAvatarPath())
				.fullName(user.getFullName())
				.build();
	}
}
