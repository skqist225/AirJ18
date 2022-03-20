package com.airtnt.airtntapp.exception;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ForbiddenException extends Exception {
    private final int statusCode = 403;
    private final String message = "permission denied!";
}
