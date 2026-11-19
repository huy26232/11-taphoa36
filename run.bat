@echo off
chcp 65001 >nul
title TAPHOA36 - HE THONG QUAN LY BAN LE & THUONG MAI DIEN TU UTH
cls
echo ===================================================================
echo   TAPHOA36 AI - TRUONG DAI HOC GIAO THONG VAN TAI TP.HCM (UTH)
echo   Mon hoc: Lap Trinh Web (ThS. Tran Thinh Manh Duc)
echo   Sinh vien: Tran Ngoc Lam - MSSV: 034206001749 - Nhom 11
echo ===================================================================
echo.
echo [*] Dang kiem tra moi truong Node.js...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [!] May tinh chua cai dat Node.js!
    echo [!] Vui long tai va cai dat Node.js tai: https://nodejs.org/
    echo [!] Sau khi cai xong, mo lai tep run.bat nay de su dung.
    echo.
    pause
    exit /b
)

echo [OK] Node.js da san sang!
echo [*] Dang khoi dong Node.js REST API Server (Port 3600)...
start "TapHoa36 Backend API Server" cmd /c "node server.js"

echo [*] Cho may chu khoi tao trong 2 giay...
timeout /t 2 >nul

echo [*] Dang tu dong mo cac giao dien he thong tren trinh duyet...
start http://localhost:3600/store.html
start http://localhost:3600/pos.html
start http://localhost:3600/admin.html

echo.
echo ===================================================================
echo   HE THONG TAPHOA36 DA KHOI DONG THANH CONG!
echo   -----------------------------------------------------------------
echo   1. Cua Hang Online UTH:   http://localhost:3600/store.html
echo   2. Quay Thu Ngan POS:     http://localhost:3600/pos.html
echo   3. Quan Tri Trung Tam:    http://localhost:3600/admin.html
echo   4. Kiem tra Server API:   http://localhost:3600/api/health
echo   5. Chuyen Trang Kiet&Huy: http://localhost:3600/kietvahuy
echo ===================================================================
echo.
echo (Ban co the thu nho cua so nay, khong dong cua so de giu server chay)
pause
