package com.airtnt.airtntapp.sms;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class VerifyOTPController {

    @PostMapping("/otp")
    public String verifyOTP(@RequestBody TempOTP sms) {
        if (sms.getOtp() == StoreOTP.getOtp()) {
            return "Correct OTP";
        }

        return "Incorrect OTP";
    }
}
