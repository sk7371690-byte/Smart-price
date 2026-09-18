@echo off
echo ===================================================
echo   Starting SmartPrice Backend & Frontend Servers
echo ===================================================

echo [1/2] Launching Backend Server on port 5000...
start "SmartPrice Backend (Port 5000)" cmd /k "cd server && npm run dev"

timeout /t 2 /nobreak >nul

echo [2/2] Launching Frontend Client on port 5173...
start "SmartPrice Frontend (Port 5173)" cmd /k "cd client && npm run dev"

timeout /t 3 /nobreak >nul

echo Opening browser at http://localhost:5173 ...
start http://localhost:5173

echo.
echo Both servers are running!
echo - Frontend: http://localhost:5173
echo - Backend:  http://localhost:5000
echo - Health:   http://localhost:5000/api/health
echo.
pause
