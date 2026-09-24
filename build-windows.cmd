@echo off
cd /d "%~dp0"
call npm install --no-audit --no-fund || exit /b 1
call npm run dist:portable || exit /b 1
echo Build complete. See dist folder.
pause