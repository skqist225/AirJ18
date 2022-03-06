package com.airtnt.airtntapp.booking.response;

import com.airtnt.airtntapp.booking.dto.BookingListDTO;
import com.airtnt.entity.Booking;

import org.springframework.data.domain.Page;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BookingListsResponseEntity {
    private Page<BookingListDTO> bookings;
}
