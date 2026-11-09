@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ============================================
echo   IITC 智能体开发工程师（高级）备考站
echo ============================================
echo.
echo   本机访问:  http://127.0.0.1:8080/index.html
echo   手机/局域网: http://192.168.0.6:8080/index.html
echo.
echo   保持此窗口开启；关闭窗口即停止服务。
echo   （手机需与本电脑连接同一个 Wi-Fi）
echo.
start "" "http://127.0.0.1:8080/index.html"
python -m http.server 8080 --bind 0.0.0.0
pause
