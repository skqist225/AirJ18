package com.airtnt.airtntapp.room.dto;

import java.util.Date;

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
public class HostDTO {
    private String name;
    private String avatar;
    private Integer id;

    @JsonFormat(pattern = "dd-MM-yyyy")
    private Date createdDate;
}
