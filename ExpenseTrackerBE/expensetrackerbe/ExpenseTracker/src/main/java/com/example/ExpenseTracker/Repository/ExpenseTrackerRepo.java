package com.example.ExpenseTracker.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.ExpenseTracker.Entity.ExpenseTrackerEntity;

public interface ExpenseTrackerRepo extends JpaRepository<ExpenseTrackerEntity,Long> {

}
