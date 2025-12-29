REM startup.bat

cd backend

if not exist node_modules (
    echo Installing npm dependencies for admin...
    npm install--legacy-peer-deps
)
start pwsh -NoExit -Command "npm start"

cd ../frontend

if not exist node_modules (
    echo Installing npm dependencies for customer...
    npm install --legacy-peer-deps
)
start pwsh -NoExit -Command "npm start"