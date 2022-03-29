package com.airtnt.airtntapp.response;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class SuccessResponse<T> extends Response<T> {
    @Override
    public Response<T> setResponse(int code, T data) {
        statusCode = code;
        standardJSONResponse = new StandardJSONResponse<>(true, data, null);
        return this;
    }
}
