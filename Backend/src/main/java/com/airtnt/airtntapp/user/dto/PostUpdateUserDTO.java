package com.airtnt.airtntapp.user.dto;

import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PostUpdateUserDTO {
    private String updatedField;
    private Map<String, String> updateData;
}
