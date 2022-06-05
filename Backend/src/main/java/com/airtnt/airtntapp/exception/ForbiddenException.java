package com.airtnt.airtntapp.exception;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ForbiddenException extends Exception {
    private final int statusCode = 403;
    private String message = "Permission denied!";

    public ForbiddenException(String message) {
        this.message = message;
    }
}
