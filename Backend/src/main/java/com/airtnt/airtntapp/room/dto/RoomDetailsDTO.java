package com.airtnt.airtntapp.room.dto;

import java.beans.Transient;
import java.util.List;
import java.util.Set;

import com.airtnt.airtntapp.amentity.dto.AmenityRoomDetailsDTO;
import com.airtnt.airtntapp.booking.BookedDateDTO;
import com.airtnt.airtntapp.review.dto.ReviewDTO;
import com.airtnt.entity.PriceType;
import com.airtnt.entity.Room;
import com.airtnt.entity.Rule;
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
        private int accomodates;
        private float longitude;
        private String cityName;
        private String category;
        private boolean isLikedByCurrentUser;
        private boolean status;
        private Integer groupId;
        private String groupName;
        private Integer categoryId;
        private Integer privacyId;
        private String stateName;
        private String countryName;
        private String streetName;

        @Transient
        @JsonIgnore
        public static RoomDetailsDTO buildRoomDetailsDTO(Room room, List<ReviewDTO> reviewDTOs, List<String> images,
                        List<AmenityRoomDetailsDTO> amenityRoomDetailsDTOs, HostDTO hostDTO,
                        List<BookedDateDTO> bookedDates,
                        float avgRatings) {
                return RoomDetailsDTO.builder()
                                .thumbnail(room.renderThumbnailImage())
                                .amenities(
                                                amenityRoomDetailsDTOs)
                                .rules(room.getRules())
                                .images(images)
                                .reviews(reviewDTOs)
                                .id(room.getId())
                                .name(room.getName())
                                .description(room.getDescription())
                                .location(room.getStreet() + " " + room.getCity().getName() + " "
                                                + room.getState().getName() + " "
                                                + room.getCountry().getName())
                                .privacy(room.getPrivacyType().getName()).guest(room.getAccomodatesCount())
                                .host(hostDTO)
                                .bed(room.getBedCount())
                                .bathroom(room.getBathroomCount())
                                .bedroom(room.getBedroomCount())
                                .price(room.getPrice())
                                .currencySymbol(room.getCurrency().getSymbol())
                                .currencyUnit(room.getCurrency().getUnit())
                                .stayType(room.getPriceType() == (PriceType.PER_NIGHT) ? "đêm" : "tuần")
                                .longitude(room.getLongitude())
                                .latitude(room.getLatitude())
                                .averageRating(avgRatings)
                                .bookedDates(
                                                bookedDates)
                                .cityName(room.getCity().getName())
                                .category(room.getCategory().getName())
                                .isLikedByCurrentUser(room.getHost().getFavRooms().contains(room))
                                .status(room.isStatus())
                                .accomodates(room.getAccomodatesCount())
                                .groupId(room.getRoomGroup().getId())
                                .categoryId(room.getCategory().getId())
                                .privacyId(room.getPrivacyType().getId())
                                .stateName(room.getState().getName())
                                .countryName(room.getCountry().getName())
                                .streetName(room.getStreet())
                                .groupName(room.getRoomGroup().getName())
                                .build();
        }
}
