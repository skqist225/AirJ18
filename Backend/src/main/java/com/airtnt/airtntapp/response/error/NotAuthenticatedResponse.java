package com.airtnt.airtntapp.response.error;

import com.airtnt.airtntapp.response.FailureResponse;

public class NotAuthenticatedResponse<T> extends FailureResponse<T> {
    public NotAuthenticatedResponse() {
        super.setMessage("user not authenticated");
        super.setResponse(401, null);
    }
}
