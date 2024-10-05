package com.example.ExpenseTracker.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.ExpenseTracker.Services.ForgetPasswordService;

@CrossOrigin(origins = "http://localhost:3000")
@RestController	
@RequestMapping("/api-forget-password")

public class ForgetPassword {
	
	@Autowired
	ForgetPasswordService forgetpasswordservice;
	
	@PostMapping("/isMailPresent/{email}")
	public ResponseEntity<String> isMailPresent(@PathVariable String email) {
	
	Boolean isPresent = forgetpasswordservice.isMailPresent(email);
	if(isPresent) {
		return ResponseEntity.status(HttpStatus.OK).body("Email is available");
	}
	else {
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Email is not available");
	}
	
}
	@PostMapping("forgetPassword/{email}")
	public ResponseEntity<String> forgetPassword(@PathVariable String email) {
		
		forgetpasswordservice.forgetPassword(email);
		return ResponseEntity.status(HttpStatus.OK).body("Email Sent");
	}

}
