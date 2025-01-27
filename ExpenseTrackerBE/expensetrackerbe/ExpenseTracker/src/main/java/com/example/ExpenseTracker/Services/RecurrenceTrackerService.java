package com.example.ExpenseTracker.Services;

import java.util.Map;

import org.springframework.stereotype.Service;

import com.example.ExpenseTracker.Request.RecurrenceTrackerRequest;

@Service
public interface RecurrenceTrackerService {
		
	Map<String, Integer> getRecurrenceDetails(String userName);
	Boolean saveRecurrenceData(RecurrenceTrackerRequest recurrenceTrackerRequest);
}
