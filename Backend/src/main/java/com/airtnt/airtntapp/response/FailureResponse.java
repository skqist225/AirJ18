package com.airtnt.airtntapp.response;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class FailureResponse<T> extends Response<T> {
	@Override
	public Response<T> setMessage(String msg) {
		message = msg;
		return this;
	}

	@Override
	public Response<T> setResponse(int code, T data) {
		statusCode = code;
		standardJSONResponse = new StandardJSONResponse<T>(false, data, message);
		return this;
	}
}
