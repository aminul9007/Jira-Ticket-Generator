@echo off
:: Double-click this file (or right-click -> Run as administrator) to fix LAN firewall.
cd /d "%~dp0.."
powershell -ExecutionPolicy Bypass -File "%~dp0allow-lan-dev.ps1"
pause
