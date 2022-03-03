package com.airtnt.airtntapp.room.dto.page.listings;

import java.util.Date;

import com.airtnt.entity.PriceType;
import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RoomListingsDTO {
    private Integer id;
    private String name;
    private String thumbnail;
    private String currency;
    private String category;
    private float price;
    private PriceType priceType;
    private int bedroomCount;
    private int bathroomCount;
    private int bedCount;

    private boolean status;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date createdDate;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date updatedDate;

    private String location;
}
