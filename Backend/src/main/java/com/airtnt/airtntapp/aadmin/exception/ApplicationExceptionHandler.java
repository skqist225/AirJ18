package com.airtnt.airtntapp.aadmin.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ApplicationExceptionHandler {

	@ExceptionHandler(EmailConflictException.class)
	public ResponseEntity<String> handleBadEmail(EmailConflictException e){
		return ResponseEntity.badRequest().body(e.getMessage());
	}
	
	@ExceptionHandler(PasswordNotMatchException.class)
	public ResponseEntity<String> handleBadPassword(PasswordNotMatchException e){
		return ResponseEntity.badRequest().body(e.getMessage());
	}
	
	@ExceptionHandler(UserNotFoundException.class)
	public ResponseEntity<String> handleUserNotFound(UserNotFoundException e){
		return ResponseEntity.badRequest().body(e.getMessage());
	}
	
	@ExceptionHandler(ForeignKeyConstraintException.class)
	public ResponseEntity<String> handleForeignKeyConstraint(ForeignKeyConstraintException e){
		return ResponseEntity.badRequest().body(e.getMessage());
	}
	
	@ExceptionHandler(PhoneNumberAlreadyUseException.class)
	public ResponseEntity<String> handleForeignKeyConstraint(PhoneNumberAlreadyUseException e){
		return ResponseEntity.badRequest().body(e.getMessage());
	}
}
