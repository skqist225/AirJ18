package com.airtnt.airtntapp.stripe;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;

@RestController
@RequestMapping("/api")
public class StripePaymentRestController {

    @Value("${stripe.apikey}")
    private String stripeKey;

    @PostMapping("/createCustomer")
    public CustomerData index(@RequestBody CustomerData data) throws StripeException {
        Stripe.apiKey = stripeKey;

        Map<String, Object> params = new HashMap<>();
        params.put("name", data.getName());
        params.put("email", data.getEmail());

        Customer customer = Customer.create(params);
        data.setCustomerId(customer.getId());
        return data;
    }

    @PostMapping("/create-payment-intent")
    public CreatePaymentResponse createPaymentIntent(@RequestBody CreatePayment createPayment) throws StripeException {
        Stripe.apiKey = stripeKey;

        PaymentIntentCreateParams createParams = new PaymentIntentCreateParams.Builder().setCurrency(
                createPayment.getCurrency().toLowerCase())
                .setAmount(createPayment.getPrice()).build();

        PaymentIntent intent = PaymentIntent.create(createParams);
        CreatePaymentResponse paymentResponse = new CreatePaymentResponse(intent.getClientSecret());

        return paymentResponse;
    }
}
