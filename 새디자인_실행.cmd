@echo off
setlocal
cd /d "%~dp0"
echo [Loop] Restarting this project only. Build takes 1-2 minutes...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\restart-preview.ps1" -Restart
if errorlevel 1 (
  echo.
  echo [Loop] Something failed. Please send a screenshot of this window.
  pause
  exit /b 1
)
echo [Loop] Opening http://127.0.0.1:3100
start "" "http://127.0.0.1:3100"
echo.
echo Keep the new server window open. You can close this one.
pause
