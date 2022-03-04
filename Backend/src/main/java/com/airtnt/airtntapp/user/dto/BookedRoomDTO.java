package com.airtnt.airtntapp.user.dto;

import java.time.LocalDateTime;
import java.util.Date;

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
    private String hostName;
    private String hostAvatar;
    private String roomThumbnail;
    private String roomName;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDateTime bookingDate;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date checkinDate;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date checkoutDate;
    private float pricePerDay;
    private int numberOfDays;
    private float siteFee;
    private boolean isComplete;
    private boolean isRefund;
    private String currency;
}
