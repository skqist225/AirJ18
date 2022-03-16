package com.airtnt.airtntapp.booking.dto;

import java.util.Date;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BookingListDTO {
    private Integer bookingId;
    private Integer roomId;
    private String roomName;
    private String roomThumbnail;
    private String roomCurrency;

    private boolean isComplete;
    private boolean isRefund;

    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDateTime bookingDate;

    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDateTime cancelDate;

    @JsonFormat(pattern = "dd-MM-yyyy")
    private Date checkinDate;

    @JsonFormat(pattern = "dd-MM-yyyy")
    private Date checkoutDate;

    private float pricePerDay;
    private int numberOfDays;
    private float siteFee;
    private float refundPaid;

    private String customerName;
    private String customerAvatar;
}
