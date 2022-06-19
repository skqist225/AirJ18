package com.airtnt.airtntapp.user.dto;

import java.time.LocalDateTime;
import java.util.Date;

import com.airtnt.entity.Booking;
import com.airtnt.entity.PriceType;
import com.airtnt.entity.SubRating;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.google.auto.value.AutoValue.Builder;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BookedRoomDTO {
    private Integer bookingId;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDateTime bookingDate;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date checkinDate;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date checkoutDate;

    private float pricePerDay;
    private int numberOfDays;
    private float siteFee;
    private boolean isComplete;
    private boolean isRefund;

    private Integer roomId;
    private String roomThumbnail;
    private String roomName;
    private String hostName;
    private String hostAvatar;
    private String currency;
    private String privacyType;
    private String roomCategory;
    private PriceType priceType;

    private String bookingReview;
    private SubRating reviewRating;

    public static BookedRoomDTO buildBookedRoomDTO(Booking b) {
        String roomThumbnail = "/room_images/" + b.getRoom().getHost().getEmail() + "/" + b.getRoom().getId() + "/"
                + b.getRoom().getThumbnail();
        String userFullName = b.getRoom().getHost().getFirstName() + " " + b.getRoom().getHost().getLastName();
        String userAvatar = "/user_images/" + b.getRoom().getHost().getId() + "/" + b.getRoom().getHost().getAvatar();
        String bookingReview = null;
        SubRating reviewRating = null;

        if (b.getReview() != null) {
            bookingReview = b.getReview().getComment();
            reviewRating = b.getReview().getSubRating();
        }

        return new BookedRoomDTO(b.getId(), b.getBookingDate(), b.getCheckinDate(), b.getCheckoutDate(),
                b.getPricePerDay(), b.getNumberOfDays(),
                b.getSiteFee(), b.isComplete(), b.isRefund(), b.getRoom().getId(), roomThumbnail, b.getRoom().getName(),
                userFullName,
                userAvatar, b.getRoom().getCurrency().getSymbol(), b.getRoom().getPrivacyType().getName(),
                b.getRoom().getCategory().getName(), b.getRoom().getPriceType(),
                bookingReview, reviewRating);
    }
}
