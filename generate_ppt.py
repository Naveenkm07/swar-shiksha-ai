from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

def create_styled_presentation():
    prs = Presentation()
    
    # Colors
    INDIGO = RGBColor(79, 70, 229)
    SLATE_DARK = RGBColor(15, 23, 42)
    SLATE_LIGHT = RGBColor(248, 250, 252)
    EMERALD = RGBColor(16, 185, 129)
    WHITE = RGBColor(255, 255, 255)

    def set_background(slide, color):
        background = slide.background
        fill = background.fill
        fill.solid()
        fill.fore_color.rgb = color

    def add_sidebar(slide):
        # Decorative sidebar for a modern look
        shape = slide.shapes.add_shape(
            MSO_SHAPE.RECTANGLE, 0, 0, Inches(0.1), Inches(7.5)
        )
        shape.fill.solid()
        shape.fill.fore_color.rgb = INDIGO
        shape.line.fill.background()

    def add_styled_slide(title_text, bullet_points, is_dark=True):
        slide_layout = prs.slide_layouts[6] # Blank layout for custom design
        slide = prs.slides.add_slide(slide_layout)
        
        bg_color = SLATE_DARK if is_dark else SLATE_LIGHT
        text_color = WHITE if is_dark else SLATE_DARK
        set_background(slide, bg_color)
        add_sidebar(slide)

        # Title Box
        title_box = slide.shapes.add_textbox(Inches(0.5), Inches(0.3), Inches(9), Inches(1))
        title_tf = title_box.text_frame
        p = title_tf.paragraphs[0]
        p.text = title_text
        p.font.bold = True
        p.font.size = Pt(36)
        p.font.color.rgb = INDIGO if not is_dark else WHITE

        # Content area
        content_box = slide.shapes.add_textbox(Inches(0.8), Inches(1.5), Inches(8.5), Inches(5))
        tf = content_box.text_frame
        tf.word_wrap = True

        for point in bullet_points:
            p = tf.add_paragraph()
            p.text = "  •  " + point
            p.font.size = Pt(20)
            p.font.color.rgb = text_color
            p.space_after = Pt(12)
            
            if ":" in point:
                # Highlight the key term
                run = p.runs[0]
                run.font.bold = True
                run.font.color.rgb = EMERALD

        # Footer
        footer = slide.shapes.add_textbox(Inches(0.5), Inches(7.1), Inches(9), Inches(0.3))
        fp = footer.text_frame.paragraphs[0]
        fp.text = "Swar-Shiksha AI | HackBLR 2026 | Accessibility & Impact"
        fp.font.size = Pt(10)
        fp.font.color.rgb = RGBColor(100, 116, 139) # Grayish
        fp.alignment = PP_ALIGN.CENTER

    # Slide 1: Title Slide (Special Design)
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_background(slide, SLATE_DARK)
    
    # Large Decorative Circle
    circle = slide.shapes.add_shape(MSO_SHAPE.OVAL, Inches(6), Inches(-1), Inches(5), Inches(5))
    circle.fill.solid()
    circle.fill.fore_color.rgb = INDIGO
    circle.line.fill.background()

    title_box = slide.shapes.add_textbox(Inches(0.5), Inches(2.5), Inches(7), Inches(2))
    title_tf = title_box.text_frame
    p = title_tf.paragraphs[0]
    p.text = "Swar-Shiksha\n(स्वर-शिक्षा)"
    p.font.bold = True
    p.font.size = Pt(60)
    p.font.color.rgb = WHITE
    
    sub_box = slide.shapes.add_textbox(Inches(0.5), Inches(4.5), Inches(7), Inches(1))
    sub_tf = sub_box.text_frame
    sp = sub_tf.paragraphs[0]
    sp.text = "Voice-First AI Tutor for Inclusive Education\nHackBLR 2026 | Problem Statement 3"
    sp.font.size = Pt(24)
    sp.font.color.rgb = EMERALD

    # Slide 2: Challenge
    add_styled_slide("The Challenge (PS-3)", [
        "Objective: Design a voice-first AI agent for accessibility.",
        "Target Audience: Visually impaired, dyslexic, and low-literacy learners.",
        "Core Tech: Vapi (Voice) + Qdrant (Retrieval) + OpenAI (Intelligence).",
        "Vision: Making technology inclusive and hands-free."
    ], is_dark=False)

    # Slide 3: The Problem
    add_styled_slide("The Literacy Barrier", [
        "Traditional Media: Text-heavy books exclude millions of learners.",
        "Visual Impairment: Expensive Braille or limited screen readers.",
        "Language Gaps: Educational content is often locked in English.",
        "Diagram Isolation: Images remain un-narrated and misunderstood."
    ])

    # Slide 4: Our Solution
    add_styled_slide("Our Solution: Swar-Shiksha", [
        "Voice-to-Knowledge: Conversations instead of reading.",
        "Multilingual Brain: Real-time tutoring in Hindi and English.",
        "Diagram Intelligence: Explains charts and graphs via Vision AI.",
        "Progressive Learning: Built-in voice quizzes for assessment."
    ], is_dark=False)

    # Slide 5: Features
    add_styled_slide("Cutting-Edge Features", [
        "Semantic Search: RAG-based retrieval using Qdrant Vector DB.",
        "Vision Narrator: OpenAI GPT-4o-mini interprets textbook visuals.",
        "Interactive Quizzes: Triggered via voice to test concepts.",
        "Instant Ingestion: Web dashboard for 1-click PDF indexing."
    ])

    # Slide 6: Tech Stack
    add_styled_slide("The Tech Stack", [
        "Voice SDK: Vapi.ai (Ultra-low latency).",
        "Vector Engine: Qdrant (Semantic retrieval).",
        "Logic & Vision: OpenAI GPT-4o.",
        "Backend: FastAPI (Async Python).",
        "Frontend: React + Tailwind (Modern UI)."
    ], is_dark=False)

    # Slide 7: Workflow
    add_styled_slide("Seamless Workflow", [
        "1. Teacher uploads a textbook PDF.",
        "2. Swar-Shiksha indexes text and describes diagrams.",
        "3. Student asks a question via voice.",
        "4. AI retrieves the perfect context and explains it clearly."
    ])

    # Slide 8: Societal Impact
    add_styled_slide("Societal Impact", [
        "Independence: Visually impaired students learn without assistance.",
        "Inclusivity: Rural students bridge the language gap.",
        "Literacy: Dyslexic learners consume content through audio.",
        "Scalability: Ready for Healthcare and Public Services."
    ], is_dark=False)

    # Slide 9: Future Roadmap
    add_styled_slide("Roadmap & Beyond", [
        "Offline Edge AI: Local models for remote rural areas.",
        "Wearable Integration: Real-time reading via smart glasses.",
        "Adaptive Tutoring: Difficulty adjusts to the student's voice response.",
        "Regional Expansion: Support for 12+ Indian languages."
    ])

    # Slide 10: Conclusion
    add_styled_slide("Bridging Gaps with Swar-Shiksha", [
        "Goal: Transforming accessibility through Voice AI.",
        "Github: github.com/Naveenkm07/swar-shiksha-ai",
        "Presentation by: Naveen Kumar K M",
        "Thank you! Questions?"
    ], is_dark=False)

    prs.save('Swar-Shiksha_Designed_Presentation.pptx')
    print("Styled presentation created successfully!")

if __name__ == "__main__":
    create_styled_presentation()
