package com.airtnt.airtntapp.aadmin.exception;

public class PhoneNumberAlreadyUseException extends RuntimeException {
	public PhoneNumberAlreadyUseException(String message, Throwable thrr) {
		super(message, thrr);
	}
	public PhoneNumberAlreadyUseException(String message) {
		super(message);
	}
}
