# Starts local dev server over HTTP (no self-signed certificate warning).

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
Start-Sleep -Seconds 1

$lanIp = (
  Get-NetIPAddress -AddressFamily IPv4 |
    Where-Object {
      $_.InterfaceAlias -notmatch 'Loopback|OpenVPN|VPN|Surfshark|TAP|TUN' -and
      $_.IPAddress -notlike '169.254.*' -and
      $_.IPAddress -notlike '10.12.*'
    } |
    Select-Object -First 1
).IPAddress

if (-not $lanIp) {
  $lanIp = 'YOUR-PC-IP'
}

Write-Host ''
Write-Host '========================================' -ForegroundColor Cyan
Write-Host '  Jira Ticket Generator - Dev Server' -ForegroundColor Cyan
Write-Host '========================================' -ForegroundColor Cyan
Write-Host ''
Write-Host '  This PC:       http://localhost:5173' -ForegroundColor White
Write-Host "  Other devices: http://${lanIp}:5173" -ForegroundColor Yellow
Write-Host ''
Write-Host '  Voice on this PC works over HTTP on localhost.' -ForegroundColor DarkGray
Write-Host '  For voice on phones/tablets over Wi-Fi (HTTPS), run:' -ForegroundColor DarkGray
Write-Host '    npm run dev:lan' -ForegroundColor Yellow
Write-Host ''
Write-Host '  If other PCs cannot connect, run: npm run lan:diagnose' -ForegroundColor DarkGray
Write-Host ''

Set-Location $PSScriptRoot\..

Remove-Item Env:VITE_DEV_HTTPS -ErrorAction SilentlyContinue
npm run dev:vite
