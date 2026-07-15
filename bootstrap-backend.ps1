# =============================================================================
# ZeroNix AV Backend — Bootstrap Script
# Run this from the zeronixav\ workspace root in PowerShell (as Administrator)
# =============================================================================
#
# What this does:
#   1. Downloads and installs PHP 8.3 to C:\php
#   2. Configures php.ini (enables extensions needed by Laravel/Filament)
#   3. Downloads and installs Composer globally
#   4. Creates the Laravel 11 project in backend\
#   5. Overlays all pre-written files (migrations, models, seeders, services)
#   6. Installs Filament v3
#   7. Runs php artisan install:api
#   8. Generates APP_KEY
#
# IMPORTANT: Run from:  c:\Users\user\Documents\zeronixav\
# =============================================================================

$ErrorActionPreference = "Stop"
$WorkspaceRoot = $PSScriptRoot
$BackendDir = Join-Path $WorkspaceRoot "backend"
$PhpDir = "C:\php"
$PhpExe = "$PhpDir\php.exe"
$ComposerPhar = "$PhpDir\composer.phar"

Write-Host "`n=== ZeroNix AV Backend Bootstrap ===" -ForegroundColor Cyan

# ── Step 1: Install PHP 8.3 ───────────────────────────────────────────────────
if (-not (Test-Path $PhpExe)) {
    Write-Host "`n[1/8] Downloading PHP 8.3 NTS..." -ForegroundColor Yellow
    $phpUrl = "https://windows.php.net/downloads/releases/php-8.3.22-nts-Win32-vs16-x64.zip"
    $phpZip = "$env:TEMP\php83.zip"
    New-Item -ItemType Directory -Path $PhpDir -Force | Out-Null
    Invoke-WebRequest -Uri $phpUrl -OutFile $phpZip -UseBasicParsing
    Expand-Archive -Path $phpZip -DestinationPath $PhpDir -Force
    Remove-Item $phpZip -Force
    Write-Host "  PHP 8.3 extracted to $PhpDir" -ForegroundColor Green
} else {
    Write-Host "`n[1/8] PHP already found at $PhpExe — skipping download." -ForegroundColor Green
}

# ── Step 2: Configure php.ini ─────────────────────────────────────────────────
Write-Host "`n[2/8] Configuring php.ini..." -ForegroundColor Yellow
$phpIni = "$PhpDir\php.ini"
if (-not (Test-Path $phpIni)) {
    Copy-Item "$PhpDir\php.ini-development" $phpIni
}

# Enable required extensions
$extensions = @(
    'extension=curl',
    'extension=fileinfo',
    'extension=mbstring',
    'extension=openssl',
    'extension=pdo_mysql',
    'extension=pdo_sqlite',
    'extension=sqlite3',
    'extension=gd',
    'extension=intl',
    'extension=zip',
    'extension=sodium'
)
$iniContent = Get-Content $phpIni -Raw
foreach ($ext in $extensions) {
    $commented = ";" + $ext
    if ($iniContent -match [regex]::Escape($commented)) {
        $iniContent = $iniContent -replace [regex]::Escape($commented), $ext
    } elseif ($iniContent -notmatch [regex]::Escape($ext)) {
        $iniContent += "`n$ext"
    }
}
Set-Content $phpIni $iniContent -Encoding UTF8
Write-Host "  php.ini configured with required extensions." -ForegroundColor Green

# ── Step 3: Add PHP to PATH for this session ──────────────────────────────────
Write-Host "`n[3/8] Adding PHP to session PATH..." -ForegroundColor Yellow
$env:PATH = "$PhpDir;" + $env:PATH
& $PhpExe --version
Write-Host "  PHP is ready." -ForegroundColor Green

# ── Step 4: Install Composer ──────────────────────────────────────────────────
Write-Host "`n[4/8] Installing Composer..." -ForegroundColor Yellow
if (-not (Test-Path $ComposerPhar)) {
    $composerSetup = "$env:TEMP\composer-setup.php"
    Invoke-WebRequest -Uri "https://getcomposer.org/installer" -OutFile $composerSetup -UseBasicParsing
    & $PhpExe $composerSetup --install-dir=$PhpDir --filename=composer.phar
    Remove-Item $composerSetup -Force
}

