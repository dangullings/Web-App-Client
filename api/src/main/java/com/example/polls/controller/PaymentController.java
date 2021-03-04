package com.example.polls.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.polls.service.StripeService;
import com.stripe.net.ApiResource.RequestMethod;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {
	
	@Autowired
	private StripeService stripeService;
	
    // Reading the value from the application.properties file
    @Value("pk_test_51IN7guArn0UDnj9cCz5y2A4HG4urpmgO5h5BxCwN8dZc4eKVyvMRxbkhE789EJf1aiGAN66oyy788yyZ4Npl26Lt00kNVqkViL")
    private String stripePublicKey;

    @RequestMapping("/")
    public String home(Model model) {
        model.addAttribute("amount", 50 * 100); // In cents
        model.addAttribute("stripePublicKey", stripePublicKey);
        return "index";
    }
    
    @RequestMapping("/charge")
    public String chargeCard(HttpServletRequest request) throws Exception {
        String token = request.getParameter("stripeToken");
        Double amount = Double.parseDouble(request.getParameter("amount"));
        stripeService.chargeNewCard(token, amount);
        return "result";
    }
}