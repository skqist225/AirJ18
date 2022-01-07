package com.airtnt.airtntapp.user.response;

import com.airtnt.entity.User;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserResponseEntity {
    private String errorMessage;
    private String successMessage;
    private User user;
}