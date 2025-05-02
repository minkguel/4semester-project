import { useEffect, useState } from "react";
import { initWasm } from "./wasmBridge";

function App() {
    const [fibFn, setFibFn] = useState<(n: number) => number>();
    const [input, setInput] = useState("20");
    const [result, setResult] = useState<number | null>(null);
    const [timeMs, setTimeMs] = useState<number | null>(null);

    useEffect(() => {
        initWasm().then((fibonacci) => {
            setFibFn(() => fibonacci);
        });
    }, []);

    const handleCompute = () => {
        const n = parseInt(input);
        if (isNaN(n) || n < 0 || !fibFn) return;

        const start = performance.now();
        const output = fibFn(n);
        const end = performance.now();

        setResult(output);
        setTimeMs(end - start);
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h1>WASM fibonacci performance display</h1>

            <input
                type="number"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter a number"
                min={0}
            />
            <button onClick={handleCompute}>Click here to compute</button>

            {result !== null && (
                <div style={{ marginTop: "1rem" }}>
                    <p>
                        fibonacci({input}) = {result}
                    </p>
                    {timeMs !== null && <p>Computed in {timeMs.toFixed(3)} ms</p>}
                </div>
            )}
        </div>
    );
}

export default App;
