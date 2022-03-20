package com.airtnt.airtntapp.room.dto;

import java.beans.Transient;
import java.util.List;

import com.airtnt.entity.PriceType;
import com.airtnt.entity.Room;
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
public class RoomHomePageDTO {
    private String thumbnail;
    private List<String> images;
    private List<Integer> likedByUsers;
    private float price;
    private String name;
    private String currencySymbol;
    private Integer id;
    private String stayType;

    @Transient
    @JsonIgnore
    public static RoomHomePageDTO buildRoomHomePageDTO(Room room, List<String> images, List<Integer> likedByUsers) {
        return RoomHomePageDTO.builder()
                .name(room.getName())
                .thumbnail(room.renderThumbnailImage())
                .images(images)
                .price(room.getPrice())
                .currencySymbol(room.getCurrency().getSymbol())
                .stayType(room.getPriceType() == (PriceType.PER_NIGHT) ? "đêm" : "tuần")
                .likedByUsers(likedByUsers)
                .id(room.getId())
                .build();
    }
}
