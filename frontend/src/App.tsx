import React, { useState, useEffect, useRef } from 'react';
import Vapi from '@vapi-ai/web';
import { Mic, MicOff, BookOpen, GraduationCap, Languages, Info, Upload, X, CheckCircle } from 'lucide-react';

const vapi = new Vapi('ea003516-4a37-4f23-bb54-72d5b2d5c24b');

const App: React.FC = () => {
  const [isCalling, setIsCalling] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  
  // Upload State
  const [showUpload, setShowUpload] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [subject, setSubject] = useState("General");

  useEffect(() => {
    // ... (rest of the effect)
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileInputRef.current?.files?.[0]) return;

    setIsUploading(true);
    setUploadStatus(null);
    
    const formData = new FormData();
    formData.append('file', fileInputRef.current.files[0]);
    formData.append('subject', subject);

    try {
      const response = await fetch('http://localhost:8000/upload-textbook', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      if (response.ok) {
        setUploadStatus({ message: `Success: ${data.message}`, type: 'success' });
        setTimeout(() => setShowUpload(false), 2000);
      } else {
        setUploadStatus({ message: `Error: ${data.detail}`, type: 'error' });
      }
    } catch (error) {
      setUploadStatus({ message: "Failed to connect to backend", type: 'error' });
    } finally {
      setIsUploading(false);
    }
  };

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'hi' : 'en'));
  };

  const startTutorSession = () => {
    setConnecting(true);
    vapi.start({
      model: {
        provider: "openai",
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are Swar-Shiksha, an empathetic and patient voice tutor. Your goal is to help students understand complex concepts from their textbooks. Use the search_knowledge_base tool whenever you need specific information. Keep your explanations clear, simple, and encouraging. Respond in ${language === 'en' ? 'English' : 'Hindi'}.`
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "search_knowledge_base",
              description: "Search for educational content from textbooks stored in the vector database.",
              parameters: {
                type: "object",
                properties: {
                  query: { type: "string" }
                }
              }
            },
            server: {
              url: "https://YOUR_NGROK_URL.ngrok-free.app/vapi-webhook"
            }
          },
          {
            type: "function",
            function: {
              name: "generate_quiz",
              description: "Generate a quiz for the student on a specific topic.",
              parameters: {
                type: "object",
                properties: {
                  topic: { type: "string" }
                }
              }
            },
            server: {
              url: "https://YOUR_NGROK_URL.ngrok-free.app/vapi-webhook"
            }
          }
        ]
      },
      voice: language === 'en' ? "shimmer" : "shimmer", // shimmer works well for both, or use a specific hindi voice
      transcriber: {
        provider: "deepgram",
        model: "nova-2",
        language: language
      }
    });
  };

  const stopTutorSession = () => {
    vapi.stop();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <GraduationCap className="text-white" size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800">Swar-Shiksha</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors bg-slate-100 px-3 py-1.5 rounded-full"
          >
            <Languages size={18} />
            <span>{language === 'en' ? 'Hindi' : 'English'}</span>
          </button>
          <div className="h-6 w-px bg-slate-200"></div>
          <button className="p-2 text-slate-400 hover:text-slate-600">
            <Info size={20} />
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full p-6 flex flex-col">
        <div className="mt-8 text-center mb-12">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Your Personal Voice AI Tutor</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Experience inclusive learning through natural conversation. Ask questions, explore textbooks, and master concepts hands-free.
          </p>
        </div>

        {/* Interaction Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden flex flex-col transition-all duration-300">
          <div className="p-8 flex flex-col items-center justify-center space-y-8">
            {/* Visualizer Placeholder */}
            <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 ${isCalling ? 'bg-indigo-100 scale-110' : 'bg-slate-100'}`}>
              <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 ${isCalling ? 'bg-indigo-600 animate-pulse' : 'bg-slate-300'}`}>
                {isCalling ? <Mic className="text-white" size={40} /> : <MicOff className="text-slate-500" size={40} />}
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-2xl font-bold text-slate-800">
                {connecting ? "Establishing Connection..." : isCalling ? "Swar-Shiksha is Listening" : "Ready to Start?"}
              </h3>
              <p className="text-slate-500 mt-2">
                {isCalling ? "Go ahead, ask a question about your studies." : "Click the button below to start your interactive study session."}
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={isCalling ? stopTutorSession : startTutorSession}
                disabled={connecting}
                className={`px-10 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg active:scale-95 ${
                  isCalling 
                  ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-200' 
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
                } ${connecting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {connecting ? "Connecting..." : isCalling ? "End Session" : "Start Learning Now"}
              </button>

              {!isCalling && (
                <button
                  onClick={() => setShowUpload(true)}
                  className="px-6 py-4 rounded-2xl font-bold text-lg bg-white border-2 border-slate-200 text-slate-600 hover:border-indigo-600 hover:text-indigo-600 transition-all flex items-center gap-2"
                >
                  <Upload size={20} />
                  <span>Upload</span>
                </button>
              )}
            </div>
          </div>

          {/* Transcript/Log Area */}
          {isCalling && (
            <div className="bg-slate-900 p-6 text-slate-300 font-mono text-sm h-48 overflow-y-auto">
              <div className="flex items-center gap-2 mb-2 text-indigo-400 font-bold border-b border-slate-800 pb-2">
                <BookOpen size={16} />
                <span>SESSION TRANSCRIPT</span>
              </div>
              <div className="whitespace-pre-wrap italic opacity-80">
                {transcript || "Waiting for speech..."}
              </div>
            </div>
          )}
        </div>

        {/* Upload Modal */}
        {showUpload && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-800">Upload Textbook</h3>
                <button onClick={() => setShowUpload(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleUpload} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Subject / Title</label>
                  <input 
                    type="text" 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. Science, History"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">PDF File</label>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    accept=".pdf"
                    className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    required
                  />
                </div>
                
                {uploadStatus && (
                  <div className={`p-4 rounded-xl flex items-center gap-2 text-sm ${uploadStatus.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                    {uploadStatus.type === 'success' ? <CheckCircle size={18} /> : <X size={18} />}
                    {uploadStatus.message}
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={isUploading}
                  className={`w-full py-3 rounded-xl font-bold text-white transition-all ${isUploading ? 'bg-slate-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                >
                  {isUploading ? "Processing..." : "Start Ingestion"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="text-indigo-600 mb-3"><BookOpen size={24} /></div>
            <h4 className="font-bold mb-1">RAG Powered</h4>
            <p className="text-sm text-slate-500">Retrieves real-time answers directly from your specific textbooks.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="text-indigo-600 mb-3"><Languages size={24} /></div>
            <h4 className="font-bold mb-1">Multilingual</h4>
            <p className="text-sm text-slate-500">Supports Hindi and English to bridge the regional language gap.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="text-indigo-600 mb-3"><Mic size={24} /></div>
            <h4 className="font-bold mb-1">Voice First</h4>
            <p className="text-sm text-slate-500">Designed for accessibility, ensuring no student is left behind.</p>
          </div>
        </div>
      </main>

      <footer className="py-8 text-center text-slate-400 text-sm">
        &copy; 2024 Swar-Shiksha AI. Built for HackBLR.
      </footer>
    </div>
  );
};

export default App;
