package com.airtnt.airtntapp.room.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CalendarResponseEntity {
    private String daysInMonth;
    private int startInWeek;
}
