package com.example.ExpenseTracker.Services;

import com.example.ExpenseTracker.Entity.HandlingMonthEntity;
import com.example.ExpenseTracker.Request.HandleMonthRequest;

public interface HandleMonthService {

	HandlingMonthEntity saveMonth(HandleMonthRequest handlingMonthRequest);
	int getCurrentMonthSalary(String month);
	int getRecurrenceAmount(String userName);
}
