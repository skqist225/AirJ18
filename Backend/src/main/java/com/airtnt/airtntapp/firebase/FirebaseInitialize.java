package com.airtnt.airtntapp.firebase;

import java.io.FileInputStream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import com.airtnt.airtntapp.common.GetResource;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;

@Service
public class FirebaseInitialize {
    private static DatabaseReference database = null;

    @Autowired
    private Environment env;

    public void initialize() {
        try {
            FileInputStream serviceAccount;
            String environment = env.getProperty("env");
            if (environment.equals("development")) {
                serviceAccount = new FileInputStream("src/main/resources/static/serviceAccountKey.json");
            } else {
                serviceAccount = new FileInputStream(GetResource.getResourceAsFile("static/serviceAccountKey.json"));
            }

            FirebaseOptions options = new FirebaseOptions.Builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .setDatabaseUrl("https://airj18-65bd5-default-rtdb.asia-southeast1.firebasedatabase.app")
                    .build();
            if (FirebaseApp.getInstance() == null)
                FirebaseApp.initializeApp(options);
        } catch (Exception e) {
            e.printStackTrace();
        }
        if (database == null)
            database = FirebaseDatabase.getInstance().getReference();
    }

    public void writeBooking(int bookingId, String userToken, String state) {
        BookingFirebase bookingFirebase = new BookingFirebase(userToken, state);
        database.child("bookings").child(String.valueOf(bookingId)).setValue(bookingFirebase, null);
    }

    public void updateBookingState(int bookingId, String state) {
        database.child("bookings").child(String.valueOf(bookingId)).child("state").setValue(state, null);
    }
}
