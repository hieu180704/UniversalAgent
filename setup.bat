@echo off
setlocal
title UniversalAgent Setup (Dual-Agent)

rem Console Windows mac dinh khong doc duoc UTF-8 nen moi dong tieng Viet do
rem install.ps1 in ra deu bi vo font. Chuyen code page truoc khi goi PowerShell.
chcp 65001 >nul

set "TARGET=%~1"

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0install.ps1" -TargetDir "%TARGET%"
set "EXITCODE=%ERRORLEVEL%"

echo.
pause
exit /b %EXITCODE%
