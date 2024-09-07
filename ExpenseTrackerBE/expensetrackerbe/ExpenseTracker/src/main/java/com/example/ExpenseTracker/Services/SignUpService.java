package com.example.ExpenseTracker.Services;

import com.example.ExpenseTracker.Entity.SignupEntity;
import com.example.ExpenseTracker.Request.SignUpRequest;

public interface SignUpService {
    
    SignupEntity saveUser(SignUpRequest signupRequest);
}
