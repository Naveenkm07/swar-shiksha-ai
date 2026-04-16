# Swar-Shiksha (स्वर-शिक्षा) 🎙️
### *Empowering the Visually Impaired through Voice-First AI*

[![HackBLR 2026](https://img.shields.io/badge/HackBLR-2026-indigo.svg)](https://hackblr.in)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](https://opensource.org/licenses/MIT)

**Swar-Shiksha** is a high-impact AI tutor designed for **Accessibility & Societal Impact (PS-3)**. It transforms static, inaccessible textbooks into interactive, bilingual voice conversations, specifically built for the 2.2 billion people worldwide living with vision impairment.

---

## 🌟 Vision
"Technology is only as powerful as it is inclusive." Swar-Shiksha ensures that students with visual impairments, dyslexia, or low-literacy levels can master any subject through simple, natural conversation—completely hands-free.

## 🔥 Key Differentiators (The Edge)
*   **Zero Hallucination RAG:** Powered by **Qdrant**, our agent only speaks facts retrieved directly from indexed textbooks.
*   **Vision Narrator:** Uses **GPT-4o Vision** to describe complex educational diagrams and graphs that standard screen readers ignore.
*   **Bilingual Mastery:** Seamlessly bridges the regional language gap by tutoring in both **Hindi and English**.
*   **Voice-Driven Quizzes:** Active learning assessments triggered and answered entirely via voice.

---

## 📦 Core Features
- **Semantic Textbook Search:** Ask, "Explain the first law of thermodynamics," and the agent retrieves the exact context.
- **Dynamic PDF Ingestion:** A streamlined dashboard for teachers to upload and index new curriculum in seconds.
- **Context-Aware Chunking:** Paragraph-intelligent processing ensures tutoring remains coherent and logical.
- **Ultra-Low Latency:** Optimized with **Vapi.ai** and **Deepgram** for near-instant human-like responses.

## 🛠️ Tech Stack
| Layer | Technology |
| :--- | :--- |
| **Voice Interface** | Vapi.ai (Real-time AI SDK) |
| **Vector Engine** | Qdrant (Knowledge Retrieval & Memory) |
| **Reasoning & Vision** | OpenAI GPT-4o / GPT-4o-mini |
| **Backend** | FastAPI (High-performance Python) |
| **Frontend** | React, TypeScript, Tailwind CSS |
| **Document Processing** | PyMuPDF (Vision extraction) |

---

## 🚦 Getting Started

### 1. Environment Setup
Create a `.env` file in the root directory:
```env
VAPI_API_KEY=your_key
OPENAI_API_KEY=your_key
QDRANT_HOST=localhost
```

### 2. Launch the Ecosystem
Use our quick-start scripts to launch both servers:
- **Windows:** `./start.bat`
- **Linux/Mac:** `bash start.sh`

### 3. Ngrok Integration
Since Vapi requires a public endpoint for tools, expose your port 8000:
```bash
ngrok http 8000
```
*Update the URL in `frontend/src/App.tsx`.*

---

## 🗺️ Roadmap
- [x] **V1.0:** RAG-based search and voice interaction.
- [x] **V1.5:** Multilingual support (Hindi/English).
- [x] **V2.0:** Diagram Descriptions via Vision AI.
- [ ] **V3.0:** Edge-AI (Offline) support for remote rural areas.
- [ ] **V3.5:** Smart Glasses (AR) integration for real-time book reading.

## 👥 Team & Submission
*   **Lead Developer:** Naveen Kumar K M
*   **Hackathon:** HackBLR 2026
*   **Problem Statement:** PS-3 (Accessibility & Societal Impact)

---
*Built with ❤️ to ensure no student is left behind.*
