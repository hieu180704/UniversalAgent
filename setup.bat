@echo off
setlocal
title UniversalAgent Setup (Dual-Agent)

set "TARGET=%~1"

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0install.ps1" -TargetDir "%TARGET%"

echo.
pause
