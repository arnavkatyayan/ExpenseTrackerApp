package com.example.ExpenseTracker.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.ExpenseTracker.Entity.SignupEntity;
import com.example.ExpenseTracker.Request.ChangePasswordRequest;
import com.example.ExpenseTracker.Request.SignUpRequest;
import com.example.ExpenseTracker.Services.SignUpService;

import java.util.Map;

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
    
    @PostMapping("/signup/verifycreds")
    public ResponseEntity<String> verifyCredentials(@RequestBody Map<String, String> credentials) {
        String userName = credentials.get("userName");
        String currentPassword = credentials.get("currentPassword");

        Boolean checkCreds = signupservice.isCredsCorrect(userName, currentPassword);
        if (checkCreds) {
            return ResponseEntity.status(HttpStatus.OK).body("Credentials are correct");
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Credentials are not correct");
        }
    }
    @PostMapping("/signup/changePassword")
    public ResponseEntity<String> changePassword(@RequestBody ChangePasswordRequest changePasswordRequest) {
    		
    	System.out.println(changePasswordRequest.getUserName());
    	System.out.println(changePasswordRequest.getNewPassword());
//    	return ResponseEntity.status(HttpStatus.OK).body("Password changed");
    		String changePassword = signupservice.changePassword(changePasswordRequest.getUserName(),changePasswordRequest.getCurrentPassword(),changePasswordRequest.getNewPassword());
    		if(changePassword == "Current Password and New Password same") {
    			return ResponseEntity.status(HttpStatus.CONFLICT).body("Both Passwords are same");
    		}
    		else {
    			return ResponseEntity.status(HttpStatus.OK).body("Password changed");
    		}
    }


}
