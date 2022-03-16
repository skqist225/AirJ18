package com.airtnt.error;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NotAuthenticatedError extends Exception {
    public int statusCode = 403;

    public NotAuthenticatedError() {
        super("Not Authorized");
    }
}
