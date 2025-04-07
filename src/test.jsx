import { useState } from 'react'

function Test() {
  return (
    <div style={{ 
      backgroundColor: "red", 
      padding: "20px", 
      borderRadius: "10px", 
      color: "white",
      margin: "20px" 
    }}>
      <h2>Test Component</h2>
      <p>If you can see this, React is rendering properly.</p>
      <p>API Key Status: {import.meta.env.VITE_OPENAI_API_KEY ? "API Key is configured" : "No API Key found"}</p>
    </div>
  )
}

export default Test 