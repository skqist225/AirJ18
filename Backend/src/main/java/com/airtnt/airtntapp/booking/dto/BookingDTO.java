package com.airtnt.airtntapp.booking.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class BookingDTO {
    private Integer id;
    private LocalDateTime bookingDate;
    private String currencySymbol;
    private float totalFee;
    private long lastUpdated;
}
