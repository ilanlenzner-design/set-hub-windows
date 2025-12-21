$ErrorActionPreference = "Stop"

# 1. Check for Admin Privileges
$currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
if (-not $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Host "CRITICAL ERROR: This installer MUST be run as Administrator." -ForegroundColor Red
    Write-Host "Please right-click Setup.bat and select 'Run as Administrator'." -ForegroundColor Yellow
    Exit 1
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   SETT-HUB WINDOWS INSTALLER" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 2. Define Paths
$sourceDir = $PSScriptRoot
$destDir = "C:\Program Files (x86)\Common Files\Adobe\CEP\extensions\sett-hub"

# 3. Enable PlayerDebugMode (CSXS 10 to 17)
Write-Host "`n[1/4] Enabling Adobe Debug Mode..." -ForegroundColor Cyan
for ($i = 10; $i -le 17; $i++) {
    $regPath = "HKCU:\Software\Adobe\CSXS.$i"
    if (-not (Test-Path $regPath)) {
        New-Item -Path $regPath -Force | Out-Null
    }
    Set-ItemProperty -Path $regPath -Name "PlayerDebugMode" -Value "1" -Force
}
Write-Host "  [OK] Registry entries updated." -ForegroundColor Green

# 4. Copy Extension Files
Write-Host "`n[2/4] Installing Extension Files..." -ForegroundColor Cyan
if (Test-Path $destDir) {
    Write-Host "  [INFO] Removing old version..." -ForegroundColor Gray
    Remove-Item -Path $destDir -Recurse -Force
}
New-Item -ItemType Directory -Path $destDir -Force | Out-Null

# Exclude installer scripts themselves from the copy
$excludeFiles = @("Install.ps1", "Setup.bat", ".git", ".gitignore")
Get-ChildItem -Path $sourceDir -Exclude $excludeFiles | ForEach-Object {
    Copy-Item -Path $_.FullName -Destination $destDir -Recurse -Force
}
Write-Host "  [OK] Files copied to CEP directory." -ForegroundColor Green

# 5. Clear CEP Cache
Write-Host "`n[3/4] Clearing Adobe Cache..." -ForegroundColor Cyan
$cachePaths = @(
    "$env:APPDATA\Adobe\CEP\cache",
    "$env:LOCALAPPDATA\Adobe\CEP\cache"
)
foreach ($path in $cachePaths) {
    if (Test-Path $path) {
        Get-ChildItem -Path $path -Recurse | Remove-Item -Force -Recurse -ErrorAction SilentlyContinue
    }
}
Write-Host "  [OK] Cache cleared." -ForegroundColor Green

# 6. Verification
Write-Host "`n[4/4] Verifying Installation..." -ForegroundColor Cyan
if (Test-Path "$destDir\CSXS\manifest.xml") {
    Write-Host "  [SUCCESS] sett-hub has been installed!" -ForegroundColor Green
}
else {
    Write-Host "  [ERROR] Installation failed. Manifest not found." -ForegroundColor Red
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   INSTALLATION COMPLETE!" -ForegroundColor Green
Write-Host "   Please Restart After Effects." -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
