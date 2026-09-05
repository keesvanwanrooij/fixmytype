@echo off
cd /d "%~dp0apps\desktop"
if not exist "node_modules\electron\dist\electron.exe" (
  echo Run npm install from apps\desktop first. See README.md.
  pause
  exit /b 1
)
call npm start
if errorlevel 1 pause
