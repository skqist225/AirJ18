package com.airtnt.airtntapp.response.error;

import com.airtnt.airtntapp.response.FailureResponse;

public class ForbiddenResponse<T> extends FailureResponse<T> {
    public ForbiddenResponse() {
        super.setMessage("forbidden");
        super.setResponse(403, null);
    }

    public ForbiddenResponse(String message) {
        super.setMessage(message);
        super.setResponse(403, null);
    }
}
