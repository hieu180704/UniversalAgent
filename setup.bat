@echo off
setlocal
title UniversalAgent Setup (Dual-Agent)

rem Console Windows mac dinh khong doc duoc UTF-8 nen chuyen sang CP 65001
chcp 65001 >nul

set "TARGET=%~1"

rem Xoa dau gach cheo cuoi cung neu co de tranh loi escape dau ngoac kep trong PowerShell
if defined TARGET (
    if "%TARGET:~-1%"=="\" set "TARGET=%TARGET:~0,-1%"
)

if not exist "%~dp0install.ps1" (
    echo [ERROR] Khong tim thay tep cai dat: install.ps1
    echo Vui long kiem tra lai thu muc UniversalAgent.
    echo.
    pause
    exit /b 1
)

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0install.ps1" -TargetDir "%TARGET%"
set "EXITCODE=%ERRORLEVEL%"

echo.
pause
exit /b %EXITCODE%
