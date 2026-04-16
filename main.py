import os
from fastapi import FastAPI, Request, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
from qdrant_client import QdrantClient
from qdrant_client.http import models
import openai

from qdrant_manager import QdrantManager

load_dotenv()

app = FastAPI(title="Swar-Shiksha: Voice AI Tutor")

# Initialize Qdrant Manager
qdrant_manager = QdrantManager()

@app.get("/")
async def root():
    return {"message": "Welcome to Swar-Shiksha API"}

@app.post("/vapi-webhook")
async def vapi_webhook(payload: VapiPayload):
    message = payload.message
    message_type = message.get("type")
    
    if message_type == "tool-calls":
        # Vapi sends "tool-calls" when the LLM decides to use a tool
        tool_calls = message.get("toolCalls", [])
        results = []
        
        for tool_call in tool_calls:
            function = tool_call.get("function")
            if function.get("name") == "search_knowledge_base":
                arguments = function.get("arguments", {})
                query = arguments.get("query")
                
                print(f"Searching Qdrant for: {query}")
                search_results = qdrant_manager.search(query)
                
                results.append({
                    "toolCallId": tool_call.get("id"),
                    "result": " ".join(search_results)
                })
        
        return {"results": results}
    
    return {"status": "received"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
