const API_KEY = 'AIzaSyDsPwBWXLZ2wFWVKKXbVCa8vyaEWq8UhkU';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${API_KEY}`;

const chatMessages = document.getElementById('chatbot-messages');
const chatInput = document.getElementById('chat-input');
const sendButton = document.getElementById('send-chat');

// Aspersax Knowledge Base Instruction
const systemInstruction = `
Eres el Asistente Técnico de Aspersax, un proyecto de robótica agrícola en Finca La Riverita.
SOLO puedes responder sobre los siguientes temas relacionados con Aspersax:

1. PRODUCTO/PROYECTO:
   - Aspersax es una flota de robots autónomos para el control de malezas.
   - Ubicación principal: Finca La Riverita.
   - Objetivo: Aspersión selectiva para reducir químicos y proteger el suelo.
   - Maleza principal que detecta: Romaza (Rumex crispus).

2. MÓDULOS DE CAPACITACIÓN:
   - Fundamentos de Robótica ($480k): Arquitectura y propulsión.
   - ML aplicado ($650k): Clasificación de malezas.
   - Algoritmos Genéticos ($820k): Optimización de rutas y batería.
   - Deep Learning ($980k): Visión artificial en tiempo real.
   - Gestión de Operaciones ($1.3M): Jornadas y tanques.

3. REGLAS:
   - Si el usuario pregunta algo NO relacionado con Aspersax, responde: "Como asistente técnico de Aspersax, mi conocimiento se limita al proyecto y a la robótica agrícola en Finca La Riverita. ¿Te puedo ayudar con algo técnico sobre nuestros robots?".
   - Sé técnico pero amable.
   - No inventes precios ni especificaciones fuera de esta lista.
`;

async function getChatResponse(userMessage) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `${systemInstruction}\n\nPregunta del usuario: ${userMessage}`
                    }]
                }]
            })
        });

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('Gemini Error:', error);
        return "Lo siento, tengo un problema de conexión con mi módulo central. Inténtalo de nuevo.";
    }
}

function appendMessage(sender, text) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender);
    msgDiv.innerText = text;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

sendButton.addEventListener('click', async () => {
    const text = chatInput.value.trim();
    if (!text) return;

    appendMessage('user', text);
    chatInput.value = '';

    const botText = await getChatResponse(text);
    appendMessage('bot', botText);
});

chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendButton.click();
});
