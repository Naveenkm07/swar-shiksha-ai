import os
from qdrant_client import QdrantClient
from qdrant_client.http import models
import openai
from dotenv import load_dotenv

load_dotenv()

class QdrantManager:
    def __init__(self):
        host = os.getenv("QDRANT_HOST", "localhost")
        if host == "localhost":
            self.client = QdrantClient(":memory:")
            print("Using in-memory Qdrant storage.")
        else:
            self.client = QdrantClient(
                url=host,
                api_key=os.getenv("QDRANT_API_KEY")
            )
        self.collection_name = "education_content"
        self.vector_size = 1536  # OpenAI text-embedding-3-small/ada-002 size

    def create_collection(self):
        """Creates a collection in Qdrant if it doesn't exist."""
        collections = self.client.get_collections().collections
        exists = any(c.name == self.collection_name for c in collections)
        
        if not exists:
            self.client.create_collection(
                collection_name=self.collection_name,
                vectors_config=models.VectorParams(
                    size=self.vector_size,
                    distance=models.Distance.COSINE
                )
            )
            print(f"Collection '{self.collection_name}' created.")
        else:
            print(f"Collection '{self.collection_name}' already exists.")

    def get_embedding(self, text):
        """Generates embedding for the given text using OpenAI."""
        response = openai.embeddings.create(
            input=text,
            model="text-embedding-3-small"
        )
        return response.data[0].embedding

    def add_content(self, text, metadata):
        """Adds text content to the vector database."""
        embedding = self.get_embedding(text)
        self.client.upsert(
            collection_name=self.collection_name,
            points=[
                models.PointStruct(
                    id=hash(text) % 10**10,  # Simple hash for ID
                    vector=embedding,
                    payload={"text": text, **metadata}
                )
            ]
        )

    def search(self, query, limit=3):
        """Searches for relevant content in the vector database."""
        query_vector = self.get_embedding(query)
        search_result = self.client.search(
            collection_name=self.collection_name,
            query_vector=query_vector,
            limit=limit
        )
        return [hit.payload["text"] for hit in search_result]

if __name__ == "__main__":
    # Test script to initialize
    manager = QdrantManager()
    manager.create_collection()
    # manager.add_content("Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods from carbon dioxide and water.", {"subject": "Science"})
    # print(manager.search("How do plants make food?"))
