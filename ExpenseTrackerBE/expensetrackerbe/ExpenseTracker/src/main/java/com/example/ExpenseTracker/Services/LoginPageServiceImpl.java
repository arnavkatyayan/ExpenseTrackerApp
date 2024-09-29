package com.example.ExpenseTracker.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.ExpenseTracker.Entity.SignupEntity;
import com.example.ExpenseTracker.Repository.HandlingMonthRepo;
import com.example.ExpenseTracker.Repository.SignupRepo;

@Service
public class LoginPageServiceImpl implements LoginPageService {

	@Autowired
	SignupRepo signUpRepo;
	
	@Autowired
	HandlingMonthRepo handlingMonthRepo;
	
	@Override
	public Boolean isCredentialsCorrect(String Username, String Password) {
		
		if(!signUpRepo.existsByUsername(Username)) {
			return false;
		}
		SignupEntity signup = signUpRepo.findByUsername(Username);
		String user = signup.getUsername();
		String pass = signup.getPassword();
		if(Username.equals(user) && Password.equals(pass)) {
			return true;
		}
		else {
			return false;
		}
	}

	@Override
	public Boolean isMonthAdded(String monthName) {
		
		if(handlingMonthRepo.existsByMonthName(monthName)) {
			return true;
		}
		else {
			return false;
		}
	}


}
