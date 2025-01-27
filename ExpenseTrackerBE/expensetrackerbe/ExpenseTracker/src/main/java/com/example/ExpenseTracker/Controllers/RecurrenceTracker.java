package com.example.ExpenseTracker.Controllers;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.ExpenseTracker.DTO.RecurrencePageDTO;
import com.example.ExpenseTracker.Request.RecurrenceTrackerRequest;
import com.example.ExpenseTracker.Services.RecurrenceTrackerService;

@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*", allowCredentials = "true")
@RestController
@RequestMapping("/api-recurrence")
public class RecurrenceTracker {

	@Autowired
	RecurrenceTrackerService recurrenceTrackerService;

	@GetMapping("/recurrenceAmount")
	public ResponseEntity<List<RecurrencePageDTO>> returnRecurrenceAmount(@RequestParam String userName) {

		Map<String,Integer> getExpenseDetails = recurrenceTrackerService.getRecurrenceDetails(userName);
		
		List<RecurrencePageDTO> responseList = new ArrayList<>();
		getExpenseDetails.forEach((key,value)-> {
			RecurrencePageDTO dto = new RecurrencePageDTO();
			dto.setExpenseName(key);
			dto.setExpenseAmount(value);
			responseList.add(dto);
		});
		System.out.print(responseList);
		return ResponseEntity.ok(responseList);	
	}
	
	@PostMapping("/submitRecurrenceData")
	public ResponseEntity<Boolean> submitRecurrenceData(@RequestBody RecurrenceTrackerRequest recurrenceTrackerRequest) {
		
		Boolean isSaveData = recurrenceTrackerService.saveRecurrenceData(recurrenceTrackerRequest);
		if(isSaveData) {
			return ResponseEntity.ok(true);
		}
		else {
			return ResponseEntity.ok(false);
		}
	}
}
