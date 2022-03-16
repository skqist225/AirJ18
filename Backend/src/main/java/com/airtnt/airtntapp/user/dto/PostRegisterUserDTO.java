package com.airtnt.airtntapp.user.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class PostRegisterUserDTO {
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String email;
    private String password;
    private String sex;
    private LocalDate birthday;
}
