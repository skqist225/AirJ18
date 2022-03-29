package com.airtnt.airtntapp.response.success;

import com.airtnt.airtntapp.response.SuccessResponse;

public class OkResponse<T> extends SuccessResponse<T> {
    public OkResponse(T data) {
        super.setResponse(200, data);
    }
}
