import React, { useState, useEffect } from 'react';
import Vapi from '@vapi-ai/web';
import { Mic, MicOff, BookOpen, GraduationCap, Languages, Info } from 'lucide-react';

const vapi = new Vapi('ea003516-4a37-4f23-bb54-72d5b2d5c24b');

const App: React.FC = () => {
  const [isCalling, setIsCalling] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [transcript, setTranscript] = useState("");

  useEffect(() => {
    vapi.on('call-start', () => {
      setIsCalling(true);
      setConnecting(false);
    });

    vapi.on('call-end', () => {
      setIsCalling(false);
      setConnecting(false);
    });

    vapi.on('speech-start', () => {
      console.log('Assistant started speaking');
    });

    vapi.on('message', (message) => {
        if (message.type === 'transcript' && message.transcriptType === 'final') {
            setTranscript(prev => prev + "\n" + message.transcript);
        }
    });

    vapi.on('error', (e) => {
      console.error(e);
      setConnecting(false);
      setIsCalling(false);
    });
  }, []);

  const startTutorSession = () => {
    setConnecting(true);
    vapi.start({
      model: {
        provider: "openai",
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are Swar-Shiksha, an empathetic and patient voice tutor. Your goal is to help students understand complex concepts from their textbooks. Use the search_knowledge_base tool whenever you need specific information. Keep your explanations clear, simple, and encouraging."
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
          }
        ]
      },
      voice: "shimmer",
      transcriber: {
        provider: "deepgram",
        model: "nova-2",
        language: "en"
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
          <button className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
            <Languages size={18} />
            <span>English</span>
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
