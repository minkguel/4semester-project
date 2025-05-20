import { useEffect, useState } from "react";
import { initWasm } from "./wasmBridge";

// Native JS fibonacci function
function jsFibonacci(n: number): number {
    if (n <= 1) return n;
    return jsFibonacci(n - 1) + jsFibonacci(n - 2);
}

// Native JS email validation
function jsValidateEmail(email: string): boolean {
    const re = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    return re.test(email);
}

function App() {
    const [fibFn, setFibFn] = useState<(n: number) => number>();
    const [validateEmailFn, setValidateEmailFn] = useState<(email: string) => boolean>();
    const [mode, setMode] = useState<"fibonacci" | "email">("fibonacci");

    // Fibonacci State
    const [runs, setRuns] = useState("10");
    const [input, setInput] = useState("20");
    const [wasmResult, setWasmResult] = useState<number | null>(null);
    const [wasmTime, setWasmTime] = useState<number | null>(null);
    const [jsResult, setJsResult] = useState<number | null>(null);
    const [jsTime, setJsTime] = useState<number | null>(null);

    // Email validation State
    const [email, setEmail] = useState("");
    const [jsValid, setJsValid] = useState<boolean | null>(null);
    const [wasmValid, setWasmValid] = useState<boolean | null>(null);

    // Loading WASM functions
    useEffect(() => {
    initWasm().then((exports) => {
        setFibFn(() => exports.fibonacci);
        setValidateEmailFn(() => exports.validate_email);
        });
    }, []);

    // Handles compute with both js and WASM
    const handleCompute = () => {
        const n = parseInt(input);
        const runCount = parseInt(runs);

        if (isNaN(n) || n < 0 || isNaN(runCount) || runCount <= 0 || !fibFn) return;

        let wasmTotal = 0;
        let jsTotal = 0;
        let wasmVal = 0;
        let jsVal = 0;

        for (let i = 0; i < runCount; i++) {
            const startWasm = performance.now();
            wasmVal = fibFn(n);
            const endWasm = performance.now();
            wasmTotal += (endWasm - startWasm);

            const startJs = performance.now();
            jsVal = jsFibonacci(n);
            const endJs = performance.now();
            jsTotal += (endJs - startJs);
        }

        const avgWasm = wasmTotal / runCount;
        const avgJs = jsTotal / runCount;

        setWasmResult(wasmVal);
        setJsResult(jsVal);
        setWasmTime(avgWasm);
        setJsTime(avgJs);

        // logging to the console for testing
        console.log(`Average WebAssembly time over ${runs} runs for n = ${n}: ${avgWasm.toFixed(3)} ms`);
        console.log(`Average JS time over ${runs} runs for n = ${n}: ${avgJs.toFixed(3)} ms`);
    }

    // Handles email validation
    const handleValidateEmail = () => {
        if (!validateEmailFn) return;
        const jsVal = jsValidateEmail(email);
        const wasmVal = validateEmailFn(email);

        setJsValid(jsVal);
        setWasmValid(wasmVal);

        console.log("JS valid:", jsVal, "WebAssembly valid:", wasmVal);
    };

    return (
        <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
            <h1>WebAssembly Demo</h1>

            {/* Mode toggle */}
            <div style={{ marginBottom: "1rem" }}>
                <button
                    onClick={() => setMode("fibonacci")}
                    style={{
                        marginRight: "1rem",
                        backgroundColor: mode === "fibonacci" ? "#ccc" : "#eee"
                    }}
                >
                    Fibonacci
                </button>
                <button
                    onClick={() => setMode("email")}
                    style={{
                        backgroundColor: mode === "email" ? "#ccc" : "#eee"
                    }}
                >
                    Email Validation
                </button>
            </div>

            {/* Fibonacci Section */}
            {mode === "fibonacci" && (
                <div>
                    <h2>Fibonacci Benchmark</h2>
                    <div style={{ marginBottom: "0.5rem" }}>
                        <input
                            type="number"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Enter a number"
                            min={0}
                            style={{ marginRight: "1rem" }}
                        />
                        <input
                            type="number"
                            value={runs}
                            onChange={(e) => setRuns(e.target.value)}
                            placeholder="Number of runs"
                            min={1}
                        />
                    </div>
                    <button onClick={handleCompute}>Compute</button>

                    {(wasmResult !== null || jsResult !== null) && (
                        <div style={{ marginTop: "1rem" }}>
                            <h3>Results for n = {input}</h3>
                            <p>WebAssembly: {wasmResult} (avg: {wasmTime?.toFixed(3)} ms)</p>
                            <p>Native JS: {jsResult} (avg: {jsTime?.toFixed(3)} ms)</p>
                        </div>
                    )}
                </div>
            )}

            {/* Email Validation Section */}
            {mode === "email" && (
                <div>
                    <h2>Email Validation</h2>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter an email address"
                        style={{ marginRight: "1rem" }}
                    />
                    <button onClick={handleValidateEmail}>Validate Email</button>

                    {jsValid !== null && wasmValid !== null && (
                        <div style={{ marginTop: "1rem" }}>
                            <p>JavaScript: {jsValid ? "Valid" : " Invalid"}</p>
                            <p>WASM (Rust): {wasmValid ? "Valid" : " Invalid"}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default App;
