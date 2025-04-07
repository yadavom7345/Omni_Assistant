import { useState, useCallback } from 'react';
import apiService from '../services/apiService';

/**
 * Custom hook for making OpenAI API calls with loading and error state management
 */
const useOpenAI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendPrompt = useCallback(async (prompt, pdfFileId = null) => {
    if (!prompt.trim()) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.sendTextPrompt(prompt, pdfFileId);
      return response;
    } catch (err) {
      setError(err.message);
      console.error('Error sending prompt:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const processImage = useCallback(async (imageFile, prompt) => {
    if (!imageFile) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.processImageWithOpenAI(imageFile, prompt);
      return response;
    } catch (err) {
      setError(err.message);
      console.error('Error processing image:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const processScreenshot = useCallback(async (base64Image, text) => {
    if (!base64Image) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.processScreenshotWithOpenAI(base64Image, text);
      return response;
    } catch (err) {
      setError(err.message);
      console.error('Error processing screenshot:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadPdf = useCallback(async (file) => {
    if (!file || file.type !== 'application/pdf') return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const fileId = await apiService.uploadPdfToOpenAI(file);
      return fileId;
    } catch (err) {
      setError(err.message);
      console.error('Error uploading PDF:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const transcribeAudio = useCallback(async (audioBlob) => {
    if (!audioBlob || audioBlob.size === 0) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const transcription = await apiService.transcribeAudioWithWhisper(audioBlob);
      return transcription;
    } catch (err) {
      setError(err.message);
      console.error('Error transcribing audio:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    sendPrompt,
    processImage,
    processScreenshot,
    uploadPdf,
    transcribeAudio
  };
};

export default useOpenAI; 