@echo off
:: Self-elevating firewall fix for LAN + voice sharing.
:: Double-click this file and click YES on the UAC prompt.

>nul 2>&1 net session
if %errorlevel% neq 0 (
    echo.
    echo Requesting Administrator permission...
    echo Click YES to allow other devices on your Wi-Fi to connect.
    echo.
    powershell -Command "Start-Process -FilePath '%~f0' -Verb RunAs"
    exit /b 0
)

cd /d "%~dp0.."
powershell -ExecutionPolicy Bypass -File "%~dp0allow-lan-dev.ps1" -Elevated
echo.
pause
