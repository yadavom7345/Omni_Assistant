import { useState, useRef } from 'react';

const PDFUploader = ({ onPDFUploaded, setResponse }) => {
  const [pdfFile, setPdfFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const uploadPdfFile = async (file) => {
    try {
      console.log("Uploading PDF file:", file.name);
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('purpose', 'user_data');
      
      const fileResponse = await fetch('https://api.openai.com/v1/files', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: formData
      });
      
      if (!fileResponse.ok) {
        const errorData = await fileResponse.json();
        throw new Error(`File upload failed: ${errorData.error?.message || 'Unknown error'}`);
      }
      
      const fileData = await fileResponse.json();
      console.log("File uploaded successfully, ID:", fileData.id);
      
      onPDFUploaded(file, fileData.id);
      
      return fileData.id;
    } catch (error) {
      console.error('Error uploading file:', error);
      setResponse(`Error uploading file: ${error.message}`);
      return null;
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      await uploadPdfFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      await uploadPdfFile(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemovePdf = () => {
    setPdfFile(null);
    onPDFUploaded(null, null);
  };

  return {
    pdfFile,
    isDragging,
    fileInputRef,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleFileSelect,
    handleButtonClick,
    handleRemovePdf,
    renderedPDFIndicator: pdfFile && (
      <div className="pdf-indicator">
        <span className="pdf-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="#ff4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7 7H17" stroke="#ff4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7 12H17" stroke="#ff4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7 17H13" stroke="#ff4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
        <span className="pdf-name">{pdfFile.name}</span>
        <button 
          className="remove-pdf-btn"
          onClick={handleRemovePdf}
        >
          ✕
        </button>
      </div>
    )
  };
};

export default PDFUploader; 