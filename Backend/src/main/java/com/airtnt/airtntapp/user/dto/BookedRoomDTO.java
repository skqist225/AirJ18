package com.airtnt.airtntapp.user.dto;

import java.time.LocalDateTime;
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
public class BookedRoomDTO {
    private Integer roomId;
    private Integer bookingId;
    private String hostName;
    private String hostAvatar;
    private String roomThumbnail;
    private String roomName;
    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDateTime bookingDate;
    @JsonFormat(pattern = "dd-MM-yyyy")
    private Date checkinDate;
    @JsonFormat(pattern = "dd-MM-yyyy")
    private Date checkoutDate;
    private float pricePerDay;
    private int numberOfDays;
    private float siteFee;
    private boolean isComplete;
    private boolean isRefund;
    private String currency;
    private String privacyType;
    private String roomCategory;
    private PriceType priceType;
    private String bookingReview;
}
