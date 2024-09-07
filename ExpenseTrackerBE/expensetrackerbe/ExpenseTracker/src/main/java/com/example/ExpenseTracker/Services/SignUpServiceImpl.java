package com.example.ExpenseTracker.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.ExpenseTracker.Entity.SignupEntity;
import com.example.ExpenseTracker.Repository.SignupRepo;
import com.example.ExpenseTracker.Request.SignUpRequest;

@Service
public class SignUpServiceImpl implements SignUpService {

    @Autowired
    SignupRepo signuprepo;

    @Override
    public SignupEntity saveUser(SignUpRequest signupRequest) {
        SignupEntity signupEntity = new SignupEntity();
        signupEntity.setUsername(signupRequest.getUsername());
        signupEntity.setPassword(signupRequest.getPassword());
        signupEntity.setEmail(signupRequest.getEmail());
        return signuprepo.save(signupEntity);    
    }
}
