# AI Assistant React Application

A React application that captures voice input, processes PDF files and images, and interacts with OpenAI's GPT-4o model.

## Features

- Voice recording and transcription using OpenAI's Whisper API
- PDF file uploading and analysis
- Image uploading and analysis
- Screenshot capture and analysis
- Text-based prompts to OpenAI's GPT-4o model

## Application Architecture

The application has been structured in a component-based way for better maintainability and readability.

### Directory Structure

```
src/
├── components/     # UI components
│   ├── VoiceRecorder.jsx
│   ├── PDFUploader.jsx
│   ├── ImageUploader.jsx
│   ├── ScreenshotHandler.jsx
│   └── PromptInput.jsx
├── services/       # API interaction services
│   └── apiService.js
├── hooks/          # Custom React hooks
│   └── useOpenAI.js
├── App.jsx         # Main application component
└── ...
```

### Component Breakdown

#### App.jsx
The main application component that orchestrates all other components and manages the global state.

#### Components

- **VoiceRecorder**: Handles the voice recording functionality, sending audio to Whisper API for transcription.
- **PDFUploader**: Manages PDF file uploading, including drag-and-drop functionality and file selection.
- **ImageUploader**: Handles image selection and uploading for analysis.
- **ScreenshotHandler**: Manages the screenshot capture functionality and processing.
- **PromptInput**: Handles text input and sending requests to the OpenAI API.

#### Services

- **apiService.js**: Centralizes all API calls to OpenAI, including prompt sending, image processing, and audio transcription.

#### Hooks

- **useOpenAI.js**: A custom hook that encapsulates OpenAI API interactions with loading and error state management.

## Setup and Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file with your OpenAI API key:
   ```
   VITE_OPENAI_API_KEY=your_api_key_here
   ```
4. Start the development server:
   ```
   npm run dev
   ```

## Usage

- Click the microphone button to start voice recording
- Upload PDF files to analyze them with AI
- Upload images to analyze them with AI
- Type text prompts and send them to the AI
- Use the keyword "screen" to capture and analyze a screenshot

## Technologies Used

- React
- Vite
- OpenAI API (GPT-4o)
- Web Speech API
- Canvas API for screenshots
