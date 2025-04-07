import { useState } from 'react'
import './App.css'
import VoiceRecorder from './components/VoiceRecorder'
import PDFUploader from './components/PDFUploader'
import ImageUploader from './components/ImageUploader'
import ScreenshotHandler from './components/ScreenshotHandler'
import PromptInput from './components/PromptInput'

function App() {
  const [prompt, setPrompt] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [pdfFile, setPdfFile] = useState(null)
  const [pdfFileId, setPdfFileId] = useState(null)
  const [imageFile, setImageFile] = useState(null)

  const handleTranscriptionComplete = (transcription) => {
    setPrompt(prev => {
      const separator = prev.trim() ? ' ' : '';
      return prev + separator + transcription;
    });
    
    setResponse(`Transcribed: "${transcription}"`);
    
    if (transcription.toLowerCase().includes('screen')) {
      screenshotHandler.handleScreenshotRequest(transcription);
    }
  };

  const handlePDFUploaded = (file, fileId) => {
    setPdfFile(file);
    setPdfFileId(fileId);
  };

  const handleImageSelected = (file) => {
    setImageFile(file);
  };

  const pdfUploader = PDFUploader({
    onPDFUploaded: handlePDFUploaded,
    setResponse
  });

  const imageUploader = ImageUploader({
    onImageSelected: handleImageSelected,
    setResponse,
    setLoading
  });

  const screenshotHandler = ScreenshotHandler({
    setResponse,
    setLoading
  });

  const promptInput = PromptInput({
    setResponse,
    setLoading,
    pdfFileId,
    handleScreenshotRequest: screenshotHandler.handleScreenshotRequest
  });

  if (prompt !== promptInput.prompt) {
    setPrompt(promptInput.prompt);
  }

  return (
    <div 
      className="app"
      onDrop={pdfUploader.handleDrop}
      onDragOver={pdfUploader.handleDragOver}
      onDragLeave={pdfUploader.handleDragLeave}
    >
      {pdfUploader.isDragging && (
        <div className="drag-overlay">
          <div className="drag-message">
            Drop your PDF file here
          </div>
        </div>
      )}
      
      <h1>-_oo_-</h1>
      
      <div className="prompt_box">
        {pdfUploader.renderedPDFIndicator}
        {imageUploader.renderedImageIndicator}
        
        <div className="input-group">
          <VoiceRecorder 
            onTranscriptionComplete={handleTranscriptionComplete} 
            setResponse={setResponse} 
          />
          
          {promptInput.renderedInput}
          
          <input
            type="file"
            ref={pdfUploader.fileInputRef}
            onChange={pdfUploader.handleFileSelect}
            accept=".pdf"
            style={{ display: 'none' }}
          />
          
          <input
            type="file"
            ref={imageUploader.imageInputRef}
            onChange={imageUploader.handleImageSelect}
            accept="image/*"
            style={{ display: 'none' }}
          />
          
          <button 
            onClick={pdfUploader.handleButtonClick}
          >
            Attach PDF
          </button>
          
          <button 
            onClick={imageUploader.handleButtonClick}
            className="attach-image-btn"
          >
            Attach Image
          </button>
          
          <button 
            onClick={imageFile ? () => imageUploader.sendImageToAPI(prompt) : promptInput.handleSubmit}
            className="send-btn"
          >
            Send
          </button>
        </div>
      </div>

      {loading && <div className="loading">Loading...</div>}
      
      {response && (
        <div className="response-box">
          {response}
        </div>
      )}
    </div>
  )
}

export default App
