import init, { fibonacci } from "./wasm-fibonacci/fibonacci_wasm"; // Path to your WASM module with wasm-bindgen

export async function initWasm() {
    await init();
    return fibonacci;
}