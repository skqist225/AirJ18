package com.airtnt.airtntapp.firebase;

import com.google.firebase.database.IgnoreExtraProperties;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@IgnoreExtraProperties
public class BookingFirebase {
    public String userToken;
    public String state;
}
