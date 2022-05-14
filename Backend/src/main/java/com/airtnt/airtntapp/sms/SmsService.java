package com.airtnt.airtntapp.sms;

import org.springframework.stereotype.Component;
import java.text.ParseException;
import org.springframework.util.MultiValueMap;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;

@Component
public class SmsService {
    public void send(SmsPojo sms) throws ParseException {
        String ACCOUNT_SID = "ACdf352795004034acae2b8dd793bddf6b";
        String AUTH_TOKEN2 = "8553ee9bb8b2d3daab44e9de9c39ed45";
        Twilio.init(ACCOUNT_SID, AUTH_TOKEN2);

        int min = 100000;
        int max = 999999;
        int number = (int) (Math.random() * (max - min + 1) + min);

        String msg = "Your OTP number is: " + number;
        Message
                .creator(new com.twilio.type.PhoneNumber(
                        sms.getPhoneNumber()), "MGb473ce8dd8a56550609192ba3c51c6f4", msg)
                .create();

        StoreOTP.setOtp(number);
    }

    public void receive(MultiValueMap<String, String> smscallback) {

    }
}
