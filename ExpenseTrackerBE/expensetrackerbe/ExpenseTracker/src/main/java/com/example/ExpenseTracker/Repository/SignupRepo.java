package com.example.ExpenseTracker.Repository;


import com.example.ExpenseTracker.Entity.SignupEntity;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SignupRepo extends JpaRepository<SignupEntity, Long> {
}
