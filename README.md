# 4semester-project
A project with the goal of dispaying and comparing performance between native JS and Rust through WebAssembly.

Using Fibonacci to compute.

## Project Structure
- backend: Rust backend server
- fibonacci-wasm: Rust library compiled to WebAssembly
- frontend-react: React frontend application

## Getting Started
1. Install Node.js, Rust and wasm-pack.
2. Run `.\start-all.ps1` in PowerShell to start all services.

Two terminals will open:
CTRL + Click on the the one with a link to open in browser

## Development
- Backend code is in backend/src
- WASM code is in fibonacci-wasm/src
- Frontend code is in frontend-react/src

## Scripts
- start-all.ps1: Starts backend, builds WAMS and runs the frontend.


