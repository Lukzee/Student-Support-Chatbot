/***********************
 * STUDENT SUPPORT CHATBOT (Front-end)
 * - Sends user messages to Flask /chat (Gemini backend)
 * - Persists history in localStorage
 * - Quick links menu with slide animation
 ***********************/

const elTranscript = document.getElementById('transcript');
const elInput = document.getElementById('userInput');
const elSend = document.getElementById('sendBtn');
const elClear = document.getElementById('clearBtn');

const state = {
    history: [], // {role, text, ts}
};

// Utilities
const now = () => new Date().toISOString();
const save = () => localStorage.setItem('chat_state', JSON.stringify(state));
const load = () => {
    const raw = localStorage.getItem('chat_state');
    if (!raw) return;
    try {
        const s = JSON.parse(raw);
        state.history = s.history || [];
    } catch { }
};

// UI helpers
function addMsg(role, text, meta = "") {
    const wrap = document.createElement('div');
    wrap.className = `msg ${role}`;
    wrap.textContent = text;
    elTranscript.appendChild(wrap);
    if (meta) {
        const m = document.createElement('div');
        m.className = 'meta';
        m.textContent = meta;
        elTranscript.appendChild(m);
    }
    elTranscript.scrollTop = elTranscript.scrollHeight;
    state.history.push({ role, text, ts: now() });
    save();
}

function addChips(...labels) {
    const box = document.createElement('div');
    box.className = 'chips';
    labels.forEach(label => {
        const b = document.createElement('button');
        b.className = 'chip';
        b.textContent = label;
        b.onclick = () => handleUser(label);
        box.appendChild(b);
    });
    elTranscript.appendChild(box);
    elTranscript.scrollTop = elTranscript.scrollHeight;
}

// Initial suggested chips (student-focused)
const initialChips = ["Application help", "Admission requirements", "Registration issue", "Fees & payment", "Talk to support"];

// Send user text to server (Gemini)
async function sendToServer(text) {
    try {
        const res = await fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
        });
        const json = await res.json();
        if (json.error) {
            addMsg('bot', `Error: ${json.error}`);
            return;
        }
        addMsg('bot', json.reply || 'No reply from server.');
    } catch (err) {
        addMsg('bot', 'Network error. Could not reach server.');
    }
}

// Entry point for user actions
function handleUser(text) {
    const trimmed = (text || '').trim();
    if (!trimmed) return;
    addMsg('user', trimmed);
    // show thinking indicator
    const thinking = document.createElement('div');
    thinking.className = 'msg bot';
    thinking.textContent = 'Thinking…';
    elTranscript.appendChild(thinking);
    elTranscript.scrollTop = elTranscript.scrollHeight;

    // call server
    sendToServer(trimmed).finally(() => {
        // remove thinking indicator if still present
        if (thinking && thinking.parentNode === elTranscript) {
            elTranscript.removeChild(thinking);
        }
    });
}

// Events
elSend.onclick = () => { handleUser(elInput.value); elInput.value = ""; };
elInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        handleUser(elInput.value);
        elInput.value = "";
    }
});
elClear.onclick = () => {
    state.history = [];
    save();
    elTranscript.innerHTML = "";
    greet();
};

// Restore history
function restore() {
    load();
    if (state.history && state.history.length) {
        state.history.forEach(m => addMsg(m.role, m.text));
    } else {
        greet();
    }
}

function greet() {
    addMsg('bot', "Welcome to the Student Support Assistant. How may I help today?");
    addChips(...initialChips);
}

// Quick Links toggle behavior
const quickBtn = document.getElementById('quickLinksBtn');
const quickMenu = document.getElementById('quickLinksMenu');
if (quickBtn && quickMenu) {
    quickBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        quickMenu.classList.toggle('show');
        quickMenu.setAttribute('aria-hidden', quickMenu.classList.contains('show') ? 'false' : 'true');
    });
    document.addEventListener('click', (e) => {
        if (!quickBtn.contains(e.target) && !quickMenu.contains(e.target)) {
            quickMenu.classList.remove('show');
            quickMenu.setAttribute('aria-hidden', 'true');
        }
    });
}

// Init
restore();
