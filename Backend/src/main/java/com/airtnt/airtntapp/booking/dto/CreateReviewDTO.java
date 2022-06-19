package com.airtnt.airtntapp.booking.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateReviewDTO {
    private Integer cleanlinessRating;
    private Integer contactRating;
    private Integer checkinRating;
    private Integer accuracyRating;
    private Integer locationRating;
    private Integer valueRating;
    private String ratingComment;
}
