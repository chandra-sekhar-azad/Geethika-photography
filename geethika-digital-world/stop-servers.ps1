# Stop all development servers
# Run this script to stop frontend and backend servers

Write-Host "`n🛑 Stopping all development servers...`n" -ForegroundColor Yellow

$ports = @(5173, 5174, 5175, 5000)

foreach ($port in $ports) {
    $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    
    if ($connections) {
        foreach ($conn in $connections) {
            $processId = $conn.OwningProcess
            $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
            
            if ($process) {
                Write-Host "Stopping process '$($process.ProcessName)' (PID: $processId) on port $port" -ForegroundColor Cyan
                Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
                Write-Host "✓ Process stopped" -ForegroundColor Green
            }
        }
    } else {
        Write-Host "✓ Port $port is already free" -ForegroundColor Gray
    }
}

Write-Host "`n✅ All servers stopped!`n" -ForegroundColor Green

# Verify all ports are free
Write-Host "Verifying ports..." -ForegroundColor Yellow
Start-Sleep -Seconds 1

$allFree = $true
foreach ($port in $ports) {
    $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($connections) {
        Write-Host "⚠️  Port $port is still in use" -ForegroundColor Red
        $allFree = $false
    } else {
        Write-Host "✓ Port $port is free" -ForegroundColor Green
    }
}

if ($allFree) {
    Write-Host "`n🎉 All ports are now available!`n" -ForegroundColor Green
} else {
    Write-Host "`n⚠️  Some ports are still in use. Try running the script again.`n" -ForegroundColor Yellow
}
