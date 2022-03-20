package com.airtnt.airtntapp.amentity.dto;

import com.airtnt.entity.Amentity;

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

    public static AmenityRoomDetailsDTO buildAmenityRoomDetailsDTO(Amentity a) {
        return AmenityRoomDetailsDTO.builder()
                .id(a.getId())
                .icon(a.getIconImagePath())
                .name(a.getName())
                .build();
    }
}
