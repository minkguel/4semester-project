import { useEffect, useState } from "react";
import { initWasm } from "./wasmBridge";

// Native JS fibonacci function
function jsFibonacci(n: number): number {
    if (n <= 1) return n;
    return jsFibonacci(n - 1) + jsFibonacci(n - 2);
}

function App() {
    const [fibFn, setFibFn] = useState<(n: number) => number>();
    const [input, setInput] = useState("20");
    const [wasmResult, setWasmResult] = useState<number | null>(null);
    const [wasmTime, setWasmTime] = useState<number | null>(null);

    const [jsResult, setJsResult] = useState<number | null>(null);
    const [jsTime, setJsTime] = useState<number | null>(null);

    useEffect(() => {
        initWasm().then((fibonacci) => {
            setFibFn(() => fibonacci);
        });
    }, []);

    const handleCompute = () => {
        const n = parseInt(input);
        if (isNaN(n) || n < 0 || !fibFn) return;

        // Compute with WASM
        const wasmStart = performance.now();
        const wasmVal = fibFn(n);
        const wasmEnd = performance.now();

        setWasmResult(wasmVal);
        setWasmTime(wasmEnd - wasmStart);

        // Compute with JS
        const jsStart = performance.now();
        const jsVal = jsFibonacci(n);
        const jsEnd = performance.now();

        setJsResult(jsVal);
        setJsTime(jsEnd - jsStart);
    }

    return (
        <div style={{ padding: "2rem" }}>
            <h1>Fibonacci: WebAssembly vs Native JS</h1>

            <input
                type="number"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter a number"
                min={0}
            />
            <button onClick={handleCompute}>Click here to compute</button>

            {(wasmResult !== null || jsResult !== null) && (
                <div style={{ marginTop: "1rem"}}>
                    <h2>Results for n = {input}</h2>
                    <p>WebAssembly: {wasmResult} (Time: {wasmTime?.toFixed(3)} ms)</p>
                    <p>Native JS: {jsResult} (Time: {jsTime?.toFixed(3)} ms)</p>
                </div>
            )}
        </div>
    );
}

export default App;
