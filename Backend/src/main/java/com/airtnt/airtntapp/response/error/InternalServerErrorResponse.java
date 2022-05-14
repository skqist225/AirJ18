package com.airtnt.airtntapp.response.error;

import com.airtnt.airtntapp.response.FailureResponse;

public class InternalServerErrorResponse<T> extends FailureResponse<T> {
    public InternalServerErrorResponse() {
        super.setMessage("Internal server error");
        super.setResponse(500, null);
    }
}
