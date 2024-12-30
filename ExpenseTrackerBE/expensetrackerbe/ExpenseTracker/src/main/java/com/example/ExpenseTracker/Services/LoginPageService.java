package com.example.ExpenseTracker.Services;

import org.springframework.stereotype.Service;
import java.sql.Timestamp;
@Service
public interface LoginPageService {
	
	Boolean isCredentialsCorrect(String Username, String Password);
	Boolean isMonthAdded(String monthName);
	int loginAttemptsLeft(String userName);
	Timestamp getBlockEndTime(String userName);
}
