# Swar-Shiksha (स्वर-शिक्षा) 🎙️
### *Voice-First AI Tutor for Inclusive Education*

**Swar-Shiksha** is a high-impact AI agent designed to bridge the accessibility gap in education. It empowers visually impaired, dyslexic, and low-literacy students by transforming static textbooks into interactive, multilingual voice conversations.

Built for **HackBLR**, this project leverages state-of-the-art Voice AI and Vector Search to provide a "hands-free" learning experience.

---

## 🚀 The Problem
Traditional educational resources are text-heavy, creating significant barriers for:
- **Visually Impaired Students:** Who rely on expensive braille or slow screen readers.
- **Dyslexic Learners:** Who struggle with reading long-form text.
- **Regional Language Gap:** Rural students often have textbook material in English but understand concepts better in their native tongue.

## ✨ Our Solution
Swar-Shiksha acts as a personal tutor that:
1. **Listens:** Uses **Vapi** for ultra-low latency voice transcription.
2. **Thinks (RAG):** Uses **Qdrant** to perform semantic search across indexed textbooks.
3. **Speaks:** Responds in a natural, empathetic voice, explaining complex concepts simply.

---

## 🛠️ Tech Stack
- **Voice Interface:** [Vapi](https://vapi.ai/) (Real-time Voice AI)
- **Vector Database:** [Qdrant](https://qdrant.tech/) (Knowledge Retrieval)
- **Backend:** FastAPI (Python)
- **Frontend:** React + TypeScript + Tailwind CSS
- **AI Models:** OpenAI (GPT-3.5-Turbo & Text-Embeddings-3-Small)
- **PDF Processing:** PyPDF2

---

## 📦 Features
- **Semantic Textbook Search:** Ask about any topic (e.g., "Explain Newton's First Law") and the agent retrieves the exact context from the PDF.
- **Multilingual Support:** Seamlessly switch between English and Hindi.
- **Accessibility First:** Minimalistic, voice-driven UI designed for ease of use.
- **Interactive Transcripts:** Real-time feedback showing the student what is being searched and discussed.

---

## 🚦 Getting Started

### 1. Prerequisites
- Python 3.9+
- Node.js & npm
- [ngrok](https://ngrok.com/) (for local webhook testing)

### 2. Backend Setup
```bash
# Clone the repo
git clone [your-repo-link]
cd swar-shiksha

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
# Copy .env.example to .env and add your API keys
python main.py
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Data Ingestion
To add your own textbooks:
1. Place the PDF in the root folder.
2. Update the path in `pdf_processor.py`.
3. Run the ingestion script to populate Qdrant.

---

## 🗺️ Roadmap
- [ ] **Offline Support:** Edge-AI for rural areas with poor connectivity.
- [ ] **Quiz Mode:** Voice-driven assessments to track student progress.
- [ ] **Diagram Descriptions:** Using Vision models to explain textbook images via voice.

## 👥 Team
- **[Your Name]** - Full Stack AI Developer

---
*Built with ❤️ for HackBLR 2024.*
