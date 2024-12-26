package com.example.ExpenseTracker.Repository;


import com.example.ExpenseTracker.Entity.SignupEntity;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SignupRepo extends JpaRepository<SignupEntity, Long> {
	
	boolean existsByUsername(String Username);
	boolean existsByEmail(String email);
	boolean existsByJobRole(String JobRole);
	SignupEntity findByUsername(String Username);
	SignupEntity findByEmail(String email);
	SignupEntity findByJobRole(String JobRole);
}
