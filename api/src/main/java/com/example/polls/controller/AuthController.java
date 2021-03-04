package com.example.polls.controller;

import java.net.URI;
import java.util.Collections;
import java.util.Optional;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.example.polls.exception.AppException;
import com.example.polls.model.ConfirmationToken;
import com.example.polls.model.Role;
import com.example.polls.model.RoleName;
import com.example.polls.model.User;
import com.example.polls.payload.ApiResponse;
import com.example.polls.payload.JwtAuthenticationResponse;
import com.example.polls.payload.LoginRequest;
import com.example.polls.payload.SignUpRequest;
import com.example.polls.repository.ConfirmationTokenRepository;
import com.example.polls.repository.RoleRepository;
import com.example.polls.repository.UserRepository;
import com.example.polls.security.JwtTokenProvider;
import com.example.polls.service.EmailSenderService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
	
	String passwordBeforeEncrypted;
	
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    ConfirmationTokenRepository confirmationTokenRepository;
    
    @Autowired
    EmailSenderService emailSenderService;
    
    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    JwtTokenProvider tokenProvider;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) { 
    	
    	 System.out.println("authenticateUser --------------"+loginRequest.toString());
    	 
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsernameOrEmail(),
                        loginRequest.getPassword()
                )
        );
        
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = tokenProvider.generateToken(authentication);
        
        return ResponseEntity.ok(new JwtAuthenticationResponse(jwt));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody User user) {
        if(userRepository.existsByUsername(user.getUsername())) {
            return new ResponseEntity(new ApiResponse(false, "Username is already taken!"),
                    HttpStatus.BAD_REQUEST);
        }

        if(userRepository.existsByEmail(user.getEmail())) {
            return new ResponseEntity(new ApiResponse(false, "Email Address already in use!"),
                    HttpStatus.BAD_REQUEST);
        }

        passwordBeforeEncrypted = user.getPassword();
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        user.setRole("user");
        
        User result = userRepository.save(user);
        
        ConfirmationToken confirmationToken = new ConfirmationToken(user);

        confirmationTokenRepository.save(confirmationToken);

        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(user.getEmail());
        mailMessage.setSubject("Complete Registration!");
        mailMessage.setFrom("dangullings@gmail.com");
        mailMessage.setText("To complete your registration, please click here: "
        +"http://localhost:8080/api/auth/confirm-account?token="+confirmationToken.getConfirmationToken());

        emailSenderService.sendEmail(mailMessage);
        
        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath().path("/api/users/{username}")
                .buildAndExpand(result.getUsername()).toUri();

        return ResponseEntity.created(location).body(new ApiResponse(true, "User registered successfully"));
    }
	
    @RequestMapping("/confirm-account")
	public ResponseEntity<?> confirmUserAccount(@RequestParam("token") String confirmationToken){
	  
	  ConfirmationToken token =confirmationTokenRepository.findByConfirmationToken(confirmationToken);
	  
	  if (token != null) {
		  	Optional<User> optUser = userRepository.findByUsernameOrEmail(token.getUser().getUsername(), token.getUser().getEmail()); 
		  	User user = optUser.get();
		  	user.setEnabled(true); userRepository.save(user); 
		  	
		  	SimpleMailMessage mailMessage = new SimpleMailMessage();
	        mailMessage.setTo(user.getEmail());
	        mailMessage.setSubject("Registration Complete!");
	        mailMessage.setFrom("dangullings@gmail.com");
	        mailMessage.setText("Thank you for confirming your email and completing registration, "+user.getName()+"!\n\nUsername: "+user.getUsername()+"\n\nPassword: "+passwordBeforeEncrypted+"\n\nKeep this info for your records.");

	        emailSenderService.sendEmail(mailMessage);
	     
		}else{
		}
	  
	  	HttpHeaders headers = new HttpHeaders();
	    headers.add("Location", "http://localhost:3000/login");    
	    return new ResponseEntity("You can now login. Please close out this window. Check your email for login credentials.", HttpStatus.OK);	
    }
	 
     
}