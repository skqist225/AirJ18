package com.airtnt.airtntapp.room.dto;

import java.util.List;
import java.util.Set;

import com.airtnt.airtntapp.amentity.dto.AmenityRoomDetailsDTO;
import com.airtnt.airtntapp.booking.BookedDateDTO;
import com.airtnt.airtntapp.review.dto.ReviewDTO;
import com.airtnt.entity.Rule;

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
public class RoomDetailsDTO {
    private int bed;
    private List<AmenityRoomDetailsDTO> amenities;
    private List<String> images;
    private String thumbnail;
    private float latitude;
    private String description;
    private String privacy;
    private List<BookedDateDTO> bookedDates;
    private float averageRating;
    private Set<Rule> rules;
    private int bedroom;
    private String stayType;
    private List<ReviewDTO> reviews;
    private float price;
    private String name;
    private HostDTO host;
    private String location;
    private int guest;
    private String currencySymbol;
    private String currencyUnit;
    private Integer id;
    private int bathroom;
    private float longitude;
    private String cityName;
    private String category;
}
