from dotenv import load_dotenv
from pathlib import Path
from google import genai
import os

ENV_PATH = Path(__file__).resolve().parent / ".env"

print("Environment file:", ENV_PATH)
print("File exists:", ENV_PATH.exists())

load_dotenv(dotenv_path=ENV_PATH, override=True)

api_key = os.getenv("GEMINI_API_KEY")
model = os.getenv("GEMINI_MODEL", "").strip()

print("API key loaded:", bool(api_key))
print("Model loaded:", repr(model))

if not api_key:
    raise ValueError("Gemini API key is missing.")

if not model:
    raise ValueError("Gemini model is missing.")

client = genai.Client(api_key=api_key)

# Verify that the model exists and is accessible
model_info = client.models.get(model=model)
print("Model verified:", model_info.name)

response = client.models.generate_content(
    model=model,
    contents="Explain RTO in Indian e-commerce in two sentences."
)

print("\nResponse:")
print(response.text)