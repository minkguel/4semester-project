import init, * as wasm from "./wasm-fibonacci/fibonacci_wasm"; // Path to your WASM module with wasm-bindgen

export async function initWasm() {
    await init();
    return {
        fibonacci: wasm.fibonacci,
        calculate_age: wasm.calculate_age,
    };
}