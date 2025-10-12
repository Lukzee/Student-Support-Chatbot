# 🎓 Student Support Chatbot (Gemini-2.0-Flash + Flask)

An intelligent chatbot powered by **Google Gemini-2.0-Flash**, built with **Flask** and a clean, responsive UI.  
The chatbot assists students with queries on admission, registration, and general support while providing quick-access links for convenience.

---

## 🚀 Features
- 🔹 Connected to **Google Gemini-2.0-Flash**
- 🔹 24/7 Student Support Chat Interface
- 🔹 Quick Links dropdown for instant access to portals
- 🔹 Fully responsive mobile UI
- 🔹 Smooth dropdown animation
- 🔹 Simple Flask backend

---

## 🧩 Prerequisites
- Python **3.9+**
- A valid **Google Gemini API key**

---

## ⚙️ 1. Set Up the Virtual Environment

### Windows:
```bash
python -m venv venv
venv\Scripts\activate
````

### macOS / Linux:

```bash
python3 -m venv venv
source venv/bin/activate
```

---

## 📦 2. Install Dependencies

After activating your virtual environment, run:

```bash
pip install -r requirements.txt
```

Your `requirements.txt` should contain:

```txt
Flask>=2.2
python-dotenv>=0.20
google-genai>=0.1.0
```

---

## 🔑 3. Configure Environment Variables

Create a file named `.env` in the project root and add your **Gemini API key** like this:

```env
GOOGLE_API_KEY=your_gemini_api_key_here
```

Make sure this file is **not shared publicly**.

---

## 🧠 4. Run the Flask App

Run the following command inside your activated virtual environment:

```bash
python app.py
```

Then open your browser and visit:

```
http://127.0.0.1:5000
```

---

## 🧹 Optional: Reset Virtual Environment

If you ever need to reset your venv:

```bash
deactivate
rmdir /s /q venv          # Windows
# or
rm -rf venv               # macOS / Linux
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

---

## 🪪 Author

**SoftBrein Technology Solutions Global Venture**
Developed by **Ibrahim Lukman**

---

## 🧠 Powered By

[Google Gemini-2.0-Flash](https://ai.google.dev/gemini-api) · Flask · HTML · CSS · JS
