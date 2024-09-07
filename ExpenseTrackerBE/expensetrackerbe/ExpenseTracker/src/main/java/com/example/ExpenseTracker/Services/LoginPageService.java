package com.example.ExpenseTracker.Services;

import org.springframework.stereotype.Service;

@Service
public interface LoginPageService {
	
	Boolean isCredentialsCorrect(String Username, String Password);
}
