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
Write-Host '  This PC (HTTP):  http://localhost:5173/' -ForegroundColor Green
Write-Host "  LAN (HTTP):      http://${lanIp}:5173/" -ForegroundColor White
Write-Host "  Phone (HTTPS):   https://${lanIp}:5175/  (voice, accept cert warning)" -ForegroundColor Yellow
Write-Host ''

$listening5173 = netstat -ano | Select-String ':5173\s+.*LISTENING'
$listening5175 = netstat -ano | Select-String ':5175\s+.*LISTENING'
$listening3001 = netstat -ano | Select-String ':3001\s+.*LISTENING'

if ($listening5173) {
  Write-Host '  [OK] Port 5173 is listening (HTTP frontend)' -ForegroundColor Green
} else {
  Write-Host '  [!!] Port 5173 is NOT listening - run: npm run dev:local' -ForegroundColor Red
}

if ($listening3001) {
  Write-Host '  [OK] Port 3001 is listening (API)' -ForegroundColor Green
} else {
  Write-Host '  [--] Port 3001 not listening - run: npm run api:dev' -ForegroundColor DarkGray
}

if ($listening5175) {
  Write-Host '  [OK] Port 5175 is listening (HTTPS for phones)' -ForegroundColor Green
}

Write-Host ''
$nodeBlocks = Get-NetFirewallRule -DisplayName 'Node.js JavaScript Runtime' -ErrorAction SilentlyContinue |
  Where-Object { $_.Direction -eq 'Inbound' -and $_.Action -eq 'Block' -and $_.Enabled -eq 'True' }

if ($nodeBlocks) {
  $blockCount = @($nodeBlocks).Count
  Write-Host "  [!!] Node.js inbound BLOCK rules active ($blockCount)" -ForegroundColor Red
  Write-Host '       Fix (Admin): npm run lan:firewall' -ForegroundColor Yellow
} else {
  Write-Host '  [OK] No Node.js inbound BLOCK rules' -ForegroundColor Green
}

$portRule = Get-NetFirewallRule -DisplayName 'Jira Ticket Generator Dev 5173' -ErrorAction SilentlyContinue |
  Where-Object { $_.Enabled -eq 'True' -and $_.Action -eq 'Allow' }

if ($portRule) {
  Write-Host '  [OK] Firewall allow rule for port 5173' -ForegroundColor Green
} else {
  Write-Host '  [!!] Missing firewall allow rule for port 5173' -ForegroundColor Red
  Write-Host '       Other devices cannot connect until you run (as Admin):' -ForegroundColor Yellow
  Write-Host '       scripts\allow-lan-firewall.bat' -ForegroundColor Yellow
}

Write-Host ''
Write-Host '  Localhost works without firewall. LAN IP needs firewall once (Admin).' -ForegroundColor Cyan
Write-Host ''

if ($lanIp -ne 'UNKNOWN' -and $listening5173) {
  $curlHttp = curl.exe -I --connect-timeout 3 'http://localhost:5173/' 2>&1 | Select-String 'HTTP/'
  if ($curlHttp) {
    Write-Host "  [OK] HTTP responds: $curlHttp" -ForegroundColor Green
  }
}

Write-Host ''
