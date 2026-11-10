@echo off
title OZ Park Hotel - Local Backend Server
cd /d "%~dp0"
echo Starting OZ Park Hotel local backend on http://localhost:3000 ...
start "" "http://localhost:3000"
npm run dev
pause
