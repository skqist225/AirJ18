package com.airtnt.airtntapp.room.dto;

import java.util.List;

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
public class RoomHomePageDTO {
    private String thumbnail;
    private List<String> images;
    private List<Integer> likedByUsers;
    private float price;
    private String name;
    private String currencySymbol;
    private Integer id;
    private String stayType;
}
