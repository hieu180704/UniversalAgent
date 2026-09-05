@echo off
setlocal EnableDelayedExpansion
title UniversalAgent Setup

rem Keep this batch file ASCII-only for cmd.exe code-page compatibility.
chcp 65001 >nul

rem Read an optional target path from drag-and-drop or command line.
set "TARGET=%~1"
if defined TARGET (
    set "TARGET=!TARGET:"=!"
    rem Preserve a drive root such as C:\ while trimming other trailing separators.
    if not "!TARGET:~1,2!"==":\" (
        if "!TARGET:~-1!"=="\" set "TARGET=!TARGET:~0,-1!"
        if "!TARGET:~-1!"=="/" set "TARGET=!TARGET:~0,-1!"
    )
)

rem Ensure the installer is beside this launcher.
if not exist "%~dp0install.ps1" (
    echo [ERROR] install.ps1 was not found next to setup.bat.
    echo Check that the UniversalAgent folder is complete.
    echo.
    pause
    exit /b 1
)

rem Start the PowerShell installer.
if defined TARGET (
    powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0install.ps1" -TargetDir "!TARGET!"
) else (
    powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0install.ps1"
)
set "EXITCODE=%ERRORLEVEL%"

echo.
pause
exit /b %EXITCODE%