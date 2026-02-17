# PowerShell script to replace Valentine theme colors with Orange/Brand theme
# Run this from the geethika-digital-world directory

Write-Host "Starting theme color replacement..." -ForegroundColor Green

$clientSrcPath = ".\client\src"

# Color mappings
$replacements = @{
    'text-valentine-red' = 'text-orange-primary'
    'text-valentine-darkRed' = 'text-orange-dark'
    'text-valentine-pink' = 'text-orange-hover'
    'text-valentine-rose' = 'text-orange-primary'
    'text-valentine-lightPink' = 'text-orange-light'
    
    'bg-valentine-red' = 'bg-orange-primary'
    'bg-valentine-darkRed' = 'bg-orange-dark'
    'bg-valentine-pink' = 'bg-orange-hover'
    'bg-valentine-rose' = 'bg-orange-primary'
    'bg-valentine-lightPink' = 'bg-orange-light'
    
    'border-valentine-red' = 'border-orange-primary'
    'border-valentine-darkRed' = 'border-orange-dark'
    'border-valentine-pink' = 'border-orange-hover'
    'border-valentine-rose' = 'border-orange-primary'
    'border-valentine-lightPink' = 'border-orange-light'
    
    'from-valentine-red' = 'from-orange-primary'
    'from-valentine-darkRed' = 'from-orange-dark'
    'from-valentine-pink' = 'from-orange-hover'
    'from-valentine-rose' = 'from-orange-primary'
    'from-valentine-lightPink' = 'from-orange-light'
    
    'to-valentine-red' = 'to-orange-primary'
    'to-valentine-darkRed' = 'to-orange-dark'
    'to-valentine-pink' = 'to-orange-hover'
    'to-valentine-rose' = 'to-orange-primary'
    'to-valentine-lightPink' = 'to-orange-light'
    
    'fill-valentine-red' = 'fill-orange-primary'
    'fill-valentine-pink' = 'fill-orange-hover'
    
    'hover:text-valentine-red' = 'hover:text-orange-primary'
    'hover:bg-valentine-red' = 'hover:bg-orange-primary'
    'hover:border-valentine-red' = 'hover:border-orange-primary'
    
    'focus:ring-valentine-red' = 'focus:ring-orange-primary'
    'focus:border-valentine-red' = 'focus:border-orange-primary'
}

$filesProcessed = 0
$replacementsMade = 0

# Get all .jsx and .js files
$files = Get-ChildItem -Path $clientSrcPath -Include *.jsx,*.js -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    $fileModified = $false
    
    foreach ($old in $replacements.Keys) {
        $new = $replacements[$old]
        if ($content -match [regex]::Escape($old)) {
            $content = $content -replace [regex]::Escape($old), $new
            $fileModified = $true
            $replacementsMade++
        }
    }
    
    if ($fileModified) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "Updated: $($file.Name)" -ForegroundColor Yellow
        $filesProcessed++
    }
}

Write-Host "`nTheme update complete!" -ForegroundColor Green
Write-Host "Files processed: $filesProcessed" -ForegroundColor Cyan
Write-Host "Replacements made: $replacementsMade" -ForegroundColor Cyan
Write-Host "`nPlease review the changes and test your application." -ForegroundColor Yellow
