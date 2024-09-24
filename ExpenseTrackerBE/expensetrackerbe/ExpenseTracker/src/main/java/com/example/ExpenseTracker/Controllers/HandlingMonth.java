package com.example.ExpenseTracker.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.ExpenseTracker.Entity.HandlingMonthEntity;
import com.example.ExpenseTracker.Request.HandleMonthRequest;
import com.example.ExpenseTracker.Services.HandleMonthService;

@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*", allowCredentials = "true")
@RestController
@RequestMapping("/api-handling-month")
public class HandlingMonth {

	@Autowired
	HandleMonthService handlemonthservice;
	
	@PostMapping("/handling-month")
	public HandlingMonthEntity handleMonth(@RequestBody HandleMonthRequest handleMonthRequest) {
		
		return handlemonthservice.saveMonth(handleMonthRequest);
		
	}
	
	@GetMapping("/getCurrMonthSal/{month}")
	public ResponseEntity<Long> getCurrentMonthSalary(@PathVariable String month) {
		
		int salary = handlemonthservice.getCurrentMonthSalary(month);
		Long ans = (long)(salary);
		return ResponseEntity.ok(ans);
	}
}
