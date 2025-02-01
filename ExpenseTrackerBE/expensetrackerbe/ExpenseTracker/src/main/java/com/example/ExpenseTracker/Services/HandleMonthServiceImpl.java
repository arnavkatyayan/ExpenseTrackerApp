package com.example.ExpenseTracker.Services;

import com.example.ExpenseTracker.Entity.HandlingMonthEntity;
import com.example.ExpenseTracker.Entity.RecurrenceTrackerEntity;
import com.example.ExpenseTracker.Repository.HandlingMonthRepo;
import com.example.ExpenseTracker.Repository.RecurrenceTrackerRepo;
import com.example.ExpenseTracker.Request.HandleMonthRequest;
import java.security.Timestamp;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class HandleMonthServiceImpl implements HandleMonthService {

	

    @Autowired
    HandlingMonthRepo handlingmonthrepo;
    
    @Autowired
    RecurrenceTrackerRepo recurrencetrackerrepo;
    
	@Override
	public HandlingMonthEntity saveMonth(HandleMonthRequest handlingMonthRequest) {
		
		
		HandlingMonthEntity monthEntity = new HandlingMonthEntity();
        monthEntity.setAmount(getRecurrenceData(handlingMonthRequest.getUserName(),handlingMonthRequest.getAmount()));
        monthEntity.setEndDate(handlingMonthRequest.getEndDate());
        monthEntity.setStartDate(handlingMonthRequest.getStartDate());
        monthEntity.setMonthName(handlingMonthRequest.getMonthName());
        return handlingmonthrepo.save(monthEntity);
	}

	@Override
	public int getCurrentMonthSalary(String month) {
		// TODO Auto-generated method stub
		int ans = 0;
		List<HandlingMonthEntity> salary = handlingmonthrepo.findAll();
		for(HandlingMonthEntity sal:salary) {
			if(sal.getMonthName().equals(month)) {
				ans = sal.getAmount();
				break;
			}
		}
		return ans;
	}
	
	public int getRecurrenceData(String userName, int currentSal) {
		int recurrenceAmount = 0;
		if(!recurrencetrackerrepo.existsByUserName(userName)) {
			return currentSal;
		}
		List<RecurrenceTrackerEntity> amount = recurrencetrackerrepo.findByUserName(userName);
		for(RecurrenceTrackerEntity entity:amount) {
			recurrenceAmount = recurrenceAmount+entity.getRecurrenceAmount();
		}
		return currentSal-recurrenceAmount;
		
	}

	@Override
	public int getRecurrenceAmount(String userName) {
		int recurrenceAmount = 0;
		if(!recurrencetrackerrepo.existsByUserName(userName)) {
			return -1;
		}
		List<RecurrenceTrackerEntity> amount = recurrencetrackerrepo.findByUserName(userName);
		for(RecurrenceTrackerEntity entity:amount) {
			recurrenceAmount = recurrenceAmount+entity.getRecurrenceAmount();
		}
		return recurrenceAmount;
		
	}

}
