import os
from PyPDF2 import PdfReader
from qdrant_manager import QdrantManager

class PDFProcessor:
    def __init__(self):
        self.qdrant_manager = QdrantManager()
        self.qdrant_manager.create_collection()

    def extract_text(self, pdf_path):
        """Extracts all text from a PDF file."""
        reader = PdfReader(pdf_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text

    def chunk_text(self, text, chunk_size=1000, overlap=100):
        """Splits text into smaller chunks for better embedding search."""
        chunks = []
        start = 0
        while start < len(text):
            end = start + chunk_size
            chunks.append(text[start:end])
            start = end - overlap
        return chunks

    def process_and_upload(self, pdf_path, subject):
        """Processes a PDF and uploads its chunks to Qdrant."""
        print(f"Processing PDF: {pdf_path}")
        raw_text = self.extract_text(pdf_path)
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
    # Example usage
    # processor = PDFProcessor()
    # processor.process_and_upload("path/to/textbook.pdf", "Science")
    print("PDF Processor ready. Place your PDF in the project folder and use process_and_upload().")
