package com.airtnt.airtntapp.aadmin.exception;

public class EmailConflictException extends RuntimeException{
	public EmailConflictException(String message, Throwable err) {
		super(message, err);
	} 
	public EmailConflictException(String message) {
		super(message);
	}
}
