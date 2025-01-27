CREATE TABLE expensetrackerschema.Recurrence_Expense_Tracker (
    id SERIAL PRIMARY KEY,
    userName VARCHAR(255) NOT NULL,
    recurrenceAmount INTEGER NOT NULL,
    recurrenceName VARCHAR(255) NOT NULL,
    endDate TIMESTAMP
);

