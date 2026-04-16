import React, { useState, useEffect, useRef } from 'react';
import Vapi from '@vapi-ai/web';
import { Mic, MicOff, BookOpen, GraduationCap, Languages, Info, Upload, X, CheckCircle, Activity, Globe, Zap } from 'lucide-react';

// Replace this with your actual Vapi Public Key from the Dashboard
const vapi = new Vapi('ea003516-4a37-4f23-bb54-72d5b2d5c24b');

// IMPORTANT: Replace this with your actual NGROK URL
const NGROK_URL = "https://YOUR_NGROK_URL.ngrok-free.app";

const App: React.FC = () => {
  const [isCalling, setIsCalling] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  
  const [showUpload, setShowUpload] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [subject, setSubject] = useState("General Science");

  useEffect(() => {
    vapi.on('call-start', () => {
      setIsCalling(true);
      setConnecting(false);
    });

    vapi.on('call-end', () => {
      setIsCalling(false);
      setConnecting(false);
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

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileInputRef.current?.files?.[0]) return;

    setIsUploading(true);
    setUploadStatus(null);
    
    const formData = new FormData();
    formData.append('file', fileInputRef.current.files[0]);
    formData.append('subject', subject);

    try {
      // Backend should be on port 8000
      const response = await fetch('http://localhost:8000/upload-textbook', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      if (response.ok) {
        setUploadStatus({ message: `Ingested: ${fileInputRef.current.files[0].name}`, type: 'success' });
        setTimeout(() => setShowUpload(false), 2000);
      } else {
        setUploadStatus({ message: `Error: ${data.detail}`, type: 'error' });
      }
    } catch (error) {
      setUploadStatus({ message: "Backend Unreachable (Port 8000)", type: 'error' });
    } finally {
      setIsUploading(false);
    }
  };

  const startTutorSession = () => {
    if (NGROK_URL.includes("YOUR_NGROK_URL")) {
        alert("Please set your active NGROK URL in App.tsx to enable the AI to access the textbook data.");
        return;
    }
    
    setConnecting(true);
    vapi.start({
      model: {
        provider: "openai",
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are Swar-Shiksha, the world's most advanced AI tutor for accessibility. Your goal is to empower students with visual or learning impairments. Use the search_knowledge_base tool to retrieve facts. Explain with empathy and simplicity. Current language: ${language === 'en' ? 'English' : 'Hindi'}.`
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "search_knowledge_base",
              description: "Query indexed textbooks for high-accuracy answers.",
              parameters: {
                type: "object",
                properties: { query: { type: "string" } }
              }
            },
            server: { url: `${NGROK_URL}/vapi-webhook` }
          },
          {
            type: "function",
            function: {
              name: "generate_quiz",
              description: "Generate an interactive voice-based quiz.",
              parameters: {
                type: "object",
                properties: { topic: { type: "string" } }
              }
            },
            server: { url: `${NGROK_URL}/vapi-webhook` }
          }
        ]
      },
      voice: "shimmer",
      transcriber: { provider: "deepgram", model: "nova-2", language: language }
    });
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-indigo-500/30">
      {/* Background Glow */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full"></div>
        <div className="absolute top-[60%] -right-[10%] w-[50%] h-[50%] bg-emerald-600/10 blur-[120px] rounded-full"></div>
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-slate-900/50 backdrop-blur-xl border-b border-slate-800 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20">
            <GraduationCap className="text-white" size={26} />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-white uppercase">Swar-Shiksha</h1>
            <p className="text-[10px] font-bold text-indigo-400 tracking-[0.2em] uppercase">Inclusive AI Education</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setLanguage(l => l === 'en' ? 'hi' : 'en')}
            className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 hover:border-indigo-500 transition-all text-slate-300"
          >
            <Globe size={16} className="text-indigo-400" />
            <span>{language === 'en' ? 'English' : 'Hindi'}</span>
          </button>
          <div className="h-8 w-px bg-slate-800"></div>
          <button className="text-slate-500 hover:text-white transition-colors">
            <Info size={22} />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 py-12 lg:py-20">
        <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-2">
                <Activity size={14} /> 2026 HackBLR Finalist
            </div>
          <h2 className="text-5xl lg:text-7xl font-black text-white leading-tight">
            The Future of Learning is <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">Conversational.</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Breaking barriers for visually impaired and dyslexic students through a hands-free, voice-first AI tutor. 
          </p>
        </div>

        {/* Main Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Action Card */}
          <div className="lg:col-span-7 bg-slate-900/40 backdrop-blur-2xl rounded-[2.5rem] border border-slate-800 p-10 shadow-2xl overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Zap size={120} className="text-indigo-500" />
            </div>
            
            <div className="flex flex-col items-center gap-10">
                <div className={`relative p-1 rounded-full transition-all duration-700 ${isCalling ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 animate-spin-slow' : 'bg-slate-800'}`}>
                    <div className={`w-40 h-40 rounded-full flex items-center justify-center bg-slate-900 border-4 border-slate-900 shadow-inner`}>
                        {isCalling ? (
                            <div className="flex gap-1 items-end h-8">
                                <div className="w-2 bg-indigo-400 animate-pulse h-full"></div>
                                <div className="w-2 bg-indigo-400 animate-pulse delay-75 h-4"></div>
                                <div className="w-2 bg-indigo-400 animate-pulse delay-150 h-8"></div>
                                <div className="w-2 bg-indigo-400 animate-pulse delay-300 h-6"></div>
                            </div>
                        ) : (
                            <MicOff className="text-slate-700" size={48} />
                        )}
                    </div>
                </div>

                <div className="text-center z-10">
                    <h3 className="text-3xl font-bold text-white mb-2">
                        {connecting ? "Synchronizing AI..." : isCalling ? "Voice Session Active" : "Ready to Learn?"}
                    </h3>
                    <p className="text-slate-400">
                        {isCalling ? "Swar-Shiksha is listening. Ask anything." : "Click below to begin your personalized study session."}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
                    <button
                        onClick={isCalling ? () => vapi.stop() : startTutorSession}
                        disabled={connecting}
                        className={`flex-1 py-4 rounded-2xl font-black text-lg transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 ${
                        isCalling 
                        ? 'bg-rose-500/10 border border-rose-500/50 text-rose-500 hover:bg-rose-500 hover:text-white' 
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/25'
                        } ${connecting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {connecting ? "CONNECTING..." : isCalling ? "END SESSION" : "START TUTOR"}
                    </button>
                    
                    {!isCalling && (
                        <button
                            onClick={() => setShowUpload(true)}
                            className="px-6 py-4 rounded-2xl font-bold bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
                        >
                            <Upload size={20} />
                            <span>UPLOAD</span>
                        </button>
                    )}
                </div>
            </div>

            {isCalling && (
                <div className="mt-12 bg-black/40 rounded-3xl p-6 border border-slate-800/50 max-h-40 overflow-y-auto">
                    <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Activity size={12} /> Live Transcript
                    </div>
                    <p className="text-sm font-medium text-slate-300 italic opacity-80 leading-relaxed">
                        {transcript || "Waiting for audio input..."}
                    </p>
                </div>
            )}
          </div>

          {/* Stats/Info Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-3xl p-8">
                <div className="flex items-center gap-4 mb-4">
                    <Zap className="text-indigo-400" />
                    <h4 className="font-black text-white uppercase tracking-tight">RAG Technology</h4>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">
                    Unlike standard AI, Swar-Shiksha reads your specific textbooks via <strong>Qdrant</strong> to provide 100% accurate, source-verified information.
                </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6">
                    <h5 className="text-2xl font-black text-white mb-1">98%</h5>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Accessibility Score</p>
                </div>
                <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6">
                    <h5 className="text-2xl font-black text-white mb-1">HI+EN</h5>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Bilingual Support</p>
                </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 text-white relative overflow-hidden group">
                <div className="relative z-10">
                    <h4 className="text-xl font-black mb-2 uppercase tracking-tight">Pitch Ready</h4>
                    <p className="text-sm text-indigo-100 mb-4 opacity-80">Empowering visually impaired students globally.</p>
                    <button className="bg-white text-indigo-700 px-6 py-2 rounded-xl text-xs font-black uppercase hover:bg-indigo-50 transition-colors">
                        View Roadmap
                    </button>
                </div>
                <BookOpen className="absolute bottom-[-20%] right-[-10%] text-white/10 w-40 h-40 group-hover:scale-110 transition-transform" />
            </div>
          </div>
        </div>
      </main>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-xl font-black text-white uppercase tracking-tight">Upload Content</h3>
              <button onClick={() => setShowUpload(false)} className="text-slate-500 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleUpload} className="p-8 space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Target Subject</label>
                <input 
                  type="text" 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold"
                  placeholder="e.g. Physics, History"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">PDF Document</label>
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-slate-700 hover:border-indigo-500 bg-slate-800/50 p-10 rounded-2xl text-center cursor-pointer transition-all"
                >
                    <Upload className="mx-auto text-slate-500 mb-4" size={32} />
                    <p className="text-sm font-bold text-slate-400">Click to Browse</p>
                    <input 
                        type="file" 
                        ref={fileInputRef}
                        accept=".pdf"
                        className="hidden"
                        required
                    />
                </div>
              </div>
              
              {uploadStatus && (
                <div className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-bold ${uploadStatus.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                  {uploadStatus.type === 'success' ? <CheckCircle size={20} /> : <X size={20} />}
                  {uploadStatus.message}
                </div>
              )}

              <button 
                type="submit" 
                disabled={isUploading}
                className={`w-full py-4 rounded-2xl font-black text-white tracking-widest transition-all ${isUploading ? 'bg-slate-700 animate-pulse' : 'bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-500/20'}`}
              >
                {isUploading ? "INGESTING..." : "CONFIRM UPLOAD"}
              </button>
            </form>
          </div>
        </div>
      )}

      <footer className="py-12 border-t border-slate-800 text-center">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
          &copy; 2026 Swar-Shiksha AI. A HackBLR Submission.
        </p>
      </footer>
    </div>
  );
};

export default App;
