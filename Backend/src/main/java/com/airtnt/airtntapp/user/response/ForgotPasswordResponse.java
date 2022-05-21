package com.airtnt.airtntapp.user.response;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class ForgotPasswordResponse {
    public int resetPasswordCode;
    public String message;
    public String email;
}
