# HTTP-only dev stack for corporate networks where HTTPS hits a proxy
# (502 Bad Gateway / "Certificate verify failed: self-signed certificate").
#
#   npm run dev:corp
#
# Serves:
#   http://localhost:5173   — this PC (voice works on localhost)
#   http://<lan-ip>:5174    — other devices on Wi-Fi (no voice on phones)

param(
  [switch]$SkipFirewall
)

$ErrorActionPreference = 'Stop'
$root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path

Write-Host ''
Write-Host '========================================' -ForegroundColor Cyan
Write-Host '  Corporate / proxy-friendly dev mode' -ForegroundColor Cyan
Write-Host '  (HTTP only — no self-signed HTTPS)' -ForegroundColor Cyan
Write-Host '========================================' -ForegroundColor Cyan
Write-Host ''

Write-Host 'Stopping old servers...' -ForegroundColor Yellow
& (Join-Path $PSScriptRoot 'stop-dev-ports.ps1')
Start-Sleep -Seconds 1

if (-not $SkipFirewall) {
  & (Join-Path $PSScriptRoot 'allow-lan-dev.ps1') | Out-Null
}

. (Join-Path $PSScriptRoot 'get-lan-ip.ps1')
$lanIp = Get-LanIPv4
if (-not $lanIp) {
  $lanIp = 'YOUR-PC-IP'
}

Write-Host 'Starting API + HTTP frontend...' -ForegroundColor Yellow

Start-Process powershell `
  -WorkingDirectory $root `
  -ArgumentList @('-NoExit', '-ExecutionPolicy', 'Bypass', '-Command', 'npm run api:dev')

Start-Sleep -Seconds 2

Start-Process powershell `
  -WorkingDirectory $root `
  -ArgumentList @('-NoExit', '-ExecutionPolicy', 'Bypass', '-Command', 'npm run dev')

Start-Sleep -Seconds 2

Start-Process powershell `
  -WorkingDirectory $root `
  -ArgumentList @('-NoExit', '-ExecutionPolicy', 'Bypass', '-Command', 'npm run dev:lan:http')

Write-Host ''
Write-Host 'Use these URLs (NOT https):' -ForegroundColor Green
Write-Host "  This PC:       http://localhost:5173/" -ForegroundColor White
Write-Host "  Other devices: http://${lanIp}:5174/" -ForegroundColor Yellow
Write-Host ''
Write-Host 'If you still see 502 / squid-proxy errors, add proxy bypass on this PC:' -ForegroundColor Yellow
Write-Host '  Settings -> Network -> Proxy -> "Use proxy except for:"' -ForegroundColor White
Write-Host "  localhost;127.0.0.1;${lanIp};192.168.*" -ForegroundColor White
Write-Host ''
Write-Host 'Voice on phones requires HTTPS — use npm run dev:share from a non-proxy network.' -ForegroundColor DarkGray
Write-Host ''
