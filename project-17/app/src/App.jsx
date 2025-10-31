import React, { useState, useEffect, useRef } from "react";
import { FiMic, FiMicOff, FiCopy } from "react-icons/fi";

const App = () => {
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const finalTranscriptRef = useRef("");

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in your browser!");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalTranscriptRef.current += transcript + " ";
        } else {
          interimTranscript += transcript;
        }
      }

      setText(finalTranscriptRef.current + interimTranscript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      if (isListening) {
        recognition.start();
      }
    };

    recognitionRef.current = recognition;
  }, [isListening]);

  const startListening = () => {
    if (recognitionRef.current) {
      finalTranscriptRef.current = "";
      setText("");
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-6">🎙️ Voice to Text Converter</h1>

      <div className="w-full max-w-2xl bg-gray-800 rounded-2xl shadow-lg p-6">
        <textarea
          className="w-full h-64 p-4 bg-gray-700 text-white rounded-lg resize-none focus:outline-none"
          value={text}
          readOnly
          placeholder="Speak something..."
        />

        <div className="flex justify-center mt-4 gap-6">
          {!isListening ? (
            <button
              onClick={startListening}
              className="bg-green-600 px-6 py-3 rounded-full flex items-center gap-2 hover:bg-green-700 transition"
            >
              <FiMic /> Start
            </button>
          ) : (
            <button
              onClick={stopListening}
              className="bg-red-600 px-6 py-3 rounded-full flex items-center gap-2 hover:bg-red-700 transition"
            >
              <FiMicOff /> Stop
            </button>
          )}

          <button
            onClick={copyToClipboard}
            className="bg-blue-600 px-6 py-3 rounded-full flex items-center gap-2 hover:bg-blue-700 transition"
          >
            <FiCopy /> Copy
          </button>
        </div>
      </div>

      <p className="text-gray-400 mt-4 text-sm">
        ⚡ Fast & Reliable Speech-to-Text using React + Web Speech API
      </p>
    </div>
  );
};

export default App;
