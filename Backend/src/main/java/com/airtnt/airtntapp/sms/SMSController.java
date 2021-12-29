package com.airtnt.airtntapp.sms;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.util.MultiValueMap;
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
    @PostMapping("/mobile-number")
    public ResponseEntity<String> smsSubmit(@RequestBody SmsPojo sms) {
        try {
            service.send(sms);
        } catch (Exception e) {
            return new ResponseEntity<String>("Phone number is not correct or exist!",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
        webSocket.convertAndSend(TOPIC_DESTINATION, getTimeStamp() + ": SMS has been sent!: " + sms.getPhoneNumber());
        return new ResponseEntity<String>("Sent successfully!", HttpStatus.OK);
    }

    @PostMapping("/smscallback")
    public void smsCallback(@RequestBody MultiValueMap<String, String> map) {
        service.receive(map);
        webSocket.convertAndSend(TOPIC_DESTINATION,
                getTimeStamp() + ": Twilio has made a callback request! Here are the contents: " + map.toString());
    }

    private String getTimeStamp() {
        return DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss").format(LocalDateTime.now());
    }

}