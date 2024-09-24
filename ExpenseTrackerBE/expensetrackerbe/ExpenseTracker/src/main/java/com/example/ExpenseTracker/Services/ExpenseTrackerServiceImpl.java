package com.example.ExpenseTracker.Services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.ExpenseTracker.Entity.ExpenseTrackerEntity;
import com.example.ExpenseTracker.Repository.ExpenseTrackerRepo;
import com.example.ExpenseTracker.Repository.HandlingMonthRepo;
import com.example.ExpenseTracker.Request.ExpenseTrackerRequest;

@Service
public class ExpenseTrackerServiceImpl implements ExpenseTrackerService {
	
	@Autowired
	ExpenseTrackerRepo expensetrackerrepo;
	
	@Autowired
	HandlingMonthRepo handlingmonthrepo;

	@Override
	public ExpenseTrackerEntity saveExpense(ExpenseTrackerRequest expenseTrackerRequest) {
		// TODO Auto-generated method stub
		
		
		ExpenseTrackerEntity expense = new ExpenseTrackerEntity();
		expense.setExpenseName(expenseTrackerRequest.getExpenseName());
		expense.setExpenseAmount(expenseTrackerRequest.getExpenseAmount());
		expense.setMonthName(expenseTrackerRequest.getMonthName());
		expense.setExpenseId(expenseTrackerRequest.getExpenseId());
		expense.setExpenseDate(expenseTrackerRequest.getExpenseDate());
		return expensetrackerrepo.save(expense);
		
	}

	@Override
	public List<ExpenseTrackerEntity> getAllExpenses() {
		// TODO Auto-generated method stub
		return expensetrackerrepo.findAll();
	}

	@Override
	public Boolean isTableEmpty() {
		// TODO Auto-generated method stub
		return expensetrackerrepo.count()==0?true:false;
	}

	@Override
	public Long getFinalSalary(String monthName) {
		
		long totalSum = 0;
		List<ExpenseTrackerEntity> expenses = expensetrackerrepo.findAll();
		for(ExpenseTrackerEntity expense:expenses) {
			if(expense.getMonthName().equals(monthName)) {
				totalSum = totalSum+expense.getExpenseAmount();
			}
		}
		
		return totalSum;
	}

}
