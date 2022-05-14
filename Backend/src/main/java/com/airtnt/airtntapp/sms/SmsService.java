package com.airtnt.airtntapp.sms;

import org.springframework.stereotype.Component;
import java.text.ParseException;
import org.springframework.util.MultiValueMap;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;

@Component
public class SmsService {
    public static final String ACCOUNT_SID = "ACdf352795004034acae2b8dd793bddf6b";
    public static final String AUTH_TOKEN2 = "54ea8c9c68601193c889ce1cf1a5254c";

    public void send(String phoneNumber) throws ParseException {
        Twilio.init(ACCOUNT_SID, AUTH_TOKEN2);

        int min = 100000;
        int max = 999999;
        int number = (int) (Math.random() * (max - min + 1) + min);
        System.out.println(phoneNumber);
        String msg = "Your OTP number is: " + number;
        Message message = Message
                .creator(new com.twilio.type.PhoneNumber(
                        phoneNumber), "MGb473ce8dd8a56550609192ba3c51c6f4", msg)
                .create();

        StoreOTP.setOtp(number);
        System.out.println(message.getSid());
    }
}
