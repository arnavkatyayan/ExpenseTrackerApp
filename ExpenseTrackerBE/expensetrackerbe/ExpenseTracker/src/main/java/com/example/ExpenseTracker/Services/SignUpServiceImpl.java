package com.example.ExpenseTracker.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.ExpenseTracker.Entity.SignupEntity;
import com.example.ExpenseTracker.Repository.SignupRepo;
import com.example.ExpenseTracker.Request.SignUpRequest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
public class SignUpServiceImpl implements SignUpService {
	
	private final PasswordEncoder passwordEncoder;
	
	public SignUpServiceImpl() {
		this.passwordEncoder = new BCryptPasswordEncoder();
	}
	
    @Autowired
    SignupRepo signuprepo;
    
    @Override
    public SignupEntity saveUser(SignUpRequest signupRequest) {
        SignupEntity signupEntity = new SignupEntity();
        signupEntity.setUsername(signupRequest.getUsername());
        signupEntity.setPassword(encodePassword(signupRequest.getPassword()));
        signupEntity.setJobRole(signupRequest.getjobRole());
        signupEntity.setEmail(signupRequest.getEmail());
        return signuprepo.save(signupEntity);    
    }
    
    public String encodePassword(String password) {
    	return passwordEncoder.encode(password);
    }

	@Override
	public Boolean isUserPresentInDB(String Username) {
		
		return signuprepo.existsByUsername(Username);
	}

	@Override
	public Boolean IsEmailPresent(String email) {
		
		return signuprepo.existsByEmail(email);
	}
	
	public Boolean isPassMatching(String Pass1, String Pass2) {
		return passwordEncoder.matches(Pass1, Pass2);
	}

	@Override
	public Boolean isCredsCorrect(String Username, String Password) {
		Boolean ans = false;
		if(!signuprepo.existsByUsername(Username)) {
			ans = false;
		}
		else {
			SignupEntity signupEntity = signuprepo.findByUsername(Username);
			String pass = signupEntity.getPassword();
			if(isPassMatching(pass,Password)) {
				ans = true;
			}
			
		}
		return true;
	}


	@Override
	public String changePassword(String Username, String currentPassword, String newPassword) {
	    SignupEntity signupEntity = signuprepo.findByUsername(Username);
	    if (signupEntity == null) {
	        return "User not found";
	    }
	    
	    // Compare current password with the one stored in the database
	    if (!passwordEncoder.matches(currentPassword, signupEntity.getPassword())) {
	        return "Incorrect current password";
	    }
	    
	    // Check if the new password is the same as the current one
	    if (passwordEncoder.matches(newPassword, signupEntity.getPassword())) {
	        return "Current Password and New Password are the same";
	    }

	    // Encode and set the new password
	    signupEntity.setPassword(passwordEncoder.encode(newPassword));
	    signuprepo.save(signupEntity);
	    return "Password Changed Successfully";
	}

}
