package com.airtnt.airtntapp.room.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RoomPricePerCurrencyDTO {
    private double totalPricePerNight;
    private String unit;
    private long totalRecords;
}
