package com.example.ExpenseTracker.Services;

import com.example.ExpenseTracker.Entity.HandlingMonthEntity;
import com.example.ExpenseTracker.Repository.HandlingMonthRepo;
import com.example.ExpenseTracker.Request.HandleMonthRequest;
import java.security.Timestamp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class HandleMonthServiceImpl implements HandleMonthService {

	

    @Autowired
    HandlingMonthRepo handlingmonthrepo;
    
	@Override
	public HandlingMonthEntity saveMonth(HandleMonthRequest handlingMonthRequest) {
		
		
		HandlingMonthEntity monthEntity = new HandlingMonthEntity();
        monthEntity.setAmount(handlingMonthRequest.getAmount());
        monthEntity.setEndDate(handlingMonthRequest.getEndDate());
        monthEntity.setStartDate(handlingMonthRequest.getStartDate());
        monthEntity.setMonthName(handlingMonthRequest.getMonthName());
        return handlingmonthrepo.save(monthEntity);
	}

}
