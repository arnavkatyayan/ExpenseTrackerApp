package com.example.ExpenseTracker.Services;

import java.io.ByteArrayOutputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.List;

import javax.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.persistence.EntityNotFoundException;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.ExpenseTracker.Entity.ExpenseTrackerEntity;
import com.example.ExpenseTracker.Entity.SignupEntity;
import com.example.ExpenseTracker.Repository.ExpenseTrackerRepo;
import com.example.ExpenseTracker.Repository.SignupRepo;
import com.example.ExpenseTracker.Request.ExpenseTrackerRequest;

@Service
public class ExpenseTrackerServiceImpl implements ExpenseTrackerService {
    
    @Autowired
    private ExpenseTrackerRepo expenseTrackerRepo; // Use more meaningful variable names
    
    @Autowired
    private JavaMailSender mailSender; // Ensure mail sender is injected

    @Autowired
    private SignupRepo signupRepo;
    
    @Override
    public ExpenseTrackerEntity saveExpense(ExpenseTrackerRequest expenseTrackerRequest) {
        ExpenseTrackerEntity expense = new ExpenseTrackerEntity();
        expense.setExpenseName(expenseTrackerRequest.getExpenseName());
        expense.setExpenseAmount(expenseTrackerRequest.getExpenseAmount());
        expense.setMonthName(expenseTrackerRequest.getMonthName());
        expense.setExpenseId(expenseTrackerRequest.getExpenseId());
        expense.setExpenseDate(expenseTrackerRequest.getExpenseDate());
        expense.setExpenseUser(expenseTrackerRequest.getExpenseUser());
        return expenseTrackerRepo.save(expense);
    }

    @Override
    public List<ExpenseTrackerEntity> getAllExpenses(String userName) {
       return expenseTrackerRepo.findAllByExpenseUser(userName);
    }

    @Override
    public Boolean isTableEmpty() {
        return expenseTrackerRepo.count() == 0;
    }

    @Override
    public Long getFinalSalary(String monthName) {
        return expenseTrackerRepo.findAll().stream()
                .filter(expense -> expense.getMonthName().equals(monthName))
                .mapToLong(ExpenseTrackerEntity::getExpenseAmount)
                .sum();
    }
    
    public String getRecipientName() {
    String ans = "";
    List<SignupEntity> signUp= signupRepo.findAll();
    	for(SignupEntity sign: signUp) {
    		ans = sign.getEmail();
    		break;
    	}
    	return ans;
   }

    @Override
    public void handleTransfer(Boolean saveToPC, Boolean sendToMail) throws jakarta.mail.MessagingException {
        List<ExpenseTrackerEntity> expenses = expenseTrackerRepo.findAll();
        String filePath = "C:/Users/ishum/Expense_Report.xlsx";
        if (saveToPC && filePath != null) {
            try {
                // Save the Excel file locally
                saveExcelFile(expenses, filePath);
                System.out.println("Expense report saved to: " + filePath);
            } catch (IOException e) {
                e.printStackTrace(); // Handle exception
                System.out.println("Failed to save expense report locally.");
            }
        }

        if (sendToMail) {
            String recipient = getRecipientName();

            if (!expenses.isEmpty()) {
                try {
                    sendExpenseReportByEmail(expenses, recipient);
                    System.out.println("Expense report sent successfully to " + recipient);
                } catch (MessagingException | IOException e) {
                    e.printStackTrace(); // Handle exception
                    System.out.println("Failed to send expense report.");
                }
            } else {
                System.out.println("No expenses found to send.");
            }
        }
    }

    private void saveExcelFile(List<ExpenseTrackerEntity> expenses, String filePath) throws IOException {
        // Create an Excel workbook in memory
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        generateExcel(expenses, byteArrayOutputStream);

        // Save the Excel file to the specified file path
        try (FileOutputStream fileOutputStream = new FileOutputStream(filePath)) {
            byteArrayOutputStream.writeTo(fileOutputStream);
        }
    }


    
    public void sendExpenseReportByEmail(List<ExpenseTrackerEntity> expenses, String recipientEmail) throws MessagingException, IOException, jakarta.mail.MessagingException {
        // Generate the Excel file in memory
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        generateExcel(expenses, byteArrayOutputStream);

        // Create the email
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setTo(recipientEmail);
        helper.setSubject("Expense Report");
        helper.setText("Please find the attached expense report.");

        // Attach the Excel file to the email
        helper.addAttachment("Expense_Report.xlsx", new ByteArrayResource(byteArrayOutputStream.toByteArray()));

        // Send the email
        mailSender.send(message);
    }
    

    // Method to generate Excel file from the expense data
    private void generateExcel(List<ExpenseTrackerEntity> expenses, ByteArrayOutputStream byteArrayOutputStream) throws IOException {
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Expenses");

        // Create Header Row
        Row headerRow = sheet.createRow(0);
        headerRow.createCell(0).setCellValue("Name");
        headerRow.createCell(1).setCellValue("Amount");
        headerRow.createCell(2).setCellValue("Date");

        // Loop through the list of expenses and create data rows
        int rowIndex = 1;
        for (ExpenseTrackerEntity expense : expenses) {
            Row dataRow = sheet.createRow(rowIndex++);
            dataRow.createCell(0).setCellValue(expense.getExpenseName());
            dataRow.createCell(1).setCellValue(expense.getExpenseAmount());
            dataRow.createCell(2).setCellValue(expense.getExpenseDate().toString()); // Format the date appropriately
        }

        // Write data to the ByteArrayOutputStream
        workbook.write(byteArrayOutputStream);
        workbook.close();
    }

    @Transactional
    public void deleteExpense(int expenseId) {
        // Check if the expense exists before deleting
        if (expenseTrackerRepo.existsByExpenseId(expenseId)) {
            try {
                expenseTrackerRepo.deleteByExpenseId(expenseId); // Correct method name
                System.out.println("Deleted expense with ID: " + expenseId);
            } catch (Exception e) {
                // Log the exception to understand why it failed
                System.err.println("Error deleting expense: " + e.getMessage());
                throw e; // Optionally rethrow or handle appropriately
            }
        } else {
            // Handle the case where the expense with the given id does not exist
            throw new EntityNotFoundException("Expense with id " + expenseId + " not found");
        }
    }

    @Override
    public ExpenseTrackerEntity updateExpense(int id, ExpenseTrackerRequest expenseTrackerRequest) {
        // Check if the expense with the given ID exists
        if (expenseTrackerRepo.existsByExpenseId(id)) {
            // Retrieve the existing expense from the database
            ExpenseTrackerEntity existingExpense = expenseTrackerRepo.findByExpenseId(id);
            
            // Update the fields of the existing expense
            existingExpense.setExpenseName(expenseTrackerRequest.getExpenseName());
            existingExpense.setExpenseAmount(expenseTrackerRequest.getExpenseAmount());
            existingExpense.setMonthName(expenseTrackerRequest.getMonthName());
            
            // Save the updated expense back to the repository
            return expenseTrackerRepo.save(existingExpense);
        }
        
        // Optionally, throw an exception or return a specific value if the expense does not exist
        return null; // or throw new EntityNotFoundException("Expense not found");
    }




}
