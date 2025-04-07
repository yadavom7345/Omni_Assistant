import { useState } from 'react';
import { sendTextPrompt } from '../services/apiService';

const PromptInput = ({ setResponse, setLoading, pdfFileId, handleScreenshotRequest }) => {
  const [prompt, setPrompt] = useState('');

  const handleChange = (e) => {
    setPrompt(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setResponse('');
    
    try {
      if (prompt.toLowerCase().includes('screen')) {
        await handleScreenshotRequest(prompt);
        return;
      }
      
      const responseContent = await sendTextPrompt(prompt, pdfFileId);
      setResponse(responseContent);
    } catch (error) {
      console.error('Error:', error);
      setResponse(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return {
    prompt,
    setPrompt,
    handleChange,
    handleKeyDown,
    handleSubmit,
    renderedInput: (
      <input
        type="text"
        value={prompt}
        onChange={handleChange}
        placeholder="Ask a question..."
        onKeyDown={handleKeyDown}
      />
    )
  };
};

export default PromptInput; 