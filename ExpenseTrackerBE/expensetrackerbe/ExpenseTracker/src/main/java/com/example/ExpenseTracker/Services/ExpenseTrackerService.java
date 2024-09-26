package com.example.ExpenseTracker.Services;

import java.util.List;

import com.example.ExpenseTracker.Entity.ExpenseTrackerEntity;
import com.example.ExpenseTracker.Request.ExpenseTrackerRequest;

import jakarta.mail.MessagingException;

public interface ExpenseTrackerService {
	ExpenseTrackerEntity saveExpense(ExpenseTrackerRequest expenseTrackerRequest);
	List<ExpenseTrackerEntity> getAllExpenses();
	Boolean isTableEmpty();
	Long getFinalSalary(String monthName);
	void handleTransfer(Boolean saveToPC, Boolean sendToMail) throws MessagingException;
	void deleteExpense(int id);
}
