/**
 * Service for interacting with the OpenAI API
 */

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const API_BASE_URL = 'https://api.openai.com/v1';

/**
 * Sends a text prompt to the OpenAI API
 * @param {string} prompt - The text prompt
 * @param {string|null} pdfFileId - Optional PDF file ID to include with the prompt
 * @returns {Promise<string>} - The response from the API
 */
export const sendTextPrompt = async (prompt, pdfFileId = null) => {
  if (!prompt.trim()) {
    throw new Error("Prompt cannot be empty");
  }
  
  let requestBody;
  
  if (pdfFileId) {
    requestBody = {
      model: 'gpt-4o',
      messages: [{
        role: 'user',
        content: [
          {
            type: 'file',
            file: {
              file_id: pdfFileId
            }
          },
          {
            type: 'text',
            text: prompt
          }
        ]
      }]
    };
  } else {
    requestBody = {
      model: 'gpt-4o',
      messages: [{
        role: 'user',
        content: prompt
      }]
    };
  }
  
  console.log("Sending request to OpenAI:", JSON.stringify(requestBody));
  
  const response = await fetch(`${API_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(requestBody),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`API request failed: ${errorData.error?.message || 'Unknown error'}`);
  }
  
  const data = await response.json();
  console.log("Received response from OpenAI:", data);
  return data.choices[0].message.content;
};

/**
 * Processes an image with the OpenAI API
 * @param {File} imageFile - The image file to process
 * @param {string} prompt - The prompt to send with the image
 * @returns {Promise<string>} - The response from the API
 */
export const processImageWithOpenAI = async (imageFile, prompt) => {
  if (!imageFile) {
    throw new Error("No image selected");
  }
  
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
  
  const response = await fetch(`${API_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(requestBody)
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`API request failed: ${errorData.error?.message || 'Unknown error'}`);
  }
  
  const data = await response.json();
  console.log("Received response from OpenAI:", data);
  return data.choices[0].message.content;
};

/**
 * Sends an image of a screenshot with a prompt to the OpenAI API
 * @param {string} base64Image - The base64-encoded image data
 * @param {string} text - The text prompt to send with the image
 * @returns {Promise<string>} - The response from the API
 */
export const processScreenshotWithOpenAI = async (base64Image, text) => {
  // Using the OpenAI API format for images
  const requestBody = {
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${base64Image}`
            }
          }
        ]
      }
    ]
  };

  const response = await fetch(`${API_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Vision API request failed: ${errorData.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
};

/**
 * Uploads a PDF file to the OpenAI API
 * @param {File} file - The PDF file to upload
 * @returns {Promise<string>} - The file ID returned by the API
 */
export const uploadPdfToOpenAI = async (file) => {
  if (!file || file.type !== 'application/pdf') {
    throw new Error("Invalid PDF file");
  }
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('purpose', 'user_data');
  
  const fileResponse = await fetch(`${API_BASE_URL}/files`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: formData
  });
  
  if (!fileResponse.ok) {
    const errorData = await fileResponse.json();
    throw new Error(`File upload failed: ${errorData.error?.message || 'Unknown error'}`);
  }
  
  const fileData = await fileResponse.json();
  console.log("File uploaded successfully, ID:", fileData.id);
  return fileData.id;
};

/**
 * Transcribes audio using the OpenAI Whisper API
 * @param {Blob} audioBlob - The audio blob to transcribe
 * @returns {Promise<string>} - The transcribed text
 */
export const transcribeAudioWithWhisper = async (audioBlob) => {
  if (!audioBlob || audioBlob.size === 0) {
    throw new Error("No audio data to transcribe");
  }
  
  // Create a FormData object to send to OpenAI
  const formData = new FormData();
  formData.append('file', audioBlob, 'recording.webm');
  formData.append('model', 'whisper-1');
  formData.append('language', 'en');
  
  // Send to OpenAI Whisper API
  const transcriptionResponse = await fetch(`${API_BASE_URL}/audio/transcriptions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: formData
  });
  
  if (!transcriptionResponse.ok) {
    const errorData = await transcriptionResponse.json();
    throw new Error(`Transcription failed: ${errorData.error?.message || 'Unknown error'}`);
  }
  
  const transcriptionData = await transcriptionResponse.json();
  return transcriptionData.text.trim();
};

export default {
  sendTextPrompt,
  processImageWithOpenAI,
  processScreenshotWithOpenAI,
  uploadPdfToOpenAI,
  transcribeAudioWithWhisper
}; 