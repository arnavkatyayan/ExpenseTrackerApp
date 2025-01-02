package com.example.ExpenseTracker.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.ExpenseTracker.Entity.SignupEntity;
import com.example.ExpenseTracker.Request.SignUpRequest;
import com.example.ExpenseTracker.Services.SignUpService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*", allowCredentials = "true")
@RestController
@RequestMapping("/api-signup")
public class SignUp {

    @Autowired
    SignUpService signupservice;
    
    private static final Logger logger = LoggerFactory.getLogger(SignUp.class);

    @PostMapping("/signup")
    public SignupEntity signUp(@RequestBody SignUpRequest signupRequest) {
        return signupservice.saveUser(signupRequest);
    }
    
    @PostMapping("/signup/check")
    public ResponseEntity<String> checkAvailability(@RequestParam String type, @RequestParam String value) {
        if ("username".equals(type)) {
            Boolean userExists = signupservice.isUserPresentInDB(value);
            if (userExists) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("User already exists");
            } else {
                return ResponseEntity.status(HttpStatus.OK).body("User is available");
            }
        } else if ("email".equals(type)) {
            Boolean isEmailPresent = signupservice.IsEmailPresent(value);
            if (isEmailPresent) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Email taken");
            } else {
                return ResponseEntity.status(HttpStatus.OK).body("Email is available");
            }
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid type");
    }

}
