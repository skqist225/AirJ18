package com.airtnt.airtntapp.host;

import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PhotoDTO {
    private String host;
    private String roomId;
    private MultipartFile[] photos;

}
