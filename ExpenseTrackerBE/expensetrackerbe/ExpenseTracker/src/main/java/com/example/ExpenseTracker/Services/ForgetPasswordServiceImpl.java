package com.example.ExpenseTracker.Services;

import java.io.ByteArrayOutputStream;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.ExpenseTracker.Entity.ExpenseTrackerEntity;
import com.example.ExpenseTracker.Entity.SignupEntity;
import com.example.ExpenseTracker.Repository.SignupRepo;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class ForgetPasswordServiceImpl implements ForgetPasswordService {

	@Autowired
	SignupRepo signuprepo;
	
	private final PasswordEncoder passwordEncoder;
	
	public ForgetPasswordServiceImpl() {
		this.passwordEncoder = new BCryptPasswordEncoder();
	}
	
	 @Autowired
	private JavaMailSender mailSender; 
	 
	 String lowerCaseChars = "abcdefghijklmnopqrstuvwxyz"; // Lowercase letters
     String upperCaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; // Uppercase letters
     String numberChars = "0123456789"; // Digits
     String specialChars = "!@#$%^&*()-_=+[]{}|;:,.<>?'"; // Special symbols
	
	@Override
	public Boolean isMailPresent(String email) {
		
		return signuprepo.existsByEmail(email);
	}

	public void forgetPassword(String email) {
		String pass = getPassword();
	    try {
	        MimeMessage message = mailSender.createMimeMessage();
	        MimeMessageHelper helper = new MimeMessageHelper(message, true);

	        helper.setTo(email);
	        helper.setSubject("Password for your account");
	        helper.setText(pass);

	        // Send the email
	        mailSender.send(message);
	        saveToDB(pass,email);
	    } catch (MessagingException e) {
	        e.printStackTrace();
	    }
	}
	
	public String encodePassword(String password) {
		return passwordEncoder.encode(password);
	}
	
	public void saveToDB(String pass, String email) {
	    if (signuprepo.existsByEmail(email)) {
	        // Fetch the existing user by email
	        SignupEntity signupEntity = signuprepo.findByEmail(email);
	        
	        // Update the password
	        signupEntity.setPassword(encodePassword(pass));
	        
	        // Save the updated entity to the repository
	        signuprepo.save(signupEntity);
	    } else {
	        System.out.println("User with email " + email + " does not exist.");
	    }
	}

	public int getPasswordLength(int min, int max) {
		int len = (int)(Math.random()*8)+8;
		return len;
	}
	
	public String getFirstFour() {
	     String ans = "";
	     ans = ans+lowerCaseChars.charAt(getRandomNum(lowerCaseChars.length()));
	     ans = ans+upperCaseChars.charAt(getRandomNum(upperCaseChars.length()));
	     ans = ans+numberChars.charAt(getRandomNum(numberChars.length()));
	     ans = ans+specialChars.charAt(getRandomNum(specialChars.length()));
	     return ans;
	     
	}
	
	public String getPassword() {
		String pass = "";
		int passLength = getPasswordLength(8,15);
		pass = pass+getFirstFour();
		String allCombined = lowerCaseChars+upperCaseChars+numberChars+specialChars;
		for (int i=0;i<passLength-4;i++) {
			pass = pass+allCombined.charAt(getRandomNum(allCombined.length()));
		}
		pass = getShuffledStr(pass);
		return pass;
	}
	
	public String getShuffledStr(String pass) {
		
		List<String> chars = Arrays.asList(pass.split(""));
		Collections.shuffle(chars);
		String ans = "";
		for(String i:chars) {
			ans = ans+i;
		}
		return ans;
	}
	
	
	public int getRandomNum(int length) {
		int ans = (int) (Math.random()*length);
		return ans;
	}
}
