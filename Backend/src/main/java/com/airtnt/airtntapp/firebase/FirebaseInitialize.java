package com.airtnt.airtntapp.firebase;

import java.io.FileInputStream;

import org.springframework.stereotype.Service;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;

@Service
public class FirebaseInitialize {
    private static DatabaseReference database = null;
    private static FirebaseApp firebaseInstance = null;

    public void initialize() {
        try {
            FileInputStream serviceAccount = new FileInputStream("serviceAccountKey.json");

            FirebaseOptions options = new FirebaseOptions.Builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .setDatabaseUrl("https://airj18-65bd5-default-rtdb.asia-southeast1.firebasedatabase.app")
                    .build();
            if (firebaseInstance == null)
                firebaseInstance = FirebaseApp.initializeApp(options);
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
