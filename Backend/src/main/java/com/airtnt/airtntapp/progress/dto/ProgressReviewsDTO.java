package com.airtnt.airtntapp.progress.dto;

import java.util.List;

import com.airtnt.airtntapp.review.dto.ReviewDTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProgressReviewsDTO {
    private List<ReviewDTO> reviews;
    private float finalRatings;
}
