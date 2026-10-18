@echo off
setlocal
cd /d "%~dp0"
echo Starting Loop on http://127.0.0.1:3100
echo Keep this window open. Press Ctrl+C to stop.
call npm.cmd run preview
if errorlevel 1 pause
