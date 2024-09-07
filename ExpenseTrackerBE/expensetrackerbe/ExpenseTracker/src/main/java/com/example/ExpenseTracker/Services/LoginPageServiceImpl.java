package com.example.ExpenseTracker.Services;

import org.springframework.stereotype.Service;

@Service
public class LoginPageServiceImpl implements LoginPageService {

	@Override
	public Boolean isCredentialsCorrect(String Username, String Password) {
		
		if(Username.equals("user") && Password.equals("pass")) {
			return true;
		}
		else {
			return false;
		}
	}

}
