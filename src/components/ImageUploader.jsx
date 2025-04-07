import { useState, useRef } from 'react';

const ImageUploader = ({ onImageSelected, setResponse, setLoading }) => {
  const [imageFile, setImageFile] = useState(null);
  const imageInputRef = useRef(null);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      onImageSelected(file);
      console.log("Image selected:", file.name);
    }
  };

  const handleButtonClick = () => {
    imageInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    onImageSelected(null);
  };

  const sendImageToAPI = async (prompt) => {
    if (!imageFile) {
      setResponse("Please select an image first");
      return;
    }
    
    setLoading(true);
    setResponse("Processing your image...");
    
    try {
      // Read the image as base64
      const base64Image = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(imageFile);
      });
      
      // Using the OpenAI API format for images
      const requestBody = {
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt || "What's in this image?" },
              {
                type: "image_url",
                image_url: {
                  url: `data:${imageFile.type};base64,${base64Image}`
                }
              }
            ]
          }
        ]
      };
      
      console.log("Sending image to OpenAI API...");
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API request failed: ${errorData.error?.message || 'Unknown error'}`);
      }
      
      const data = await response.json();
      console.log("Received response from OpenAI:", data);
      setResponse(data.choices[0].message.content);
    } catch (error) {
      console.error('Error processing image:', error);
      setResponse(`Error processing image: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return {
    imageFile,
    imageInputRef,
    handleImageSelect,
    handleButtonClick,
    handleRemoveImage,
    sendImageToAPI,
    renderedImageIndicator: imageFile && (
      <div className="image-indicator">
        <span className="image-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="18" height="18" rx="2" stroke="#4CAF50" strokeWidth="2" />
            <circle cx="8.5" cy="8.5" r="1.5" fill="#4CAF50" />
            <path d="M21 15L16 10L8 18" stroke="#4CAF50" strokeWidth="2" />
            <path d="M3 16L7 12L9 14" stroke="#4CAF50" strokeWidth="2" />
          </svg>
        </span>
        <span className="image-name">{imageFile.name}</span>
        <button 
          className="remove-image-btn"
          onClick={handleRemoveImage}
        >
          ✕
        </button>
      </div>
    )
  };
};

export default ImageUploader; 