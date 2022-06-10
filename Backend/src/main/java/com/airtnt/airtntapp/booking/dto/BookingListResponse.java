package com.airtnt.airtntapp.booking.dto;

import java.util.List;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class BookingListResponse {
    public List<BookingListDTO> content;
    public long totalElements;
    public int totalPages;
}
