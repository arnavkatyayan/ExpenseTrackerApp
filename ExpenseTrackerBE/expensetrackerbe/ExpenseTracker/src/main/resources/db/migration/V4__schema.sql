CREATE TABLE expensetrackerschema.expense_tracker (
    id SERIAL PRIMARY KEY,
    ExpenseId INTEGER,  -- Manually assigned ExpenseId
    ExpenseAmount INTEGER,
    ExpenseName VARCHAR NOT NULL,
    MonthName VARCHAR NOT NULL
);