# Create a composer.bat shim
$composerBat = "$PhpDir\composer.bat"
Set-Content $composerBat "@echo off`r`n`"$PhpExe`" `"$ComposerPhar`" %*" -Encoding ASCII
$env:PATH = "$PhpDir;" + $env:PATH
Write-Host "  Composer installed." -ForegroundColor Green
& $PhpExe $ComposerPhar --version

# ── Step 5: Create Laravel project ────────────────────────────────────────────
Write-Host "`n[5/8] Creating Laravel 11 project in backend\..." -ForegroundColor Yellow
if (Test-Path "$BackendDir\artisan") {
    Write-Host "  Laravel project already exists — skipping create-project." -ForegroundColor Green
} else {
    # Temporarily move our pre-written files so Laravel doesn't conflict
    $tempOverlay = "$env:TEMP\zeronix_overlay"
    if (Test-Path $tempOverlay) { Remove-Item $tempOverlay -Recurse -Force }
    New-Item -ItemType Directory -Path $tempOverlay | Out-Null

    # Move pre-written directories to temp
    $dirsToSave = @('app', 'config', 'database')
    foreach ($d in $dirsToSave) {
        $src = Join-Path $BackendDir $d
        if (Test-Path $src) {
            Copy-Item $src "$tempOverlay\$d" -Recurse -Force
        }
    }
    foreach ($f in @('.env', '.env.example', 'composer.json')) {
        $src = Join-Path $BackendDir $f
        if (Test-Path $src) {
            Copy-Item $src "$tempOverlay\$f" -Force
        }
    }

    # Remove backend dir temporarily (keep it clean for Composer)
    if (Test-Path $BackendDir) { Remove-Item $BackendDir -Recurse -Force }

    # Run composer create-project
    & $PhpExe $ComposerPhar create-project laravel/laravel backend --prefer-dist --working-dir=$WorkspaceRoot

    # Re-overlay our pre-written files
    foreach ($d in $dirsToSave) {
        $src = "$tempOverlay\$d"
        if (Test-Path $src) {
            Copy-Item $src $BackendDir -Recurse -Force
        }
    }
    foreach ($f in @('.env', '.env.example')) {
        $src = "$tempOverlay\$f"
        if (Test-Path $src) {
            Copy-Item $src (Join-Path $BackendDir $f) -Force
        }
    }
    # Overlay composer.json (with filament dependency)
    Copy-Item "$tempOverlay\composer.json" (Join-Path $BackendDir "composer.json") -Force

    Remove-Item $tempOverlay -Recurse -Force
    Write-Host "  Laravel project created and files overlaid." -ForegroundColor Green
}

# ── Step 6: Install Filament v3 ───────────────────────────────────────────────
Write-Host "`n[6/8] Installing Filament v3..." -ForegroundColor Yellow
Set-Location $BackendDir
& $PhpExe $ComposerPhar require filament/filament:"^3.2" --no-interaction
Write-Host "  Filament v3 installed." -ForegroundColor Green

# ── Step 7: Install API mode ──────────────────────────────────────────────────
Write-Host "`n[7/8] Running php artisan install:api..." -ForegroundColor Yellow
& $PhpExe artisan install:api --no-interaction
Write-Host "  API routes installed." -ForegroundColor Green

# ── Step 8: Generate APP_KEY ──────────────────────────────────────────────────
Write-Host "`n[8/8] Generating APP_KEY..." -ForegroundColor Yellow
& $PhpExe artisan key:generate --ansi
Write-Host "  APP_KEY generated." -ForegroundColor Green

# ── Done ──────────────────────────────────────────────────────────────────────
Write-Host "`n=== Bootstrap Complete! ===" -ForegroundColor Cyan
Write-Host @"

Next steps:
  1. Create MySQL database:      CREATE DATABASE zeronixav;
  2. Run migrations:             php artisan migrate
  3. Run seeder:                 php artisan db:seed
  4. Create Filament admin:      php artisan make:filament-user
  5. Start dev server:           php artisan serve

  Backend will be available at:  http://localhost:8000
  Filament admin panel at:       http://localhost:8000/admin

"@ -ForegroundColor White

Set-Location $WorkspaceRoot
