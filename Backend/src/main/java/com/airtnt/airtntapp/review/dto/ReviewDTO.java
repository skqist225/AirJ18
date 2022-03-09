package com.airtnt.airtntapp.review.dto;

import java.util.Date;

import com.airtnt.entity.SubRating;
import com.fasterxml.jackson.annotation.JsonFormat;

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
    private String customerAvatar;
    private SubRating rating;
    private String comment;
    private String customerName;

    @JsonFormat(pattern = "dd/MM/yyyy")
    private Date createdAt;
}
