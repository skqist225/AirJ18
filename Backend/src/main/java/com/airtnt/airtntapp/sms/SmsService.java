package com.airtnt.airtntapp.sms;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.text.ParseException;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;

@Component
public class SmsService {
    public static final String ACCOUNT_SID = "AC126d52b0da0da1f6b3aee5240a9c9d41";

    @Value("${twilio.AUTH_TOKEN}")
    public String AUTH_TOKEN;

    public void send(String phoneNumber) throws ParseException {
        Twilio.init(ACCOUNT_SID, AUTH_TOKEN);

        int min = 100000;
        int max = 999999;
        int number = (int) (Math.random() * (max - min + 1) + min);
        String msg = "Your OTP number is: " + number;
        Message message = Message
                .creator(new com.twilio.type.PhoneNumber(
                        phoneNumber), "MGde72225e1b06b7c7f858337c89e1cf29", msg)
                .create();

        StoreOTP.setOtp(number);
        System.out.println(message.getSid());
    }
}
