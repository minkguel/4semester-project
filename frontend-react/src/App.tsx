import { useEffect, useState } from "react";
import { initWasm } from "./wasmBridge";

function App() {
    const [result, setResult] = useState<number | null>(null);

    useEffect(() => {
        initWasm().then((fibonacci) => {
            setResult(fibonacci(10));
        });
    }, []);

    return (
        <div>
            <h1>Fibonacci from WASM</h1>
            <p>fibonacci(10) = {result}</p>
        </div>
    );
}

export default App;
