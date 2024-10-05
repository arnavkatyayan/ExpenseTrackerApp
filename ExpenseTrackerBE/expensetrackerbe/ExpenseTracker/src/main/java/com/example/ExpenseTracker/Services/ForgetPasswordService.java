package com.example.ExpenseTracker.Services;

public interface ForgetPasswordService {

	Boolean isMailPresent(String email);
	void forgetPassword(String email);
}
