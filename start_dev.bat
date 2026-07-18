@echo off
title PolymerHub Development Server
color 0A

echo ====================================================================
echo  ⚡ POLYMERHUB — LOCAL DEVELOPMENT SERVER ⚡
echo ====================================================================
echo  Directory: %~dp0
echo  Access:    http://localhost:3000
echo ====================================================================
echo.
echo  Starting Next.js server in development mode...
echo.

cd /d "%~dp0"
call npm run dev

if %errorlevel% neq 0 (
    echo.
    echo  [X] Server crashed or stopped. Press any key to close.
    echo.
    pause
)
