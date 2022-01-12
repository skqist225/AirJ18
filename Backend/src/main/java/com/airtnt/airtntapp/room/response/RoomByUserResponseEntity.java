package com.airtnt.airtntapp.room.response;

import java.util.List;

import com.airtnt.airtntapp.response.CommonResponse;
import com.airtnt.airtntapp.room.dto.page.listings.RoomListingsDTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RoomByUserResponseEntity extends CommonResponse {
    private List<RoomListingsDTO> rooms;
}
