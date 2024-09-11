package com.example.ExpenseTracker.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.ExpenseTracker.Repository.SignupRepo;

@Service
public class ForgetPasswordServiceImpl implements ForgetPasswordService {

	@Autowired
	SignupRepo signuprepo;
	
	@Override
	public Boolean isMailPresent(String email) {
		
		return signuprepo.existsByEmail(email);
	}

}
