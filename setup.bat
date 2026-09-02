@echo off
setlocal EnableDelayedExpansion
title UniversalAgent Setup (Dual-Agent)

rem Thiết lập mã ký tự UTF-8 cho Command Prompt
chcp 65001 >nul

rem Lấy tham số đường dẫn đích nếu kéo thả hoặc truyền qua command line
set "TARGET=%~1"
if defined TARGET (
    rem Xóa dấu ngoặc kép thừa nếu có
    set "TARGET=!TARGET:"=!"
    rem Xóa dấu gạch chéo cuối cùng nếu không phải ổ đĩa gốc (C:\)
    if not "!TARGET:~1,2!"==":\" (
        if "!TARGET:~-1!"=="\" set "TARGET=!TARGET:~0,-1!"
        if "!TARGET:~-1!"=="/" set "TARGET=!TARGET:~0,-1!"
    )
)

rem Kiểm tra tồn tại file install.ps1
if not exist "%~dp0install.ps1" (
    echo [ERROR] Không tìm thấy tệp cài đặt: install.ps1
    echo Vui lòng kiểm tra lại thư mục UniversalAgent.
    echo.
    pause
    exit /b 1
)

rem Khởi chạy trình cài đặt PowerShell
if defined TARGET (
    powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0install.ps1" -TargetDir "!TARGET!"
) else (
    powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0install.ps1"
)
set "EXITCODE=%ERRORLEVEL%"

echo.
pause
exit /b %EXITCODE%
