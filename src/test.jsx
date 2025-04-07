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
      <p>Current API Key: {import.meta.env.VITE_OPENAI_API_KEY ? "API Key exists (starts with " + import.meta.env.VITE_OPENAI_API_KEY.substring(0, 10) + "...)" : "No API Key found"}</p>
    </div>
  )
}

export default Test 