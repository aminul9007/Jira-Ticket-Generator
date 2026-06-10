# Installs the Python mcp-atlassian package required by the API backend.

Write-Host 'Installing mcp-atlassian (Python)...' -ForegroundColor Cyan
python -m pip install --upgrade mcp-atlassian

if ($LASTEXITCODE -ne 0) {
  Write-Host 'Failed to install mcp-atlassian. Ensure Python 3.10+ and pip are on PATH.' -ForegroundColor Red
  exit 1
}

Write-Host ''
Write-Host 'Done. Verify with:' -ForegroundColor Green
Write-Host '  mcp-atlassian --help'
Write-Host ''
Write-Host 'Configure server/.env from server/.env.example, then run:' -ForegroundColor Yellow
Write-Host '  npm run api:dev'
