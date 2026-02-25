@echo off
echo.
echo Starting development servers...
echo.

powershell -ExecutionPolicy Bypass -File "%~dp0start-servers.ps1"

pause
