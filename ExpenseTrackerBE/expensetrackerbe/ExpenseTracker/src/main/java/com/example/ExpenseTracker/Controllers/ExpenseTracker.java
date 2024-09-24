package com.example.ExpenseTracker.Controllers;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.ExpenseTracker.Entity.ExpenseTrackerEntity;
import com.example.ExpenseTracker.Request.ExpenseTrackerRequest;
import com.example.ExpenseTracker.Services.ExpenseTrackerService;

@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*", allowCredentials = "true")
@RestController
@RequestMapping("/api-expenseTracker")
public class ExpenseTracker {

    private static final Logger logger = LoggerFactory.getLogger(ExpenseTracker.class);

    @Autowired
    private ExpenseTrackerService expenseTrackerService;

    @PostMapping("/saveExpense")
    public ResponseEntity<ExpenseTrackerEntity> saveExpense(@RequestBody ExpenseTrackerRequest expenseTrackerRequest) {
        try {
            ExpenseTrackerEntity savedExpense = expenseTrackerService.saveExpense(expenseTrackerRequest);
            return ResponseEntity.ok(savedExpense);
        } catch (Exception e) {
            logger.error("Error saving expense", e);
            return ResponseEntity.status(500).build(); // Internal Server Error
        }
    }

    @GetMapping("/getExpenses")
    public ResponseEntity<List<ExpenseTrackerEntity>> getAllExpenses() {
        try {
            List<ExpenseTrackerEntity> expenses = expenseTrackerService.getAllExpenses();
            return ResponseEntity.ok(expenses);
        } catch (Exception e) {
            logger.error("Error fetching expenses", e);
            return ResponseEntity.status(500).build(); // Internal Server Error
        }
    }

    @GetMapping("/isTableEmpty")
    public ResponseEntity<Boolean> isTableEmpty() {
        try {
            Boolean isEmpty = expenseTrackerService.isTableEmpty();
            return ResponseEntity.ok(isEmpty);
        } catch (Exception e) {
            logger.error("Error checking if table is empty", e);
            return ResponseEntity.status(500).build(); // Internal Server Error
        }
    }

    @GetMapping("/getFinalSalary/{month}")
    public ResponseEntity<Long> getFinalSalary(@PathVariable String month) {
        try {
            Long finalSalary = expenseTrackerService.getFinalSalary(month);
            logger.info("Final salary for month {}: {}", month, finalSalary);
            return ResponseEntity.ok(finalSalary);
        } catch (Exception e) {
            logger.error("Error getting final salary for month {}", month, e);
            return ResponseEntity.status(500).build(); // Internal Server Error
        }
    }
}
