package com.airtnt.airtntapp.review.dto;

import java.beans.Transient;
import java.util.Date;

import com.airtnt.entity.Review;
import com.airtnt.entity.SubRating;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReviewDTO {
    private Integer id;
    private String customerAvatar;
    private SubRating rating;
    private String comment;
    private String customerName;

    @JsonFormat(pattern = "dd/MM/yyyy")
    private Date createdAt;

    @Transient
    @JsonIgnore
    public static ReviewDTO buildReviewDTO(Review review) {
        return ReviewDTO.builder()
                .comment(review.getComment())
                .customerName(review.getBooking().getCustomer().getFullName())
                .customerAvatar(review.getBooking().getCustomer().getAvatarPath())
                .rating(review.getSubRating())
                .createdAt(review.getCreatedDate())
                .build();
    }
}
