@echo off
echo ========================================
echo  Clearing Vite Cache and Restarting
echo ========================================
echo.

echo [1/3] Clearing Vite cache...
if exist "node_modules\.vite" (
    rmdir /s /q "node_modules\.vite"
    echo ✓ Vite cache cleared
) else (
    echo ✓ No Vite cache found
)

echo.
echo [2/3] Clearing dist folder...
if exist "dist" (
    rmdir /s /q "dist"
    echo ✓ Dist folder cleared
) else (
    echo ✓ No dist folder found
)

echo.
echo [3/3] Starting dev server...
echo.
echo ========================================
echo  IMPORTANT: Clear your browser cache!
echo ========================================
echo.
echo Press Ctrl+Shift+R in your browser
echo OR open in Incognito mode
echo.
echo Server starting on http://localhost:5174
echo ========================================
echo.

npm run dev
