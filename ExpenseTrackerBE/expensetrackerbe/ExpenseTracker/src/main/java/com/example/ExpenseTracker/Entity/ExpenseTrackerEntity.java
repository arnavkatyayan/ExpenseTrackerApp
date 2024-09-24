package com.example.ExpenseTracker.Entity;

import java.sql.Timestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name="expense_tracker")
public class ExpenseTrackerEntity {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(name="expenseamount")
	private int expenseAmount;
	
	@Column(name="expenseid")
	private int expenseId;
	
	@Column(name="expensename")
	private String expenseName;
	
	@Column(name="monthname")
	private String monthName;
	
	@Column(name="expensedate")
	private Timestamp expenseDate;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public int getExpenseAmount() {
		return expenseAmount;
	}

	public void setExpenseAmount(int expenseAmount) {
		this.expenseAmount = expenseAmount;
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

	public int getExpenseId() {
		return expenseId;
	}

	public void setExpenseId(int expenseId) {
		this.expenseId = expenseId;
	}

	public Timestamp getExpenseDate() {
		return expenseDate;
	}

	public void setExpenseDate(Timestamp expenseDate) {
		this.expenseDate = expenseDate;
	}
	
	
	
	
	
}
