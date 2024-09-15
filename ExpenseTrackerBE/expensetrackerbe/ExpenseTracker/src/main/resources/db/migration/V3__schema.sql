CREATE TABLE expensetrackerschema.Month_Tracker (
    id SERIAL PRIMARY KEY,
    Amount INTEGER,
    StartDate TIMESTAMP,
    EndDate TIMESTAMP,
    MonthName VARCHAR NOT NULL
);
