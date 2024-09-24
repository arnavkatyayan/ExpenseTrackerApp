package com.example.ExpenseTracker.Request;
import java.sql.Timestamp;

public class ExpenseTrackerRequest {

	private int expenseId;
	private String expenseName;
	private String monthName;
	private int expenseAmount;
	private Timestamp expenseDate;
	
	public int getExpenseId() {
		return expenseId;
	}
	public void setExpenseId(int expenseId) {
		this.expenseId = expenseId;
	}
	public String getExpenseName() {
		return expenseName;
	}
	public void setExpenseName(String expenseName) {
		this.expenseName = expenseName;
	}
	public String getMonthName() {
		return monthName;
	}
	public void setMonthName(String monthName) {
		this.monthName = monthName;
	}
	public int getExpenseAmount() {
		return expenseAmount;
	}
	public void setExpenseAmount(int expenseAmount) {
		this.expenseAmount = expenseAmount;
	}
	public Timestamp getExpenseDate() {
		return expenseDate;
	}
	public void setExpenseDate(Timestamp expenseDate) {
		this.expenseDate = expenseDate;
	}
	
	
	
}
