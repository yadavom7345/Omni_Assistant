import { useCallback } from 'react';
import ScreenshotCapture from './ScreenshotCapture';
import { processScreenshotWithOpenAI } from '../services/apiService';

const ScreenshotHandler = ({ setResponse, setLoading }) => {
  const { takeScreenshot } = ScreenshotCapture();

  const handleScreenshotRequest = useCallback(async (text) => {
    try {
      setResponse("Taking a screenshot... Please select your screen when prompted.");
      const base64Image = await takeScreenshot();
      
      setLoading(true);
      setResponse("Processing your screenshot...");
      
      const responseContent = await processScreenshotWithOpenAI(base64Image, text);
      setResponse(responseContent);
    } catch (error) {
      console.error('Error processing screenshot:', error);
      setResponse(`Error processing screenshot: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [takeScreenshot, setResponse, setLoading]);

  return { handleScreenshotRequest };
};

export default ScreenshotHandler; 