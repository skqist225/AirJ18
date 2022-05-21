package com.airtnt.airtntapp.aadmin.exception;

public class UserNotFoundException extends RuntimeException {
	public UserNotFoundException(String message, Throwable thrr) {
		super(message, thrr);
	}
	public UserNotFoundException(String message) {
		super(message);
	}
}
