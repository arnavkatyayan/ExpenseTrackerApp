package com.example.ExpenseTracker.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.ExpenseTracker.Entity.ExpenseTrackerEntity;

public interface ExpenseTrackerRepo extends JpaRepository<ExpenseTrackerEntity, Long> {
    boolean existsByExpenseId(int expenseId); // Check for existence by expenseId
    void deleteByExpenseId(int expenseId); // Delete by expenseId
    ExpenseTrackerEntity findByExpenseId(int expenseId);
}
