# Run once as Administrator: right-click PowerShell -> Run as administrator, then:
#   cd "D:\Jira Ticket Generator"
#   .\scripts\allow-lan-dev.ps1

$ErrorActionPreference = 'Stop'

$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole(
  [Security.Principal.WindowsBuiltInRole]::Administrator
)

if (-not $isAdmin) {
  Write-Host 'ERROR: Run this script as Administrator.' -ForegroundColor Red
  Write-Host 'Right-click PowerShell -> Run as administrator, then run this script again.'
  exit 1
}

$ruleName = 'Jira Ticket Generator Dev 5173'

$existing = Get-NetFirewallRule -DisplayName $ruleName -ErrorAction SilentlyContinue
if ($existing) {
  Remove-NetFirewallRule -DisplayName $ruleName
}

New-NetFirewallRule `
  -DisplayName $ruleName `
  -Direction Inbound `
  -Action Allow `
  -Protocol TCP `
  -LocalPort 5173 `
  -Profile Private, Domain `
  -Description 'Allow LAN access to Vite dev server for Jira Ticket Generator'

Write-Host ''
Write-Host 'Firewall rule added. Other devices on your network can reach port 5173.' -ForegroundColor Green
Write-Host 'Start the app with: npm run dev' -ForegroundColor Cyan
