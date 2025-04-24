@echo off
echo Setting up AcademEase Node.js as a Windows service to prevent popups...

REM Check if running as administrator
NET SESSION >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo This script requires administrator privileges.
    echo Please right-click and select "Run as administrator"
    pause
    exit
)

REM Download NSSM (Non-Sucking Service Manager) if not present
if not exist "%~dp0nssm.exe" (
    echo Downloading NSSM...
    powershell -Command "Invoke-WebRequest -Uri 'https://nssm.cc/release/nssm-2.24.zip' -OutFile '%~dp0nssm.zip'"
    powershell -Command "Expand-Archive -Path '%~dp0nssm.zip' -DestinationPath '%~dp0nssm_temp'"
    copy "%~dp0nssm_temp\nssm-2.24\win64\nssm.exe" "%~dp0"
    rmdir /S /Q "%~dp0nssm_temp"
    del "%~dp0nssm.zip"
)

REM First, kill any existing node.exe processes that might be causing popups
echo Stopping any running Node.js processes...
taskkill /F /IM node.exe /T

REM Install the service (this will run Node.js in the background with no window)
echo Installing AcademEase service...
"%~dp0nssm.exe" install AcademEaseServer "%ProgramFiles%\nodejs\node.exe"
"%~dp0nssm.exe" set AcademEaseServer AppParameters "%~dp0server\server.js"
"%~dp0nssm.exe" set AcademEaseServer AppDirectory "%~dp0"
"%~dp0nssm.exe" set AcademEaseServer DisplayName "AcademEase Server"
"%~dp0nssm.exe" set AcademEaseServer Description "AcademEase Node.js Web Server"
"%~dp0nssm.exe" set AcademEaseServer Start SERVICE_AUTO_START
"%~dp0nssm.exe" set AcademEaseServer AppStdout "%~dp0logs\service-output.log"
"%~dp0nssm.exe" set AcademEaseServer AppStderr "%~dp0logs\service-error.log"
"%~dp0nssm.exe" set AcademEaseServer AppNoConsole 1
"%~dp0nssm.exe" set AcademEaseServer AppEnvironmentExtra "NODE_NO_WARNINGS=1 SILENT_CONSOLE=true"

REM Create logs directory if it doesn't exist
if not exist "%~dp0logs" mkdir "%~dp0logs"

REM Start the service
echo Starting AcademEase service...
net start AcademEaseServer

echo.
echo AcademEase server has been installed and started as a Windows service.
echo No more popup windows should appear.
echo.
echo To uninstall the service, run 'nssm remove AcademEaseServer'
pause
