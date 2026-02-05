# Server Management Guide

## ✅ All Servers Stopped Successfully

All development servers on ports 5173, 5174, 5175, and 5000 have been stopped.

---

## 🚀 Quick Commands

### Stop All Servers

**Option 1: Double-click the file**
```
stop-servers.bat
```

**Option 2: PowerShell**
```powershell
.\stop-servers.ps1
```

**Option 3: Manual Command**
```powershell
$ports = @(5173, 5174, 5175, 5000)
foreach ($port in $ports) {
    Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | 
    ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
}
```

### Start All Servers

**Option 1: Double-click the file**
```
start-servers.bat
```

**Option 2: PowerShell**
```powershell
.\start-servers.ps1
```

**Option 3: Manual Start**
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd client
npm run dev
```

---

## 📋 Port Information

| Port | Service | URL |
|------|---------|-----|
| 5000 | Backend API | http://localhost:5000 |
| 5173 | Frontend (Vite) | http://localhost:5173 |
| 5174 | Frontend Alt 1 | http://localhost:5174 |
| 5175 | Frontend Alt 2 | http://localhost:5175 |

---

## 🔍 Check Port Status

### Check if a port is in use
```powershell
Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue
```

### Check all development ports
```powershell
$ports = @(5173, 5174, 5175, 5000)
foreach ($port in $ports) {
    $conn = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($conn) {
        Write-Host "Port $port is in use by process $($conn.OwningProcess)"
    } else {
        Write-Host "Port $port is free"
    }
}
```

### Find process using a port
```powershell
Get-NetTCPConnection -LocalPort 5173 | Select-Object -Property LocalPort, OwningProcess
```

---

## 🛑 Stop Specific Port

### Stop port 5173 (Frontend)
```powershell
Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue | 
ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
```

### Stop port 5000 (Backend)
```powershell
Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue | 
ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
```

---

## 🔧 Troubleshooting

### Issue: Port still in use after stopping

**Solution 1: Wait a moment**
```powershell
Start-Sleep -Seconds 2
# Then check again
```

**Solution 2: Force kill by process name**
```powershell
# Kill Node.js processes
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# Kill Vite processes
Get-Process vite -ErrorAction SilentlyContinue | Stop-Process -Force
```

**Solution 3: Restart computer**
If all else fails, restart your computer to free all ports.

### Issue: Can't start server - port in use

**Solution: Run stop script first**
```
stop-servers.bat
```
Then try starting again.

### Issue: Permission denied

**Solution: Run as Administrator**
1. Right-click on `stop-servers.bat`
2. Select "Run as administrator"

---

## 📝 Manual Process Management

### Find all Node.js processes
```powershell
Get-Process node
```

### Stop all Node.js processes
```powershell
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
```

### Find process by PID
```powershell
Get-Process -Id 12345
```

### Stop process by PID
```powershell
Stop-Process -Id 12345 -Force
```

---

## 🎯 Best Practices

### Starting Servers
1. ✅ Always check ports are free first
2. ✅ Start backend before frontend
3. ✅ Wait for backend to fully start (3-5 seconds)
4. ✅ Keep terminal windows open

### Stopping Servers
1. ✅ Use stop script for clean shutdown
2. ✅ Verify all ports are free after stopping
3. ✅ Close terminal windows if manually started

### Development Workflow
1. Start servers: `start-servers.bat`
2. Work on your code
3. Stop servers: `stop-servers.bat`
4. Commit changes

---

## 🚨 Emergency Stop

If servers are stuck or not responding:

```powershell
# Nuclear option - stops all Node.js processes
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# Wait a moment
Start-Sleep -Seconds 2

# Verify all ports are free
$ports = @(5173, 5174, 5175, 5000)
foreach ($port in $ports) {
    $conn = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($conn) { Write-Host "Port $port still in use" } 
    else { Write-Host "Port $port is free" }
}
```

---

## 📚 Quick Reference

| Task | Command |
|------|---------|
| Stop all servers | `stop-servers.bat` |
| Start all servers | `start-servers.bat` |
| Check port 5173 | `Get-NetTCPConnection -LocalPort 5173` |
| Kill all Node | `Get-Process node \| Stop-Process -Force` |
| List all ports | `netstat -ano` |

---

## ✅ Current Status

- ✅ Port 5173 - Free
- ✅ Port 5174 - Free
- ✅ Port 5175 - Free
- ✅ Port 5000 - Free

All servers have been successfully stopped. You can now:
- Start fresh servers
- Change ports if needed
- Run other applications
- Restart your computer safely

---

## 💡 Pro Tips

1. **Use the batch files** - Easiest way to manage servers
2. **Keep terminals visible** - Easy to see if servers crash
3. **Check ports before starting** - Prevents conflicts
4. **Stop servers when done** - Frees system resources
5. **Use Ctrl+C in terminal** - Graceful shutdown if manually started

---

**Need help?** Check the documentation or run the verification scripts in the backend folder.
