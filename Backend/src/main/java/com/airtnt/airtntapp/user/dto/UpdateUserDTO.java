package com.airtnt.airtntapp.user.dto;

import java.util.Map;

import com.airtnt.entity.Sex;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UpdateUserDTO {
    private String firstName;
    private String lastName;
    private String gender;
    private String birthday;
}
