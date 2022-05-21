package com.airtnt.airtntapp.aadmin.exception;

public class PasswordNotMatchException extends RuntimeException {
	public PasswordNotMatchException(String message, Throwable err) {
		super(message, err);
	} 
	public PasswordNotMatchException(String message) {
		super(message);
	}
}
