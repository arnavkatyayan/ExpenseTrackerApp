package com.example.ExpenseTracker.Services;

import java.sql.Timestamp;
import java.time.LocalDateTime;
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
	
	boolean flag = false;
	boolean isBlockEndTimeAlreadyUpdated = false;
	
	@Override
	public Boolean isCredentialsCorrect(String Username, String Password) {

		if (!signUpRepo.existsByUsername(Username)) {
			return false;
		}
		SignupEntity signup = signUpRepo.findByUsername(Username);
		String user = signup.getUsername();
		String pass = signup.getPassword();
		if (Username.equals(user) && Password.equals(pass)) {
			//resetBlock(Username);
			return true;
			
		} else {
			if(!isBlockEndTimeAlreadyUpdated) {
			handlingLoginAttempts(Username);
			}
			Timestamp blockEndTime = signup.getBlockEndTime();
			if(blockEndTime!=null && blockEndTime.before(new Timestamp(System.currentTimeMillis())) && isBlockEndTimeAlreadyUpdated) {
				resetBlock(Username);
			}
			return false;
		}
	}

	public void resetBlock(String username) {
		SignupEntity signup = signUpRepo.findByUsername(username);
		signup.setLoginAttempts(3);
		signup.setBlockEndTime(null);
		isBlockEndTimeAlreadyUpdated = false;
		signUpRepo.save(signup);
	}

	public void handlingLoginAttempts(String userName) {
		SignupEntity signup = signUpRepo.findByUsername(userName);
		if (signup.getLoginAttempts() == 0 && !flag) {
			signup.setLoginAttempts(3);
			flag = true;
		} else if (signup.getLoginAttempts() > 0 && signup.getLoginAttempts() <= 3) {
			signup.setLoginAttempts(signup.getLoginAttempts() - 1);
		} else if (signup.getLoginAttempts() == 0 && flag) {
			LocalDateTime now = LocalDateTime.now();
			LocalDateTime blockEndTime = now.plusMinutes(30);
			Timestamp time = Timestamp.valueOf(blockEndTime);
			isBlockEndTimeAlreadyUpdated = true;
			signup.setBlockEndTime(time);
			
		}
		signUpRepo.save(signup);
	}

	@Override
	public Boolean isMonthAdded(String monthName) {

		if (handlingMonthRepo.existsByMonthName(monthName)) {
			return true;
		} else {
			return false;
		}
	}

	@Override
	public int loginAttemptsLeft(String userName) {
		
		if (!signUpRepo.existsByUsername(userName)) {
			return -1;
		}
		SignupEntity signUpEntity = signUpRepo.findByUsername(userName);
		int attempts = signUpEntity.getLoginAttempts();
		return attempts;

	}

	@Override
	public Timestamp getBlockEndTime(String userName) {
		
		SignupEntity signUpEntity = signUpRepo.findByUsername(userName);
		Timestamp blockEndTime = signUpEntity.getBlockEndTime();
		return blockEndTime;
	}

}
