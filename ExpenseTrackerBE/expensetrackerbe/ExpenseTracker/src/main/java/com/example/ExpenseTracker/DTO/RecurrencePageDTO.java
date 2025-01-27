package com.example.ExpenseTracker.DTO;

public class RecurrencePageDTO {

	private String expenseName;
	private int expenseAmount;
	
//	RecurrencePageDTO(String expenseName, int expenseAmount) {
//		this.expenseAmount = expenseAmount;
//		this.expenseName = expenseName;
//	}

	public String getExpenseName() {
		return expenseName;
	}

	public void setExpenseName(String expenseName) {
		this.expenseName = expenseName;
	}

	public int getExpenseAmount() {
		return expenseAmount;
	}

	public void setExpenseAmount(int expenseAmount) {
		this.expenseAmount = expenseAmount;
	}
	
	
}
