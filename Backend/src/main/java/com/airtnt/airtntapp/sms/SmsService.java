package com.airtnt.airtntapp.sms;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.text.ParseException;
import org.springframework.util.MultiValueMap;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;

@Component
public class SmsService {

    @Value("${twilio.ACCOUNT_SID}")
    private String ACCOUNT_SID;

    @Value("${twilio.AUTH_TOKEN}")
    private String AUTH_TOKEN;

    @Value("${twilio.FROM_NUMBER}")
    private String FROM_NUMBER;

    public void send(SmsPojo sms) throws ParseException {
        Twilio.init(ACCOUNT_SID, AUTH_TOKEN);

        int min = 100000;
        int max = 999999;
        int number = (int) (Math.random() * (max - min + 1) + min);

        String msg = "Your OTP - " + number + " please verify this OTP in order to complete the rental process.";

        Message.creator(new PhoneNumber(sms.getPhoneNumber()), new PhoneNumber(FROM_NUMBER), msg)
                .create();
        StoreOTP.setOtp(number);
    }

    public void receive(MultiValueMap<String, String> smscallback) {

    }
}
