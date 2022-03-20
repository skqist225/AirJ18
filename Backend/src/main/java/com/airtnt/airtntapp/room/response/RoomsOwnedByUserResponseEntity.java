package com.airtnt.airtntapp.room.response;

import com.airtnt.airtntapp.room.dto.page.listings.RoomListingsDTO;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RoomsOwnedByUserResponseEntity {
    private List<RoomListingsDTO> rooms;
    private long totalRecords;
    private int totalPages;
}
