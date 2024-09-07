package com.example.ExpenseTracker.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.ExpenseTracker.Request.LoginRequest;
import com.example.ExpenseTracker.Services.LoginPageService;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api-login")
public class LoginPage {
	
	@Autowired
	LoginPageService loginpageservice;
	
	 @PostMapping("/login")
	    public ResponseEntity<String> login(@RequestBody LoginRequest loginRequest) {
	        // Validate loginRequest.username and loginRequest.password
		 
		 	Boolean check = loginpageservice.isCredentialsCorrect(loginRequest.getUsername(), loginRequest.getPassword());
	        
		 	if (check) {
	            return ResponseEntity.ok("Login successful");
	        } else {
	            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
	        }
	    }
}
