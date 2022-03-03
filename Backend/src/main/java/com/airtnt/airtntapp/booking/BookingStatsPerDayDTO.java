package com.airtnt.airtntapp.booking;

import java.time.LocalDateTime;

public interface BookingStatsPerDayDTO {
    LocalDateTime getDate();
    Float getRevenue();
    
}
