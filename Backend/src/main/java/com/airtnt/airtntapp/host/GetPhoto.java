package com.airtnt.airtntapp.host;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
class GetPhoto {
    private String username;
    private String folderno;
    private String[] roomImages;
}