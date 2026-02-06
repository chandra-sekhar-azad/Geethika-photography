@echo off
echo ========================================
echo Cleaning and Reinstalling Dependencies
echo ========================================
echo.

echo Removing node_modules...
if exist node_modules rmdir /s /q node_modules

echo Removing package-lock.json...
if exist package-lock.json del /f /q package-lock.json

echo.
echo Installing fresh dependencies...
call npm install

echo.
echo ========================================
echo Done! Now test the build:
echo npm run build
echo ========================================
pause
