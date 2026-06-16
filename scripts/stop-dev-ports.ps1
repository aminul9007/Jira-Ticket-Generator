# Stops processes listening on local dev ports.

$ErrorActionPreference = 'SilentlyContinue'

function Stop-PortListener {
  param([int]$Port)

  $lines = netstat -ano | Select-String ":$Port\s+.*LISTENING"
  foreach ($line in $lines) {
    $listenerPid = ($line -split '\s+')[-1]
    if ($listenerPid -match '^\d+$') {
      taskkill /PID $listenerPid /F 2>$null | Out-Null
    }
  }
}

Stop-PortListener -Port 5173
Stop-PortListener -Port 5174
Stop-PortListener -Port 3001
Start-Sleep -Seconds 1

Write-Host 'Stopped listeners on ports 5173, 5174, and 3001 (if any were running).' -ForegroundColor Green
