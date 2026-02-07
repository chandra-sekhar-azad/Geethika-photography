@echo off
echo ========================================
echo Premium Features Setup
echo ========================================
echo.

echo Step 1: Installing dependencies...
cd client
call npm install
cd ..

cd backend
call npm install
cd ..

echo.
echo Step 2: Running database migrations...
cd backend
node scripts/add-design-approval-system.js
cd ..

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Start backend: cd backend ^&^& npm start
echo 2. Start frontend: cd client ^&^& npm run dev
echo 3. Visit http://localhost:5173
echo.
pause
