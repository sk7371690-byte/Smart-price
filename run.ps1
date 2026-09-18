Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "   🚀 Starting SmartPrice Backend and Frontend" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

Write-Host "`n[1/2] Launching Backend Server on port 5000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd server; npm run dev"

Start-Sleep -Seconds 2

Write-Host "[2/2] Launching Frontend Client on port 5173 in this window..." -ForegroundColor Green
cd client
npm run dev
