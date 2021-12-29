package com.airtnt.airtntapp.booking;

public class BookedDate {
    private String checkinDate;
    private String checkoutDate;

    public BookedDate(String checkinDate, String checkoutDate) {
        this.checkinDate = checkinDate;
        this.checkoutDate = checkoutDate;
    }

    public String getCheckinDate() {
        return checkinDate;
    }

    public void setCheckinDate(String checkinDate) {
        this.checkinDate = checkinDate;
    }

    public String getCheckoutDate() {
        return checkoutDate;
    }

    public void setCheckoutDate(String checkoutDate) {
        this.checkoutDate = checkoutDate;
    }

}
