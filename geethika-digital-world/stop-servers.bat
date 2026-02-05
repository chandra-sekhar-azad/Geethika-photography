@echo off
echo.
echo Stopping all development servers...
echo.

powershell -ExecutionPolicy Bypass -File "%~dp0stop-servers.ps1"

pause
