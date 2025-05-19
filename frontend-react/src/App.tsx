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

    // Initialization of WebAssembly module and fibonacci function
    useEffect(() => {
        initWasm().then((fibonacci) => {
            setFibFn(() => fibonacci);
        });
    }, []);

    // Handles compute with both js and WASM
    const handleCompute = () => {
        const n = parseInt(input);
        if (isNaN(n) || n < 0 || !fibFn) return;

        // Dictates the function to run 10 times
        const runs = 10;

        // Compute with WASM
        let wasmTotal = 0;
        let wasmVal = 0;
        for (let i = 0; i < runs; i++) {
            const start = performance.now();
            wasmVal = fibFn(n);
            const end = performance.now();
            wasmTotal += (end - start);
        }

        const wasmAverage = wasmTotal / runs;
        setWasmResult(wasmVal);
        setWasmTime(wasmAverage);

        // Compute with JS
        let jsTotal = 0;
        let jsVal = 0;
        for (let i = 0; i < runs; i++) {
            const start = performance.now();
            jsVal = jsFibonacci(n);
            const end = performance.now();
            jsTotal += (end - start);
        }

        const jsAverage = jsTotal / runs;
        setJsResult(jsVal);
        setJsTime(jsAverage);

        // logging to the console for testing
        console.log(`Average WebAssembly time over ${runs} runs for n = ${n}: ${wasmAverage.toFixed(3)} ms`);
        console.log(`Average JS time over ${runs} runs for n = ${n}: ${jsAverage.toFixed(3)} ms`);
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
