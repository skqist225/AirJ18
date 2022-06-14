package com.airtnt.airtntapp.room.dto.page.listings;

import java.io.Serializable;
import java.util.Date;
import com.airtnt.entity.Room;

import com.airtnt.entity.PriceType;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;

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
public class RoomListingsDTO implements Serializable {
    private Integer id;
    private String name;
    private String thumbnail;
    private String currency;
    private String category;
    private PriceType priceType;
    private String location;
    private float price;
    private int bedroomCount;
    private int bathroomCount;
    private int bedCount;
    private boolean status;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date createdDate;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date updatedDate;

    @JsonIgnore
    public static RoomListingsDTO buildRoomListingsDTO(Room r) {
        return RoomListingsDTO.builder()
                .id(r.getId())
                .name(r.getName())
                .thumbnail(r.renderThumbnailImage())
                .currency(r.getCurrency().getSymbol())
                .category(r.getCategory().getName())
                .price(r.getPrice())
                .priceType(r.getPriceType())
                .bedCount(r.getBedCount())
                .bedroomCount(r.getBedroomCount())
                .bathroomCount(r.getBathroomCount())
                .status(r.isStatus())
                .createdDate(r.getCreatedDate())
                .updatedDate(r.getUpdatedDate())
                .location(r.getStreet() + " " + r.getCity().getName() + " " + r.getState().getName() + " "
                        + r.getCountry().getName())
                .build();
    }
}
