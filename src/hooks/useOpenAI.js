import { useState, useCallback } from 'react';
import apiService from '../services/apiService';

/**
 * Custom hook for making OpenAI API calls with loading and error state management
 */
const useOpenAI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendPrompt = useCallback(async (prompt, pdfFileId = null) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.sendTextPrompt(prompt, pdfFileId);
      return response;
    } catch (err) {
      setError(err.message || 'An error occurred');
      console.error('Error sending prompt:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const processImage = useCallback(async (imageFile, prompt) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.processImageWithOpenAI(imageFile, prompt);
      return response;
    } catch (err) {
      setError(err.message || 'An error occurred');
      console.error('Error processing image:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const processScreenshot = useCallback(async (base64Image, text) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.processScreenshotWithOpenAI(base64Image, text);
      return response;
    } catch (err) {
      setError(err.message || 'An error occurred');
      console.error('Error processing screenshot:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadPdf = useCallback(async (file) => {
    setLoading(true);
    setError(null);
    
    try {
      const fileId = await apiService.uploadPdfToOpenAI(file);
      return fileId;
    } catch (err) {
      setError(err.message || 'An error occurred');
      console.error('Error uploading PDF:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const transcribeAudio = useCallback(async (audioBlob) => {
    setLoading(true);
    setError(null);
    
    try {
      const transcription = await apiService.transcribeAudioWithWhisper(audioBlob);
      return transcription;
    } catch (err) {
      setError(err.message || 'An error occurred');
      console.error('Error transcribing audio:', err);
      throw err;
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