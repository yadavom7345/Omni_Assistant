import { useState, useRef, useEffect } from 'react';

const VoiceRecorder = ({ onTranscriptionComplete, setResponse }) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  
  // Cleanup function
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      chunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100
        }
      });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
      });
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        // Process the recording only if we have data
        if (chunksRef.current.length > 0) {
          setResponse("Processing your voice recording...");
          
          try {
            // Create a blob from audio chunks
            const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
            
            // Check blob size
            console.log(`Audio size: ${audioBlob.size / 1024} KB`);
            
            // Create a FormData object to send to OpenAI
            const formData = new FormData();
            formData.append('file', audioBlob, 'recording.webm');
            formData.append('model', 'whisper-1');
            formData.append('language', 'en');
            
            // Send to OpenAI Whisper API
            const transcriptionResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
              },
              body: formData
            });
            
            if (!transcriptionResponse.ok) {
              const errorData = await transcriptionResponse.json();
              throw new Error(`Transcription failed: ${errorData.error?.message || 'Unknown error'}`);
            }
            
            const transcriptionData = await transcriptionResponse.json();
            const transcription = transcriptionData.text.trim();
            
            // Send transcription to parent component
            if (transcription) {
              onTranscriptionComplete(transcription);
            } else {
              setResponse("No speech detected. Please try again.");
            }
          } catch (error) {
            console.error('Error transcribing audio:', error);
            setResponse(`Error processing audio: ${error.message}`);
          }
        } else {
          setResponse("No audio recorded. Please try again.");
        }
        
        // Stop all tracks to properly release the microphone
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setResponse("Recording... Speak clearly and press the microphone button again when finished.");
      
    } catch (error) {
      console.error('Error starting recording:', error);
      
      if (error.name === 'NotAllowedError') {
        setResponse("Microphone access denied. Please allow microphone access in your browser settings.");
      } else {
        setResponse(`Error starting recording: ${error.message}`);
      }
      
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <button 
      className={`voice-btn ${isRecording ? 'recording' : ''}`}
      onClick={isRecording ? stopRecording : startRecording}
      title={isRecording ? "Stop recording" : "Start voice command"}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C10.3431 2 9 3.34315 9 5V12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12V5C15 3.34315 13.6569 2 12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M19 10V12C19 15.866 15.866 19 12 19C8.13401 19 5 15.866 5 12V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 19V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 22H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
};

export default VoiceRecorder; 