package com.example.ExpenseTracker.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.ExpenseTracker.Entity.RecurrenceTrackerEntity;

public interface RecurrenceTrackerRepo extends JpaRepository<RecurrenceTrackerEntity, Long> {
	List<RecurrenceTrackerEntity> findByUserName(String userName);
}
