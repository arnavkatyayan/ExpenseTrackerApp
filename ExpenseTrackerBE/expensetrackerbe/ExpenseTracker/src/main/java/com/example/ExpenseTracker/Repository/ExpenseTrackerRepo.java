package com.example.ExpenseTracker.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.ExpenseTracker.Entity.ExpenseTrackerEntity;

public interface ExpenseTrackerRepo extends JpaRepository<ExpenseTrackerEntity, Long> {
    boolean existsByExpenseId(int expenseId); // Check for existence by expenseId
    void deleteByExpenseId(int expenseId); // Delete by expenseId
    ExpenseTrackerEntity findByExpenseId(int expenseId);
    List<ExpenseTrackerEntity> findAllByExpenseUser(String expenseUser);
}
