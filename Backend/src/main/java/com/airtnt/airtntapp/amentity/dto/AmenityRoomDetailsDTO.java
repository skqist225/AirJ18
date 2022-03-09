package com.airtnt.airtntapp.amentity.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AmenityRoomDetailsDTO {
    private Integer id;
    private String icon;
    private String name;
}
