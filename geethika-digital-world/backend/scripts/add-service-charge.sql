-- Add service_charge column to orders table
-- Run this SQL directly in your Render PostgreSQL dashboard

-- Check if column exists and add it if not
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name='orders' 
        AND column_name='service_charge'
    ) THEN
        ALTER TABLE orders 
        ADD COLUMN service_charge DECIMAL(10, 2) DEFAULT 0;
        
        RAISE NOTICE 'service_charge column added successfully';
    ELSE
        RAISE NOTICE 'service_charge column already exists';
    END IF;
END $$;

-- Verify the column was added
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'orders' AND column_name = 'service_charge';
