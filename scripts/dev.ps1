# Starts local dev server over HTTP (no self-signed certificate warning).

$ErrorActionPreference = 'SilentlyContinue'

function Stop-PortListener {
  param([int]$Port)

  $lines = netstat -ano | Select-String ":$Port\s+.*LISTENING"
  foreach ($line in $lines) {
    $listenerPid = ($line -split '\s+')[-1]
    if ($listenerPid -match '^\d+$') {
      Stop-Process -Id [int]$listenerPid -Force
    }
  }
}

Stop-PortListener -Port 5173
Start-Sleep -Seconds 1

Write-Host ''
Write-Host '========================================' -ForegroundColor Cyan
Write-Host '  Jira Ticket Generator - Dev Server' -ForegroundColor Cyan
Write-Host '========================================' -ForegroundColor Cyan
Write-Host ''
Write-Host '  Open: http://localhost:5173' -ForegroundColor White
Write-Host ''
Write-Host '  Voice on this PC works over HTTP on localhost.' -ForegroundColor DarkGray
Write-Host '  For voice on phones/tablets over Wi-Fi, run:' -ForegroundColor DarkGray
Write-Host '    npm run dev:lan' -ForegroundColor Yellow
Write-Host ''

Set-Location $PSScriptRoot\..

Remove-Item Env:VITE_DEV_HTTPS -ErrorAction SilentlyContinue
npm run dev:vite
