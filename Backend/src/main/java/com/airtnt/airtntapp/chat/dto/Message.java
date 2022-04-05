package com.airtnt.airtntapp.chat.dto;



import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Message {
	private Integer sender;
	private Integer receiver;
    private String message;
}
