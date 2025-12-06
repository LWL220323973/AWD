@echo off

start "Frontend" cmd /k "cd frontend && npm start"
start "Backend" cmd /k "cd backend && npm start"
