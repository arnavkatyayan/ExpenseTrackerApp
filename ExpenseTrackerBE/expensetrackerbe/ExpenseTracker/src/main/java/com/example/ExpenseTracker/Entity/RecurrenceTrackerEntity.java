package com.example.ExpenseTracker.Entity;

import java.sql.Timestamp;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "recurrence_expense_tracker")
public class RecurrenceTrackerEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "username", nullable = false)
    private String userName;

    @Column(name = "recurrenceamount", nullable = false)
    private int recurrenceAmount;

    @Column(name = "recurrencename", nullable = false)
    private String recurrenceName;

    @Column(name = "enddate")
    private Timestamp endDate;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public int getRecurrenceAmount() {
        return recurrenceAmount;
    }

    public void setRecurrenceAmount(int recurrenceAmount) {
        this.recurrenceAmount = recurrenceAmount;
    }

    public String getRecurrenceName() {
        return recurrenceName;
    }

    public void setRecurrenceName(String recurrenceName) {
        this.recurrenceName = recurrenceName;
    }

    public Timestamp getEndDate() {
        return endDate;
    }

    public void setEndDate(Timestamp endDate) {
        this.endDate = endDate;
    }
}
