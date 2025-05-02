# start-all.ps1

# Build WASM
Start-Process -NoNewWindow -FilePath "wasm-pack" -ArgumentList "build --target web --out-dir ../frontend-react/src/wasm-fibonacci" -WorkingDirectory ".\fibonacci-wasm"

# Start Rust server in new terminal
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; cargo run"

# Start Vite dev server in a new terminal
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend-react; npm run dev"