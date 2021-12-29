package com.airtnt.airtntapp.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class RatingDTO {
    private String label;
    private Integer[] stars;
}
