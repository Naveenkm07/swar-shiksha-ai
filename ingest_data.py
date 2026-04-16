from qdrant_manager import QdrantManager

def ingest_sample_data():
    manager = QdrantManager()
    manager.create_collection()

    educational_data = [
        {
            "text": "Photosynthesis is a process used by plants and other organisms to convert light energy into chemical energy that, through cellular respiration, can later be released to fuel the organism's activities.",
            "metadata": {"subject": "Science", "topic": "Biology"}
        },
        {
            "text": "The water cycle, also known as the hydrologic cycle, describes the continuous movement of water on, above and below the surface of the Earth.",
            "metadata": {"subject": "Science", "topic": "Geography"}
        },
        {
            "text": "Newton's first law states that every object will remain at rest or in uniform motion in a straight line unless compelled to change its state by the action of an external force.",
            "metadata": {"subject": "Physics", "topic": "Mechanics"}
        },
        {
            "text": "The solar system consists of the Sun and everything that orbits it, including the eight planets, their moons, and dwarf planets.",
            "metadata": {"subject": "Science", "topic": "Astronomy"}
        },
        {
            "text": "In geometry, a triangle is a polygon with three edges and three vertices. It is one of the basic shapes in geometry.",
            "metadata": {"subject": "Mathematics", "topic": "Geometry"}
        }
    ]

    print("Starting ingestion...")
    for item in educational_data:
        manager.add_content(item["text"], item["metadata"])
        print(f"Added: {item['text'][:50]}...")
    
    print("Ingestion complete!")

if __name__ == "__main__":
    ingest_sample_data()
