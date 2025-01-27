package com.example.ExpenseTracker.Services;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.ExpenseTracker.Entity.RecurrenceTrackerEntity;
import com.example.ExpenseTracker.Repository.RecurrenceTrackerRepo;
import com.example.ExpenseTracker.Request.RecurrenceTrackerRequest;

@Service
public class RecurrenceTrackerServiceImpl implements RecurrenceTrackerService {

	
	@Autowired
	RecurrenceTrackerRepo recurrenceTrackerRepo;
	
//	@Override
//	public int getRecurrenceAmount(String userName) {
//		int sum = 0;
//		List<RecurrenceTrackerEntity> entity = recurrenceTrackerRepo.findByUserName(userName);
//		for(RecurrenceTrackerEntity i:entity) {
//			sum = sum+i.getRecurrenceAmount();
//		}
//		return sum;
//	}
	
	@Override
	public Map<String, Integer> getRecurrenceDetails(String userName) {
		Map<String, Integer> m1 = new HashMap<>();
		List<RecurrenceTrackerEntity> entity = recurrenceTrackerRepo.findByUserName(userName);
		for(RecurrenceTrackerEntity entities:entity) {
			m1.put(entities.getRecurrenceName(),entities.getRecurrenceAmount());
		}
		return m1;
	}

	@Override
	public Boolean saveRecurrenceData(RecurrenceTrackerRequest recurrenceTrackerRequest) {
		
		RecurrenceTrackerEntity entity = new RecurrenceTrackerEntity();
		entity.setEndDate(recurrenceTrackerRequest.getEndDate());
		entity.setRecurrenceName(recurrenceTrackerRequest.getExpenseName());
		entity.setRecurrenceAmount(recurrenceTrackerRequest.getExpenseAmount());
		entity.setUserName(recurrenceTrackerRequest.getUserName());
		recurrenceTrackerRepo.save(entity);
		
		return true;
	}

}
