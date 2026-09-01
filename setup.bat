@echo off
setlocal EnableDelayedExpansion
title UniversalAgent Setup (Dual-Agent)

rem Console Windows chuyen sang CP 65001 (UTF-8)
chcp 65001 >nul

set "TARGET=%~1"
if defined TARGET (
    if "!TARGET:~-1!"=="\" set "TARGET=!TARGET:~0,-1!"
)

if not exist "%~dp0install.ps1" (
    echo [ERROR] Khong tim thay tep cai dat: install.ps1
    echo Vui long kiem tra lai thu muc UniversalAgent.
    echo.
    pause
    exit /b 1
)

if defined TARGET (
    powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0install.ps1" -TargetDir "!TARGET!"
) else (
    powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0install.ps1"
)
set "EXITCODE=%ERRORLEVEL%"

echo.
pause
exit /b %EXITCODE%
