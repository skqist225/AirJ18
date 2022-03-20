package com.airtnt.airtntapp.response;

import org.springframework.http.ResponseEntity;

public class NotAuthenticatedResponse {

    public static <T> ResponseEntity<StandardJSONResponse<T>> response() {
        return new FailureResponse(401, "user not authenticated").response();
    }
}
