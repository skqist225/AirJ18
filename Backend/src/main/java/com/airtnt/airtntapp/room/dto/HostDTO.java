package com.airtnt.airtntapp.room.dto;

import java.beans.Transient;
import java.util.Date;

import com.airtnt.entity.Room;
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
public class HostDTO {
    private String name;
    private String avatar;
    private Integer id;

    @JsonFormat(pattern = "dd-MM-yyyy")
    private Date createdDate;

    @Transient
    @JsonIgnore
    public static HostDTO buildHostDTO(Room room) {
        return HostDTO.builder()
                .name(room.getHost().getFullName())
                .avatar(room.getHost().getAvatarPath())
                .createdDate(room.getHost().getCreatedDate())
                .build();
    }
}
