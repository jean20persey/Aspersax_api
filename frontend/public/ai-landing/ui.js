// Navigation Logic
const navItems = document.querySelectorAll('.nav-links li');
const sections = document.querySelectorAll('section');

navItems.forEach(item => {
    item.addEventListener('click', () => {
        const target = item.getAttribute('data-section');
        
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');

        sections.forEach(sec => {
            sec.classList.remove('active');
            if (sec.id === target) {
                sec.classList.add('active');
            }
        });
    });
});

// Chatbot Toggle
const chatbotToggle = document.getElementById('chatbot-toggle');
const chatbotWindow = document.getElementById('chatbot-window');
const closeChat = document.getElementById('close-chat');

chatbotToggle.addEventListener('click', () => {
    const isVisible = chatbotWindow.style.display === 'flex';
    chatbotWindow.style.display = isVisible ? 'none' : 'flex';
});

closeChat.addEventListener('click', () => {
    chatbotWindow.style.display = 'none';
});

// Form Submission
const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    alert(`¡Hola ${name}! Tu solicitud ha sido enviada con éxito. Un especialista de Aspersax te contactará.`);
    contactForm.reset();
});
