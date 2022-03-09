package com.airtnt.airtntapp.booking;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BookedDateDTO {
    private String checkinDate;
    private String checkoutDate;
}
