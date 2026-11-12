@echo off
chcp 65001 >nul
echo ============================================================
echo   啟動《高高平等：人人有輪坐》本機伺服器
echo ============================================================
echo 正在開啟瀏覽器: http://localhost:8000/web/
echo.

start "" "http://localhost:8000/web/"

if exist "%LOCALAPPDATA%\Programs\Python\Python313\python.exe" (
    "%LOCALAPPDATA%\Programs\Python\Python313\python.exe" -m http.server 8000
) else (
    python -m http.server 8000
)

pause
