package com.airtnt.airtntapp.user.response;

import java.util.List;

import com.airtnt.airtntapp.user.dto.BookedRoomDTO;
import com.airtnt.entity.Booking;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserBookedRoomsResponseEntity {
    private List<BookedRoomDTO> bookedRooms;
}
