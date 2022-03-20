package com.airtnt.airtntapp.response;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
public class FailureResponse {
    private int statusCode = 400;
    private String message;

    public FailureResponse(String message) {
        this.message = message;
    }

    public <T> ResponseEntity<StandardJSONResponse<T>> response() {
        StandardJSONResponse<T> standardJSONResponse = new StandardJSONResponse<>();

        standardJSONResponse.setSuccess(false);
        standardJSONResponse.setData(null);
        standardJSONResponse.setError(new ErrorJSONResponse(statusCode, message));

        return new ResponseEntity<StandardJSONResponse<T>>(
                standardJSONResponse, null,
                statusCode);
    }
}
