package com.example.ExpenseTracker.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.ExpenseTracker.Entity.SignupEntity;
import com.example.ExpenseTracker.Request.SignUpRequest;
import com.example.ExpenseTracker.Services.SignUpService;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api-signup")
public class SignUp {

    @Autowired
    SignUpService signupservice;

    @PostMapping("/signup")
    public SignupEntity signUp(@RequestBody SignUpRequest signupRequest) {
        return signupservice.saveUser(signupRequest);
    }
}
