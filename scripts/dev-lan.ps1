# Starts a single Vite dev server exposed on your LAN IP.

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

$nodeBlocks = Get-NetFirewallRule -DisplayName 'Node.js JavaScript Runtime' -ErrorAction SilentlyContinue |
  Where-Object { $_.Direction -eq 'Inbound' -and $_.Action -eq 'Block' -and $_.Enabled -eq 'True' }

$firewallOk = -not $nodeBlocks -and (
  Get-NetFirewallRule -DisplayName 'Jira Ticket Generator Dev 5173' -ErrorAction SilentlyContinue |
    Where-Object { $_.Enabled -eq 'True' -and $_.Action -eq 'Allow' }
)

Write-Host ''
Write-Host '========================================' -ForegroundColor Cyan
Write-Host '  Jira Ticket Generator - Dev Server' -ForegroundColor Cyan
Write-Host '========================================' -ForegroundColor Cyan
Write-Host ''
Write-Host "  This PC:       https://localhost:5173" -ForegroundColor White
Write-Host "  Other devices: https://${lanIp}:5173" -ForegroundColor Yellow
Write-Host ''
Write-Host '  IMPORTANT: Use HTTPS (not HTTP) when sharing with other devices.' -ForegroundColor Red
Write-Host '  Example: https://192.168.0.73:5173/' -ForegroundColor Yellow
Write-Host ''
Write-Host '  Accept the self-signed certificate warning on first visit.' -ForegroundColor DarkGray
Write-Host '  For simple HTTP sharing (no voice on phones), use: npm run dev' -ForegroundColor DarkGray
Write-Host '  If other PCs cannot connect, run: npm run lan:diagnose' -ForegroundColor DarkGray
Write-Host ''

if (-not $firewallOk) {
  Write-Host '  WARNING: LAN firewall not configured for other devices.' -ForegroundColor Red
  Write-Host '  Run (will request Admin): npm run lan:firewall' -ForegroundColor Yellow
  Write-Host ''
}

Set-Location $PSScriptRoot\..

$env:VITE_DEV_HTTPS = 'true'
npm run dev:vite
