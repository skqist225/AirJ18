package com.airtnt.airtntapp.response;

import org.springframework.http.ResponseEntity;

public abstract class Response<T> {
	protected int statusCode;
	protected StandardJSONResponse<T> standardJSONResponse;
	protected String message;

	public abstract Response<T> setResponse(int code, T data);

	public Response<T> setMessage(String message) {
		return this;
	}

	public ResponseEntity<StandardJSONResponse<T>> response() {
		return new ResponseEntity<StandardJSONResponse<T>>(standardJSONResponse, null, statusCode);
	}

	public ResponseEntity<StandardJSONResponse<String>> responseErrorList(String errorList, String errorMessage) {
		StandardJSONResponse<String> stdJSONResponse = new StandardJSONResponse<String>(false, errorList, errorMessage);
		return new ResponseEntity<StandardJSONResponse<String>>(stdJSONResponse, null, statusCode);
	}
}
