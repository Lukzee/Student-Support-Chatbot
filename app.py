import os
from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv

# Use the same import shape you provided earlier
try:
    from google import genai
except Exception as e:
    genai = None

# Load .env
load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    print("WARNING: GEMINI_API_KEY not found in environment. /chat will return an error until set.")

client = None
if genai and API_KEY:
    client = genai.Client(api_key=API_KEY)

app = Flask(__name__, static_folder='static', template_folder='templates')

# System instructions for Gemini (includes FPTB official links)
SYSTEM_INSTRUCTIONS = (
    "You are a Student Support Assistant for Federal Polytechnic Bauchi (FPTB), Nigeria. "
    "Answer conversationally, politely, and helpfully. Focus on: Application, Admission, Registration issues, Fees & payments, Course information, Timetables, Exam/results guidance, and Portal access. "
    "When the user requests official procedures or specific portal steps, refer to the official pages listed below. If you cannot find exact up-to-date info, clearly say so and direct the user to the official contacts. "
    "Official references:\n"
    "- Official website: https://fptb.edu.ng\n"
    "- Admissions portal: https://portal.fptb.edu.ng/admissions\n"
    "- Online application: https://portal.fptb.edu.ng/application\n"
    "- Student portal: https://portal.fptb.edu.ng/student\n"
    "- Support emails: info@fptb.edu.ng, support@fptb.edu.ng\n"
    "- Phone/Hotline examples: +2347061104170, +2347087203074\n    "
    "Keep answers concise but actionable. If the user asks for long procedures, give numbered steps. "
    "If the user asks for contact info, provide the official links and emails above. "
)

MODEL_NAME = "gemini-2.0-flash"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    if not client:
        return jsonify({"error": "Gemini client not configured. Set GEMINI_API_KEY in environment."}), 500

    data = request.get_json() or {}
    user_message = data.get('message', '').strip()
    if not user_message:
        return jsonify({"error": "Empty message."}), 400

    # Create prompt for Gemini: combine system instructions and user message
    prompt = f"{SYSTEM_INSTRUCTIONS}\n\nUser: {user_message}\nAssistant:"

    try:
        # Use generate_content style consistent with earlier code
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=prompt
        )
        # response may expose .text
        text = getattr(response, 'text', None) or str(response)
        return jsonify({"reply": text})
    except Exception as e:
        # Return useful error to frontend
        return jsonify({"error": f"Generation error: {str(e)}"}), 500

if __name__ == "__main__":
    # For local testing
    app.run(host="0.0.0.0", port=5000, debug=True)
