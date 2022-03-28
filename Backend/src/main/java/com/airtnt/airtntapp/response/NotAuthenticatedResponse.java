package com.airtnt.airtntapp.response;

import java.io.Serializable;

import org.springframework.http.ResponseEntity;

public class NotAuthenticatedResponse implements Serializable {
    private static final long serialVersionUID = 1L;

    public static <T> ResponseEntity<StandardJSONResponse<T>> response() {
        return new FailureResponse(401, "user not authenticated").response();
    }
}
