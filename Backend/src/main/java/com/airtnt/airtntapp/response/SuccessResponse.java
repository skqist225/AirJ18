package com.airtnt.airtntapp.response;

import org.springframework.http.ResponseEntity;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
public class SuccessResponse {
    private int statusCode = 200;

    public <T> ResponseEntity<StandardJSONResponse<T>> response(T data) {
        StandardJSONResponse<T> standardJSONResponse = new StandardJSONResponse<>();

        standardJSONResponse.setSuccess(true);
        standardJSONResponse.setData(data);
        standardJSONResponse.setError(null);

        return new ResponseEntity<StandardJSONResponse<T>>(
                standardJSONResponse, null,
                statusCode);
    }
}
