package com.airtnt.airtntapp.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class StandardJSONResponse<T> {
    private boolean success;
    private T data;
    public String error;
}
