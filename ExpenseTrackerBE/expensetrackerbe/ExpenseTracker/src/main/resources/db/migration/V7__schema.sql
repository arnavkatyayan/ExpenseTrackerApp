ALTER TABLE expensetrackerschema.users
ADD COLUMN login_attempts INTEGER DEFAULT 0,
ADD COLUMN block_end_time TIMESTAMP NULL


