# Start API + frontend for localhost AND LAN IP.
# Skips firewall (no Admin prompt). Localhost always works.
# For other devices on Wi-Fi, run allow-lan-firewall.bat as Admin once.

$ErrorActionPreference = 'Stop'
$root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path

Write-Host ''
Write-Host '========================================' -ForegroundColor Cyan
Write-Host '  Local + LAN dev (no firewall prompt)' -ForegroundColor Cyan
Write-Host '========================================' -ForegroundColor Cyan
Write-Host ''

& (Join-Path $PSScriptRoot 'stop-dev-ports.ps1')
Start-Sleep -Seconds 1

. (Join-Path $PSScriptRoot 'get-lan-ip.ps1')
$lanIp = Get-LanIPv4
if (-not $lanIp) {
  $lanIp = 'YOUR-PC-IP'
}

Write-Host 'Starting API + frontend...' -ForegroundColor Yellow

Start-Process powershell `
  -WorkingDirectory $root `
  -ArgumentList @('-NoExit', '-ExecutionPolicy', 'Bypass', '-Command', 'npm run api:dev')

Start-Sleep -Seconds 2

Start-Process powershell `
  -WorkingDirectory $root `
  -ArgumentList @('-NoExit', '-ExecutionPolicy', 'Bypass', '-Command', 'npm run dev')

Write-Host '  Waiting for port 5173...' -ForegroundColor DarkGray
$ready = $false
for ($i = 0; $i -lt 15; $i++) {
  Start-Sleep -Seconds 1
  if (netstat -ano | Select-String ':5173\s+.*LISTENING') {
    $ready = $true
    break
  }
}

Write-Host ''
if ($ready) {
  Write-Host 'Servers running.' -ForegroundColor Green
} else {
  Write-Host 'Servers started in new windows - check for errors if page does not load.' -ForegroundColor Yellow
}

Write-Host ''
Write-Host "  This PC:       http://localhost:5173/" -ForegroundColor Green
Write-Host "  LAN IP:        http://${lanIp}:5173/" -ForegroundColor Yellow
Write-Host ''
Write-Host '  If LAN IP does not work from other devices:' -ForegroundColor Yellow
Write-Host '    1. Right-click scripts\allow-lan-firewall.bat' -ForegroundColor White
Write-Host '    2. Run as administrator -> click Yes' -ForegroundColor White
Write-Host '    3. Run: npm run lan:diagnose' -ForegroundColor White
Write-Host ''
