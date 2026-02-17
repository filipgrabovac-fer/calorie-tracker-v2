from langchain_openai import ChatOpenAI
from langchain_google_genai import GoogleGenerativeAI
from dotenv import load_dotenv

load_dotenv()

google_client = GoogleGenerativeAI(model="gemini-2.5-flash")

response = google_client.invoke("Hello, world!")

print(response)
