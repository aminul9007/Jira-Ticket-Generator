# Stop all dev servers, configure firewall, then start frontend + Jira API.
# Usage:
#   npm run dev:restart       # HTTP LAN (recommended for sharing)
#   npm run dev:restart:lan   # HTTPS LAN (voice on phones)

param(
  [switch]$Lan,
  [switch]$SkipFirewall
)

$ErrorActionPreference = 'Stop'
$root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
Write-Host '========================================' -ForegroundColor Cyan
Write-Host '  Restart Jira Ticket Generator' -ForegroundColor Cyan
Write-Host '========================================' -ForegroundColor Cyan
Write-Host ''

Write-Host 'Step 1/3: Stopping old servers...' -ForegroundColor Yellow
& (Join-Path $PSScriptRoot 'stop-dev-ports.ps1')
Start-Sleep -Seconds 1

if (-not $SkipFirewall) {
  Write-Host ''
  Write-Host 'Step 2/3: Configuring firewall for LAN access...' -ForegroundColor Yellow
  & (Join-Path $PSScriptRoot 'allow-lan-dev.ps1')
  if ($LASTEXITCODE -ne 0) {
    Write-Host 'Continuing without firewall changes...' -ForegroundColor DarkGray
  }
  Start-Sleep -Seconds 2
} else {
  Write-Host ''
  Write-Host 'Step 2/3: Skipping firewall setup (-SkipFirewall)' -ForegroundColor DarkGray
}

$frontendScript = if ($Lan) { 'dev:lan' } else { 'dev' }
$protocol = if ($Lan) { 'https' } else { 'http' }

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
Write-Host 'Step 3/3: Starting fresh servers in new windows...' -ForegroundColor Yellow

$apiCommand = "Set-Location -LiteralPath '$root'; npm run api:dev"
$frontendCommand = "Set-Location -LiteralPath '$root'; npm run $frontendScript"

Start-Process powershell -ArgumentList @(
  '-NoExit',
  '-ExecutionPolicy', 'Bypass',
  '-Command', $apiCommand
)

Start-Sleep -Seconds 1

Start-Process powershell -ArgumentList @(
  '-NoExit',
  '-ExecutionPolicy', 'Bypass',
  '-Command', $frontendCommand
)

Write-Host ''
Write-Host 'Done. Two new terminal windows should open.' -ForegroundColor Green
Write-Host ''
Write-Host "  This PC:       ${protocol}://localhost:5173/" -ForegroundColor White
Write-Host "  Other devices: ${protocol}://${lanIp}:5173/" -ForegroundColor Yellow
Write-Host ''
Write-Host '  If others still cannot connect:' -ForegroundColor Cyan
Write-Host '    npm run lan:diagnose' -ForegroundColor White
Write-Host '    Check router AP/client isolation (Wi-Fi to Ethernet)' -ForegroundColor White
Write-Host ''
