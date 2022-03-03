package com.airtnt.airtntapp.room.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PostAddRoomDTO {
    private String name;
    private String[] images;
    private int[] amentities;
    private int country;
    private String state;
    private String city;
    private int bedroomCount;
    private int bathroomCount;
    private int accomodatesCount;
    private int bedCount;
    private int currency;
    private int category;
    private int roomGroup;
    private String description;
    private float latitude;
    private float longitude;
    private int price;
    private String priceType;
    private int host;
    private int privacyType;
    private String street;
}
