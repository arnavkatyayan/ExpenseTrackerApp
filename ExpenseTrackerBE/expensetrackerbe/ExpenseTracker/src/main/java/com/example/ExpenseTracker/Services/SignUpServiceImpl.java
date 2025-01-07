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
}
