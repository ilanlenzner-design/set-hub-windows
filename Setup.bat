@echo off
setlocal
cd /d "%~dp0"

echo ========================================
echo     SETT HUB - INSTALLER WIZARD
echo ========================================
echo.

:: Check for administrative privileges
net session >nul 2>&1
if %errorLevel% == 0 (
    echo [OK] Administrative privileges confirmed.
) else (
    echo [ERROR] FAILURE: Administrative privileges required.
    echo.
    echo PLEASE RIGHT-CLICK THIS FILE AND CHOOSE "RUN AS ADMINISTRATOR".
    echo.
    pause
    exit /b 1
)

echo [INFO] Starting Installation Service...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0Install.ps1"

echo.
echo Press any key to exit.
pause >nul
