# Starts a single Vite dev server exposed on your LAN IP.

$ErrorActionPreference = 'SilentlyContinue'

function Stop-PortListener {
  param([int]$Port)

  $lines = netstat -ano | Select-String ":$Port\s+.*LISTENING"
  foreach ($line in $lines) {
    $pid = ($line -split '\s+')[-1]
    if ($pid -match '^\d+$') {
      Stop-Process -Id [int]$pid -Force
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

$firewallOk = Get-NetFirewallRule -DisplayName 'Jira Ticket Generator Dev 5173' -ErrorAction SilentlyContinue |
  Where-Object { $_.Enabled -eq 'True' -and $_.Action -eq 'Allow' }

Write-Host ''
Write-Host '========================================' -ForegroundColor Cyan
Write-Host '  Jira Ticket Generator - Dev Server' -ForegroundColor Cyan
Write-Host '========================================' -ForegroundColor Cyan
Write-Host ''
Write-Host "  This PC:     http://localhost:5173" -ForegroundColor White
Write-Host "  Other devices: http://${lanIp}:5173" -ForegroundColor Yellow
Write-Host ''

if (-not $firewallOk) {
  Write-Host '  WARNING: Firewall rule not found.' -ForegroundColor Red
  Write-Host '  Other devices may be blocked until you run (as Admin):' -ForegroundColor Red
  Write-Host '    .\scripts\allow-lan-dev.ps1' -ForegroundColor Yellow
  Write-Host ''
}

Set-Location $PSScriptRoot\..

npm run dev:vite
