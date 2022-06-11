package com.airtnt.airtntapp.sms;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import com.airtnt.airtntapp.response.StandardJSONResponse;
import com.airtnt.airtntapp.response.SuccessResponse;
import com.airtnt.airtntapp.response.error.BadResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SMSController {

    @Autowired
    SmsService service;

    @Autowired
    private SimpMessagingTemplate webSocket;

    private final String TOPIC_DESTINATION = "/lesson/sms";

    // You can send SMS in verified Number
    @PostMapping("/api/otp")
    public ResponseEntity<StandardJSONResponse<String>> smsSubmit(@RequestBody PNDTO otp) {
        try {
            service.send(otp.getPhoneNumber());
        } catch (Exception e) {
            return new BadResponse<String>("Phone number is not correct or exist!").response();
        }
        webSocket.convertAndSend(TOPIC_DESTINATION, getTimeStamp() + ": SMS has been sent!: " + otp.getPhoneNumber());
        return new SuccessResponse<String>().setResponse(200, "Sent successfully!").response();
    }

    private String getTimeStamp() {
        return DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss").format(LocalDateTime.now());
    }
}