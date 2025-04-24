@echo off
echo AcademEase Server Utilities
echo --------------------------
echo 1. Start Server (Hidden)
echo 2. Kill Node Processes
echo 3. Disable Node Error Popups
echo 4. Exit

choice /C 1234 /N /M "Select an option (1-4): "

if errorlevel 4 goto :exit
if errorlevel 3 goto :disable_popups
if errorlevel 2 goto :kill_processes
if errorlevel 1 goto :start_hidden

:start_hidden
echo Starting server in hidden mode...
start /min node server/server.js
goto :exit

:kill_processes
echo Killing all node processes...
taskkill /F /IM node.exe
goto :exit

:disable_popups
echo Disabling Node.js error popups...
reg add "HKCU\Software\Microsoft\Windows\Windows Error Reporting" /v "DontShowUI" /t REG_DWORD /d 1 /f
echo Done! Node.js error popups have been disabled.
goto :exit

:exit
echo Exiting...