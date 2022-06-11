package com.airtnt.airtntapp.sms;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.airtnt.airtntapp.response.StandardJSONResponse;
import com.airtnt.airtntapp.response.error.BadResponse;
import com.airtnt.airtntapp.response.success.OkResponse;

@RestController
public class VerifyOTPController {

    @PostMapping("/api/verify-otp")
    public ResponseEntity<StandardJSONResponse<String>> verifyOTP(@RequestBody TempOTP sms) {
        if (sms.getOtp() == StoreOTP.getOtp()) {
            return new OkResponse<String>("Correct OTP").response();
        }

        return new BadResponse<String>("Incorrect OTP").response();
    }
}
