package com.airtnt.airtntapp.aadmin.exception;

public class ForeignKeyConstraintException extends RuntimeException{
	public ForeignKeyConstraintException(String message, Throwable thrr) {
		super(message, thrr);
	}
	
	public ForeignKeyConstraintException(String message) {
		super(message);
	}
}
