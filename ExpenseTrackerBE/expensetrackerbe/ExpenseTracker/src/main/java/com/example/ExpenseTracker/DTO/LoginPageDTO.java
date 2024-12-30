package com.example.ExpenseTracker.DTO;

import java.sql.Timestamp;
public class LoginPageDTO {

	public int loginAttempts;
	public Timestamp blockEndTime;
	
	public LoginPageDTO(int loginAttempts, Timestamp blockEndTime) {
		this.blockEndTime = blockEndTime;
		this.loginAttempts = loginAttempts;
	}

	public int getLoginAttempts() {
		return loginAttempts;
	}

	public void setLoginAttempts(int loginAttempts) {
		this.loginAttempts = loginAttempts;
	}

	public Timestamp getBlockEndTime() {
		return blockEndTime;
	}

	public void setBlockEndTime(Timestamp blockEndTime) {
		this.blockEndTime = blockEndTime;
	}
	
	
}
