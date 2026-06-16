# HTTPS dev server on port 5175 for voice on phones/tablets over LAN.
# Port 5173 stays HTTP (no self-signed cert / proxy 502 errors on this PC).
#
#   npm run dev:lan

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

Stop-PortListener -Port 5175
Start-Sleep -Seconds 1

. (Join-Path $PSScriptRoot 'get-lan-ip.ps1')
$lanIp = Get-LanIPv4
if (-not $lanIp) {
  $lanIp = 'YOUR-PC-IP'
}

Write-Host ''
Write-Host '========================================' -ForegroundColor Cyan
Write-Host '  HTTPS LAN server (port 5175)' -ForegroundColor Cyan
Write-Host '  Voice on phones / tablets' -ForegroundColor Cyan
Write-Host '========================================' -ForegroundColor Cyan
Write-Host ''
Write-Host "  Phone / tablet: https://${lanIp}:5175/" -ForegroundColor Yellow
Write-Host ''
Write-Host '  On this PC use HTTP instead (no cert errors):' -ForegroundColor White
Write-Host '    http://localhost:5173/' -ForegroundColor Green
Write-Host ''
Write-Host '  Accept the self-signed certificate warning on the phone.' -ForegroundColor DarkGray
Write-Host ''

Set-Location $PSScriptRoot\..

$env:VITE_DEV_HTTPS = 'true'
$env:VITE_DEV_PORT = '5175'
$env:VITE_LAN_IP = $lanIp
npm run dev:vite
