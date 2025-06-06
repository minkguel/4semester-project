﻿# 4semester-project
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

The Vite window will have the URL which directs you to your browser.
CTRL + Click on the local link to open.

## Development
- Backend code is in backend/src
- WASM code is in fibonacci-wasm/src
- Frontend code is in frontend-react/src

## Scripts
- start-all.ps1: Starts backend, builds WASM module and runs the frontend.

## Purpose

This project demonstrates the advantages and disadvantages of using WebAssembly (compiled from Rust) versus native JavaScript for computational tasks and typesafety in the browser.

### What the project shows

- **Performance**: By running the same Fibonacci calculation and email validation in both JavaScript and WebAssembly (Rust), the project allows you to compare execution speed. For CPU-intensive tasks (like Fibonacci), WebAssembly can be significantly faster than JavaScript, especially for larger inputs.
- **Integration**: The project shows how WebAssembly modules can be integrated into a modern JavaScript frontend, and how data can be passed between JS and WASM.
- **Use Cases**: It highlights that while WebAssembly is powerful for heavy computations, for simple input validation (like number validation), the performance difference is minimal and the added complexity may not be justified.
- **Developer Experience**: The project also demonstrates that using Rust and WebAssembly introduces extra build steps and tooling requirements compared to plain JavaScript.



