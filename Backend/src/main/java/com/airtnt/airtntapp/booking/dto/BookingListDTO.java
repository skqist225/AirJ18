package com.airtnt.airtntapp.booking.dto;

import java.util.Date;
import java.io.Serializable;
import java.time.LocalDateTime;

import com.airtnt.entity.Booking;
import com.airtnt.entity.Room;
import com.airtnt.entity.User;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.google.auto.value.AutoValue.Builder;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class BookingListDTO implements Serializable {
    private Integer bookingId;
    private Integer roomId;
    private String roomName;
    private String roomThumbnail;
    private String roomCurrency;

    private boolean isComplete;
    private boolean isRefund;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDateTime bookingDate;

    @JsonInclude(value = Include.NON_NULL)
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDateTime cancelDate;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date checkinDate;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date checkoutDate;

    private float pricePerDay;
    private int numberOfDays;
    private float siteFee;
    private float refundPaid;

    private String customerName;
    private String customerAvatar;

    public static BookingListDTO buildDTO(Booking b) {
        Room room = b.getRoom();
        User customer = b.getCustomer();

        return new BookingListDTO(b.getId(),
                room.getId(), room.getName(),
                room.renderThumbnailImage(),
                room.getCurrency().getSymbol(),
                b.isComplete(), b.isRefund(),
                b.getBookingDate(), b.getCancelDate(), b.getCheckinDate(),
                b.getCheckoutDate(),
                b.getPricePerDay(), b.getNumberOfDays(), b.getSiteFee(), b.getRefundPaid(),
                customer.getFullName(),
                customer.getAvatarPath());
    }
}
