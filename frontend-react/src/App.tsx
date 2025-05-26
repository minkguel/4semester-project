import { useEffect, useState } from "react";
import { initWasm } from "./wasmBridge";
import {
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend
} from "recharts";

// Native JS fibonacci function
function jsFibonacci(n: number): number {
    if (n <= 1) return n;
    return jsFibonacci(n - 1) + jsFibonacci(n - 2);
}

// Native JS age calculation function
function jsCalculateAge(birthYear: any): string {
    // Intentionally using 'any' to demonstrate JavaScript's lack of type safety
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;
    return `You are ${age} years old`;
}

function App() {
    const [fibFn, setFibFn] = useState<(n: number) => number>();
    const [calcAgeFn, setCalcAgeFn] = useState<(birthYear: number) => string>();
    const [mode, setMode] = useState<"fibonacci" | "age">("fibonacci");

    // Fibonacci State
    const [runs, setRuns] = useState("10");
    const [input, setInput] = useState("20");
    const [wasmResult, setWasmResult] = useState<number | null>(null);
    const [wasmTime, setWasmTime] = useState<number | null>(null);
    const [jsResult, setJsResult] = useState<number | null>(null);
    const [jsTime, setJsTime] = useState<number | null>(null);
    const [perfData, setPerfData] = useState<{ run: number, n: number, avgWasm: number, avgJs: number }[]>([]);

    // Age state
    const [birthYear, setBirthYear] = useState("");
    const [jsAge, setJsAge] = useState<string | null>(null);
    const [wasmAge, setWasmAge] = useState<string | null>(null);

    // Loading WASM functions
    useEffect(() => {
    initWasm().then((exports) => {
        setFibFn(() => exports.fibonacci);
        setCalcAgeFn(() => exports.calculate_age);
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

        setPerfData(prev => [
            ...prev,
            {
                run: prev.length + 1,
                n,
                avgWasm: parseFloat(avgWasm.toFixed(3)),
                avgJs: parseFloat(avgJs.toFixed(3))
            }
        ]);

        // logging to the console for testing
        console.log(`Average WebAssembly time over ${runs} runs for n = ${n}: ${avgWasm.toFixed(3)} ms`);
        console.log(`Average JS time over ${runs} runs for n = ${n}: ${avgJs.toFixed(3)} ms`);
    }

    // Handles age calculation
    const handleCalculateAge = () => {
        const parsed = parseInt(birthYear);
        if (isNaN(parsed)) {
            setJsAge("Invalid input");
            setWasmAge("Invalid input");
            return;
        }

        try {
            setJsAge(jsCalculateAge(parsed));
        } catch (err) {
            setJsAge("JS error: " + err);
        }

        try {
            if (!calcAgeFn) return;
            const result = calcAgeFn(parsed);
            setWasmAge(result);
        } catch (err: any) {
            setWasmAge("WASM error: " + err);
        } 
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
                    onClick={() => setMode("age")}
                    style={{
                        backgroundColor: mode === "age" ? "#ccc" : "#eee"
                    }}
                >
                    Age calculation
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
                    
                    <button onClick={() => setPerfData([])}>Reset Chart</button>

                    {perfData.length > 0 && (
                        <div style={{ marginTop: "2rem" }}>
                            <h3>Performance Chart</h3>
                                <BarChart width={600} height={300} data={perfData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="run" />
                                    <YAxis label={{ value: "Time (ms)", angle: -90, position: 'insideLeft' }} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="avgJs" fill="#8884d8" name="JS Time (ms)" />
                                    <Bar dataKey="avgWasm" fill="#82ca9d" name="WASM Time (ms)" />
                                </BarChart>
                        </div>
                    )}
                    

                </div>
            )}

            {/* Age calculation section */}
            {mode === "age" && (
                <div>
                    <h2>Age calculation</h2>
                    <input
                        type="text"
                        value={birthYear}
                        onChange={(e) => setBirthYear(e.target.value)}
                        placeholder="Enter birth year"
                        style={{ marginRight: "1rem" }}
                    />
                    <button onClick={handleCalculateAge}>Calculate age</button>

                    {jsAge !== null && wasmAge !== null && (
                        <div style={{ marginTop: "1rem" }}>
                            <p>JavaScript: {jsAge}</p>
                            <p>WASM (Rust): {wasmAge}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default App;
