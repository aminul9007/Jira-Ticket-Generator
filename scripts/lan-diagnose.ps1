# LAN connectivity checklist for sharing the dev server on Wi-Fi.

$ErrorActionPreference = 'SilentlyContinue'

function Get-LanIPv4 {
  $address = Get-NetIPAddress -AddressFamily IPv4 |
    Where-Object {
      $_.InterfaceAlias -notmatch 'Loopback|OpenVPN|VPN|Surfshark|TAP|TUN' -and
      $_.IPAddress -notlike '169.254.*' -and
      $_.IPAddress -notlike '10.12.*'
    } |
    Select-Object -First 1

  return $address.IPAddress
}

$lanIp = Get-LanIPv4
if (-not $lanIp) { $lanIp = 'UNKNOWN' }

Write-Host ''
Write-Host '========================================' -ForegroundColor Cyan
Write-Host '  LAN Dev Server Diagnostics' -ForegroundColor Cyan
Write-Host '========================================' -ForegroundColor Cyan
Write-Host ''

Write-Host "  Your LAN IP:     $lanIp" -ForegroundColor Yellow
Write-Host "  HTTP share URL:  http://${lanIp}:5173/" -ForegroundColor White
Write-Host "  HTTPS share URL: https://${lanIp}:5173/  (npm run dev:lan only)" -ForegroundColor White
Write-Host ''

$listening = netstat -ano | Select-String ':5173\s+.*LISTENING'
if ($listening) {
  Write-Host '  [OK] Port 5173 is listening' -ForegroundColor Green
  $listening | ForEach-Object { Write-Host "       $_" -ForegroundColor DarkGray }
} else {
  Write-Host '  [!!] Port 5173 is NOT listening - run: npm run dev:restart' -ForegroundColor Red
}

Write-Host ''
$nodeBlocks = Get-NetFirewallRule -DisplayName 'Node.js JavaScript Runtime' -ErrorAction SilentlyContinue |
  Where-Object { $_.Direction -eq 'Inbound' -and $_.Action -eq 'Block' -and $_.Enabled -eq 'True' }

if ($nodeBlocks) {
  Write-Host "  [!!] Node.js inbound BLOCK rules active ($(@($nodeBlocks).Count))" -ForegroundColor Red
  Write-Host '       This is the most common reason other PCs cannot connect.' -ForegroundColor Red
  Write-Host '       Fix (Admin): npm run lan:firewall' -ForegroundColor Yellow
} else {
  Write-Host '  [OK] No Node.js inbound BLOCK rules' -ForegroundColor Green
}

$portRule = Get-NetFirewallRule -DisplayName 'Jira Ticket Generator Dev 5173' -ErrorAction SilentlyContinue |
  Where-Object { $_.Enabled -eq 'True' -and $_.Action -eq 'Allow' }

if ($portRule) {
  Write-Host '  [OK] Firewall allow rule for port 5173' -ForegroundColor Green
} else {
  Write-Host '  [!!] Missing project firewall allow rule for port 5173' -ForegroundColor Red
  Write-Host '       Fix (Admin): npm run lan:firewall' -ForegroundColor Yellow
}

Write-Host ''
$profile = Get-NetConnectionProfile | Select-Object -First 1
if ($profile) {
  $color = if ($profile.NetworkCategory -eq 'Public') { 'Yellow' } else { 'Green' }
  Write-Host "  Network profile: $($profile.NetworkCategory) ($($profile.InterfaceAlias))" -ForegroundColor $color
  if ($profile.InterfaceAlias -match 'Ethernet' -or $profile.InterfaceAlias -match 'Ethernet') {
    Write-Host '  Tip: You are on Ethernet. Other PCs on Wi-Fi need router' -ForegroundColor DarkGray
    Write-Host '       "AP/client isolation" disabled to reach this PC.' -ForegroundColor DarkGray
  }
}

Write-Host ''
Write-Host '  From the OTHER PC:' -ForegroundColor Cyan
Write-Host '    1. Same network (not guest Wi-Fi)' -ForegroundColor White
Write-Host "    2. ping $lanIp" -ForegroundColor White
Write-Host "    3. Open http://${lanIp}:5173/  (or https if using dev:lan)" -ForegroundColor White
Write-Host ''

if ($lanIp -ne 'UNKNOWN') {
  $curlHttp = curl.exe -I --connect-timeout 3 "http://${lanIp}:5173/" 2>&1 | Select-String 'HTTP/'
  if ($curlHttp) {
    Write-Host "  [OK] HTTP responds locally: $curlHttp" -ForegroundColor Green
  } else {
    Write-Host '  [!!] HTTP not responding on LAN IP' -ForegroundColor Red
  }
}

Write-Host ''
