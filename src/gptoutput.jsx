import { useState, useEffect } from 'react';
import askgpt from './askgpt.mjs';

function GptOutput({whattoask, shouldFetch, onFetchComplete}) {
    const [opt, setOpt] = useState("Enter a prompt and click Ask");
    const [loading, setLoading] = useState(false);

    async function ans() {
        if (!whattoask) {
            onFetchComplete && onFetchComplete();
            return;
        }
        
        try {
            setLoading(true);
            const response = await askgpt({prompt: whattoask});
            setOpt(response);
        } catch (error) {
            console.error("API Error:", error);
            setOpt("Error: " + (error.message || "Failed to get response"));
        } finally {
            setLoading(false);
            onFetchComplete && onFetchComplete();
        }
    }

    useEffect(() => {
        if (shouldFetch) {
            ans();
        }
    }, [shouldFetch, whattoask]);

    return (
        <div style={{backgroundColor: "rgb(70, 70, 70)", color: "white", padding: "20px", borderRadius: "20px", marginTop: "20px"}}>
            <h2>Output</h2>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <p>{opt}</p>
            )}
        </div>
    )
}

export default GptOutput;