package com.airtnt.airtntapp.webflux;

import java.time.Duration;
import java.util.Collection;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import com.airtnt.airtntapp.booking.dto.BookingDTO;

import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import reactor.core.publisher.Flux;

import org.springframework.http.codec.ServerSentEvent;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
public class BookingsRestController {
    private static Map<Integer, BookingDTO> bookingsDatabase = new ConcurrentHashMap<>();

    @PutMapping("/bookings")
    public void updateBookings(@RequestBody List<BookingDTO> bookings) {
        bookings.forEach(booking -> {
            bookingsDatabase.put(booking.getId(), booking);
            booking.setLastUpdated(System.currentTimeMillis());
        });
    }

    private List<BookingDTO> getUpdatedBookings() {
        LinkedList<BookingDTO> updatedBookings = new LinkedList<>();
        bookingsDatabase.values().stream()
                .filter(booking -> booking.getLastUpdated() > System.currentTimeMillis() - 1000)
                .forEach(booking -> updatedBookings.add(booking));
        return updatedBookings;
    }

    @GetMapping(value = "bookings", produces = org.springframework.http.MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<ServerSentEvent<Collection<BookingDTO>>> liveBookingsChange() {
        return Flux.interval(Duration.ofSeconds(1))
                .map(tick -> tick == 0 ? bookingsDatabase.values() : getUpdatedBookings())
                .map(bookings -> ServerSentEvent.<Collection<BookingDTO>>builder()
                        .event("booking-added").data(bookings).build());
    }

}
