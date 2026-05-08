import React, { useState, useRef, useEffect } from 'react';
import { Box, TextField, IconButton, Typography, Paper, Fab, Zoom, Fade } from '@mui/material';
import { SmartToy as RobotIcon, Close as CloseIcon, Send as SendIcon } from '@mui/icons-material';

const API_KEY = 'AIzaSyDsPwBWXLZ2wFWVKKXbVCa8vyaEWq8UhkU';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${API_KEY}`;

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

const Chatbot: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<{ sender: 'bot' | 'user'; text: string }[]>([
        { sender: 'bot', text: '¡Hola! Soy el asistente técnico de Aspersax. ¿Tienes dudas sobre nuestros robots?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userText = input.trim();
        setMessages(prev => [...prev, { sender: 'user', text: userText }]);
        setInput('');
        setLoading(true);

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `${systemInstruction}\n\nPregunta del usuario: ${userText}`
                        }]
                    }]
                })
            });

            const data = await response.json();
            const botText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Lo siento, tuve un problema de conexión.";
            setMessages(prev => [...prev, { sender: 'bot', text: botText }]);
        } catch (error) {
            console.error('Chatbot Error:', error);
            setMessages(prev => [...prev, { sender: 'bot', text: 'Error al conectar con el servidor.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Zoom in={true}>
                <Fab 
                    color="primary" 
                    aria-label="chat" 
                    onClick={() => setOpen(!open)}
                    sx={{ position: 'fixed', bottom: 24, right: 24, boxShadow: 4 }}
                >
                    {open ? <CloseIcon /> : <RobotIcon />}
                </Fab>
            </Zoom>

            <Fade in={open}>
                <Paper 
                    elevation={10}
                    sx={{ 
                        position: 'fixed', 
                        bottom: 90, 
                        right: 24, 
                        width: 350, 
                        height: 500, 
                        display: 'flex', 
                        flexDirection: 'column',
                        borderRadius: 4,
                        overflow: 'hidden',
                        zIndex: 1000
                    }}
                >
                    <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle1" fontWeight={700}>Asistente Aspersax</Typography>
                        <IconButton size="small" color="inherit" onClick={() => setOpen(false)}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Box>

                    <Box 
                        ref={scrollRef}
                        sx={{ 
                            flexGrow: 1, 
                            p: 2, 
                            overflowY: 'auto', 
                            bgcolor: '#f8fafc',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1.5
                        }}
                    >
                        {messages.map((msg, i) => (
                            <Box 
                                key={i} 
                                sx={{ 
                                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                    bgcolor: msg.sender === 'user' ? 'primary.main' : 'white',
                                    color: msg.sender === 'user' ? 'white' : 'text.primary',
                                    p: 1.5,
                                    borderRadius: 3,
                                    borderBottomRightRadius: msg.sender === 'user' ? 2 : 12,
                                    borderBottomLeftRadius: msg.sender === 'bot' ? 2 : 12,
                                    maxWidth: '85%',
                                    boxShadow: 1
                                }}
                            >
                                <Typography variant="body2">{msg.text}</Typography>
                            </Box>
                        ))}
                        {loading && (
                            <Typography variant="caption" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>Escribiendo...</Typography>
                        )}
                    </Box>

                    <Box sx={{ p: 2, borderTop: '1px solid #e2e8f0', display: 'flex', gap: 1 }}>
                        <TextField 
                            fullWidth 
                            size="small" 
                            placeholder="Tu pregunta..." 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <IconButton color="primary" onClick={handleSend} disabled={loading}>
                            <SendIcon />
                        </IconButton>
                    </Box>
                </Paper>
            </Fade>
        </>
    );
};

export default Chatbot;
