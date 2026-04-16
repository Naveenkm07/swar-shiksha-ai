import os
import fitz  # PyMuPDF
import base64
from openai import OpenAI
from qdrant_manager import QdrantManager
from dotenv import load_dotenv

load_dotenv()

class PDFProcessor:
    def __init__(self):
        self.qdrant_manager = QdrantManager()
        self.qdrant_manager.create_collection()
        self.client = OpenAI() # Expects OPENAI_API_KEY in env

    def describe_image(self, image_bytes):
        """Uses OpenAI Vision to describe an educational image."""
        try:
            base64_image = base64.b64encode(image_bytes).decode('utf-8')
            response = self.client.chat.completions.create(
                model="gpt-4o-mini", # Cost-effective vision model
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": "Describe this educational diagram, graph, or image in detail. Explain the concepts it illustrates as if you are teaching a student. If it's just a decorative image, a blank placeholder, or a simple logo without educational value, reply exactly with 'Skip'."},
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:image/jpeg;base64,{base64_image}"
                                }
                            }
                        ]
                    }
                ],
                max_tokens=300
            )
            desc = response.choices[0].message.content.strip()
            
            if desc.lower() == "skip" or ("skip" in desc.lower() and len(desc) < 10):
                return ""
                
            return f"\n\n[Diagram Description: {desc}]\n\n"
        except Exception as e:
            print(f"Vision API error: {e}")
            return ""

    def extract_text_and_images(self, pdf_path):
        """Extracts all text and generates descriptions for images."""
        doc = fitz.open(pdf_path)
        content = ""
        
        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            content += page.get_text() + "\n"
            
            # Extract images from the page
            image_list = page.get_images(full=True)
            for img_index, img in enumerate(image_list):
                xref = img[0]
                base_image = doc.extract_image(xref)
                image_bytes = base_image["image"]
                
                print(f"Processing image {img_index+1} on page {page_num+1}...")
                description = self.describe_image(image_bytes)
                content += description
                
        return content

    def chunk_text(self, text, chunk_size=1000, overlap=100):
        """Splits text into contextually aware chunks."""
        # Split by double newlines first (paragraphs/diagrams)
        paragraphs = text.split('\n\n')
        chunks = []
        current_chunk = ""
        
        for para in paragraphs:
            para = para.strip()
            if not para:
                continue
                
            if len(current_chunk) + len(para) <= chunk_size:
                current_chunk += para + "\n\n"
            else:
                if current_chunk:
                    chunks.append(current_chunk.strip())
                # If a single paragraph is larger than chunk_size, split it naively
                if len(para) > chunk_size:
                    start = 0
                    while start < len(para):
                        end = start + chunk_size
                        chunks.append(para[start:end])
                        start = end - overlap
                    current_chunk = ""
                else:
                    current_chunk = para + "\n\n"
        
        if current_chunk:
            chunks.append(current_chunk.strip())
            
        return chunks

    def process_and_upload(self, pdf_path, subject):
        """Processes a PDF and uploads its chunks to Qdrant."""
        print(f"Processing PDF (Text + Vision): {pdf_path}")
        raw_text = self.extract_text_and_images(pdf_path)
        chunks = self.chunk_text(raw_text)
        
        print(f"Uploading {len(chunks)} chunks to Qdrant...")
        for i, chunk in enumerate(chunks):
            metadata = {
                "subject": subject,
                "source": os.path.basename(pdf_path),
                "chunk_id": i
            }
            self.qdrant_manager.add_content(chunk, metadata)
            if i % 10 == 0:
                print(f"Uploaded {i}/{len(chunks)} chunks...")
        
        print(f"Finished uploading {pdf_path}")

if __name__ == "__main__":
    print("PDF Processor ready with Vision capabilities. Place your PDF in the project folder and use process_and_upload().")
