package com.airtnt.airtntapp.response.error;

import com.airtnt.airtntapp.response.FailureResponse;

public class BadResponse<T> extends FailureResponse<T> {
    public BadResponse(String message) {
        super.setMessage(message);
        super.setResponse(400, null);
    }
}