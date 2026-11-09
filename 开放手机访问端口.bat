@echo off
chcp 65001 >nul
net session >nul 2>&1
if %errorlevel% neq 0 (
  echo 正在请求管理员权限...
  powershell -Command "Start-Process '%~f0' -Verb RunAs"
  exit /b
)
netsh advfirewall firewall delete rule name="IITC备考站 8080" >nul 2>&1
netsh advfirewall firewall add rule name="IITC备考站 8080" dir=in action=allow protocol=TCP localport=8080 profile=private,domain
echo.
echo 已开放本机 8080 端口（仅专用/域网络）。
echo 手机连接同一 Wi-Fi 后访问：http://192.168.0.6:8080/index.html
echo.
pause
