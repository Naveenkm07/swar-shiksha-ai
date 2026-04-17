from fastapi import FastAPI, Request, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from dotenv import load_dotenv
import os
import shutil
from qdrant_manager import QdrantManager
from pdf_processor import PDFProcessor

load_dotenv()

app = FastAPI(title="Swar-Shiksha: Voice AI Tutor")

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for hackathon simplicity
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Managers
qdrant_manager = QdrantManager()
pdf_processor = PDFProcessor()

# Ensure uploads directory exists
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

class VapiPayload(BaseModel):
    message: Dict[str, Any]

@app.get("/")
async def root():
    return {"message": "Welcome to Swar-Shiksha API"}

@app.post("/upload-textbook")
async def upload_textbook(file: UploadFile = File(...), subject: str = Form(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
    
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        # Process and upload to Qdrant
        pdf_processor.process_and_upload(file_path, subject)
        return {"message": f"Successfully processed {file.filename}", "subject": subject}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Clean up the file after processing
        if os.path.exists(file_path):
            os.remove(file_path)

@app.post("/vapi-webhook")
async def vapi_webhook(payload: VapiPayload):
    message = payload.message
    message_type = message.get("type")
    
    print(f"Received message type: {message_type}")

    if message_type == "tool-calls":
        tool_calls = message.get("toolCalls", [])
        results = []
        
        for tool_call in tool_calls:
            function = tool_call.get("function")
            func_name = function.get("name")
            arguments = function.get("arguments", {})
            
            if func_name == "search_knowledge_base":
                query = arguments.get("query")
                print(f"Searching Qdrant for: {query}")
                search_results = qdrant_manager.search(query)
                context = " ".join(search_results) if search_results else "No relevant information found."
                
                results.append({
                    "toolCallId": tool_call.get("id"),
                    "result": context
                })
            
            elif func_name == "generate_quiz":
                topic = arguments.get("topic")
                print(f"Generating quiz for: {topic}")
                # Search for context to generate questions
                search_results = qdrant_manager.search(f"Detailed information about {topic}", limit=2)
                context = " ".join(search_results)
                
                # We return the context and ask the LLM to format it as a quiz in its response
                results.append({
                    "toolCallId": tool_call.get("id"),
                    "result": f"Context for quiz on {topic}: {context}. Please generate 3 multiple choice questions based on this."
                })
        
        return {"results": results}
    
    return {"status": "received"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
