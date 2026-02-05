# Start all development servers
# Run this script to start both frontend and backend servers

Write-Host "`n🚀 Starting development servers...`n" -ForegroundColor Green

# Check if ports are available
$ports = @(5173, 5000)
$portsInUse = @()

foreach ($port in $ports) {
    $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($connections) {
        $portsInUse += $port
    }
}

if ($portsInUse.Count -gt 0) {
    Write-Host "⚠️  The following ports are already in use: $($portsInUse -join ', ')" -ForegroundColor Yellow
    Write-Host "Run stop-servers.ps1 first to stop existing servers.`n" -ForegroundColor Yellow
    exit 1
}

# Start backend server
Write-Host "Starting backend server (port 5000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm start" -WorkingDirectory $PSScriptRoot

Start-Sleep -Seconds 3

# Start frontend server
Write-Host "Starting frontend server (port 5173)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd client; npm run dev" -WorkingDirectory $PSScriptRoot

Write-Host "`n✅ Servers are starting!`n" -ForegroundColor Green
Write-Host "Backend:  http://localhost:5000" -ForegroundColor White
Write-Host "Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "Admin:    http://localhost:5173/admin/login`n" -ForegroundColor White

Write-Host "Note: Two new PowerShell windows will open." -ForegroundColor Gray
Write-Host "Keep them open while working. Close them to stop servers.`n" -ForegroundColor Gray
