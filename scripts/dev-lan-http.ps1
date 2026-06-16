# HTTP fallback on port 5174 for corporate proxies that cannot speak TLS to the dev server.
# Use http://<lan-ip>:5174 when you see "502 - remote server does not speak TLS".

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

Stop-PortListener -Port 5174
Start-Sleep -Seconds 1

. (Join-Path $PSScriptRoot 'get-lan-ip.ps1')
$lanIp = Get-LanIPv4
if (-not $lanIp) {
  $lanIp = 'YOUR-PC-IP'
}

Write-Host ''
Write-Host 'HTTP LAN fallback (port 5174) — for corporate proxy / 502 TLS errors' -ForegroundColor Cyan
Write-Host "  http://localhost:5174" -ForegroundColor White
Write-Host "  http://${lanIp}:5174" -ForegroundColor Yellow
Write-Host ''

Set-Location $PSScriptRoot\..

Remove-Item Env:VITE_DEV_HTTPS -ErrorAction SilentlyContinue
$env:VITE_LAN_IP = $lanIp
npx vite --port 5174 --host 0.0.0.0 --strictPort
