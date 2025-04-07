import { useCallback } from 'react';

const ScreenshotCapture = () => {
  const takeScreenshot = useCallback(async () => {
    try {
      // Use the Screen Capture API to capture the entire screen
      const stream = await navigator.mediaDevices.getDisplayMedia({ 
        video: {
          displaySurface: 'monitor', // Explicitly request the entire screen
          cursor: 'always',
          logicalSurface: true
        }
      });
      
      // Create video element to capture the stream
      const video = document.createElement('video');
      video.srcObject = stream;
      
      // Wait for the video to be ready
      return new Promise((resolve, reject) => {
        video.onloadedmetadata = () => {
          video.play();
          
          // Create canvas with the video dimensions
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          
          // Draw the video frame to canvas
          const context = canvas.getContext('2d');
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          // Stop all tracks to end screen sharing
          stream.getTracks().forEach(track => track.stop());
          
          // Convert to base64
          const base64Image = canvas.toDataURL('image/jpeg').split(',')[1];
          resolve(base64Image);
        };
        
        video.onerror = () => {
          stream.getTracks().forEach(track => track.stop());
          reject(new Error('Failed to load video'));
        };
      });
    } catch (error) {
      console.error('Error taking screenshot:', error);
      throw error;
    }
  }, []);

  return { takeScreenshot };
};

export default ScreenshotCapture; 