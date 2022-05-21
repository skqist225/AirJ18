package com.airtnt.airtntapp.booking.dto;

import java.time.LocalDateTime;

import com.airtnt.entity.Booking;
import com.fasterxml.jackson.annotation.JsonFormat;

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
public class BookingDTO {
    private Integer id;
    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDateTime bookingDate;
    private String currencySymbol;
    private float totalFee;
    private long lastUpdated;
    private String userToken;

    public static BookingDTO buildBookingDTO(Booking booking) {
        return new BookingDTO(booking.getId(), booking.getBookingDate(),
                booking.getRoom().getCurrency().getSymbol(), booking.getTotalFee(), 0, booking.getUserToken());
    }
}
