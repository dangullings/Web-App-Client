package com.example.polls.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.stripe.Stripe;
import com.stripe.model.Charge;

@Service
public class StripeService {

    @Value("pk_test_51IN7guArn0UDnj9cCz5y2A4HG4urpmgO5h5BxCwN8dZc4eKVyvMRxbkhE789EJf1aiGAN66oyy788yyZ4Npl26Lt00kNVqkViL")
    private String API_SECRET_KEY;

    @Autowired
    public StripeService() {
        Stripe.apiKey = API_SECRET_KEY;
    }

    public Charge chargeNewCard(String token, double amount) throws Exception {
        Map<String, Object> chargeParams = new HashMap<String, Object>();
        chargeParams.put("amount", (int)(amount * 100));
        chargeParams.put("currency", "USD");
        chargeParams.put("source", token);
        Charge charge = Charge.create(chargeParams);
        return charge;
    }
}
