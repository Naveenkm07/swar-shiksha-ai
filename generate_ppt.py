from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN

def create_presentation():
    prs = Presentation()

    def add_slide(title_text, bullet_points):
        slide_layout = prs.slide_layouts[1] # Title and Content
        slide = prs.slides.add_slide(slide_layout)
        title = slide.shapes.title
        content = slide.placeholders[1]

        title.text = title_text
        tf = content.text_frame
        tf.word_wrap = True

        for point in bullet_points:
            p = tf.add_paragraph()
            p.text = point
            p.level = 0
            if ":" in point: # Bold key terms
                run = p.runs[0]
                run.font.bold = True

    # Slide 1: Title
    title_slide_layout = prs.slide_layouts[0]
    slide = prs.slides.add_slide(title_slide_layout)
    title = slide.shapes.title
    subtitle = slide.placeholders[1]
    title.text = "Swar-Shiksha (स्वर-शिक्षा)"
    subtitle.text = "Voice-First AI Tutor for Inclusive Education\nHackBLR 2024 | Problem Statement 3"

    # Slide 2: Challenge Selection
    add_slide("Problem Statement 3: Accessibility & Societal Impact", [
        "Goal: Create a voice-first AI agent to improve accessibility and usability.",
        "Target: Students with literacy, language, or visual impairments.",
        "Approach: Use Vapi for ultra-low latency voice and Qdrant for semantic retrieval.",
        "Impact: Bridging the gap between users and essential educational services."
    ])

    # Slide 3: The Problem
    add_slide("The Educational Barrier", [
        "Static Textbooks: Traditional resources are text-heavy and inaccessible.",
        "Visually Impaired: Rely on expensive braille or slow screen readers.",
        "Dyslexia & Low Literacy: Complex text is overwhelming for many learners.",
        "Language Gap: Rural students often have English books but learn better in native tongues."
    ])

    # Slide 4: Our Solution
    add_slide("Swar-Shiksha: The Voice Tutor", [
        "Interactive Knowledge: Turns any static PDF into a conversational tutor.",
        "Eyes-Free Learning: Completely hands-free interface for maximum accessibility.",
        "Real-Time Response: Multilingual tutoring in English and Hindi.",
        "Empathetic & Patient: AI designed to encourage and simplify concepts."
    ])

    # Slide 5: Key Technical Features
    add_slide("Innovation & Features", [
        "Semantic RAG: Qdrant-powered search for precise textbook retrieval.",
        "Vision-to-Voice: OpenAI Vision describes diagrams, graphs, and images via voice.",
        "Interactive Quizzes: Voice-driven assessments to track progress.",
        "Dynamic Ingestion: Web interface to upload and index any PDF instantly."
    ])

    # Slide 6: Tech Stack
    add_slide("The Power Behind Swar-Shiksha", [
        "Voice: Vapi (Real-time Voice AI SDK).",
        "Vector DB: Qdrant (Knowledge retrieval & contextual memory).",
        "Brain: OpenAI GPT-4o-mini (Vision + Logic).",
        "Backend: FastAPI (High-performance Python API).",
        "Frontend: React + Tailwind CSS (Accessibility-focused UI)."
    ])

    # Slide 7: How It Works
    add_slide("System Workflow", [
        "1. Upload: PDF is uploaded via the dashboard.",
        "2. Process: Text is chunked; Diagrams are described via Vision models.",
        "3. Index: Vectors are stored in Qdrant for semantic search.",
        "4. Speak: Student asks questions; Tutor retrieves context and speaks the answer."
    ])

    # Slide 8: Societal Impact
    add_slide("Why It Matters", [
        "Empowerment: Independent learning for the visually impaired.",
        "Inclusion: Bridging the regional language gap with Hindi support.",
        "Accessibility: Minimalistic UI ensures tech is not a barrier to learning.",
        "Scalability: Applicable to healthcare, finance, and public services."
    ])

    # Slide 9: Future Roadmap
    add_slide("The Path Ahead", [
        "Edge-AI: Offline support for rural areas with low connectivity.",
        "Vision Glasses: Real-time physical book reading via wearable tech.",
        "Quiz Personalization: Adaptive learning paths based on voice performance.",
        "Multilingual Expansion: Support for more regional Indian languages."
    ])

    # Slide 10: Conclusion & Thank You
    add_slide("Swar-Shiksha: Learning for Everyone", [
        "Final Thought: Technology is most powerful when it's accessible.",
        "Github: github.com/Naveenkm07/swar-shiksha-ai",
        "Contact: [Your Name / Email]",
        "Thank you! Ready for Questions."
    ])

    prs.save('Swar-Shiksha_Presentation.pptx')
    print("Presentation created successfully!")

if __name__ == "__main__":
    create_presentation()
