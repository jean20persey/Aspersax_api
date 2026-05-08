const aspersaxData = {
    history: [
        {
            year: "Fase Inicial",
            title: "El Desafío de la Romaza",
            description: "Identificación de la proliferación de maleza en Finca La Riverita y la necesidad de una solución automatizada."
        },
        {
            year: "Prototipo V1",
            title: "Primer Chasis Autónomo",
            description: "Desarrollo del hardware base y sistemas de tracción para terrenos agrícolas irregulares."
        },
        {
            year: "Inteligencia",
            title: "Visión Artificial Integrada",
            description: "Implementación del primer modelo de detección de malezas en tiempo real usando Deep Learning."
        },
        {
            year: "Optimización",
            title: "Eficiencia de Aspersión",
            description: "Reducción del 40% en el uso de herbicidas mediante boquillas controladas por IA."
        },
        {
            year: "Hoy",
            title: "Flota Aspersax",
            description: "Operación de múltiples robots coordinados para la cobertura total de la finca."
        }
    ],
    modules: [
        {
            id: 1,
            title: "Fundamentos de Robótica Aspersax",
            description: "Arquitectura de los robots aspersores, sistemas de propulsión y principios de navegación autónoma en campo.",
            price: "$480,000 COP"
        },
        {
            id: 2,
            title: "Machine Learning aplicado al Agro",
            description: "Modelos de clasificación para la detección de maleza Romaza y calibración de sensores en entornos variables.",
            price: "$650,000 COP"
        },
        {
            id: 3,
            title: "Optimización con Algoritmos Genéticos",
            description: "Uso de algoritmos evolutivos para maximizar el área tratada y minimizar el consumo de batería de la flota.",
            price: "$820,000 COP"
        },
        {
            id: 4,
            title: "Deep Learning: Visión para Malezas",
            description: "Entrenamiento de redes neuronales convolucionales para la identificación precisa de malezas en tiempo real.",
            price: "$980,000 COP"
        },
        {
            id: 5,
            title: "Gestión de Operaciones La Riverita",
            description: "Administración de jornadas, control de niveles de tanques y generación de reportes analíticos de productividad.",
            price: "$1,300,000 COP"
        }
    ],
    team: [
        {
            name: "Lead Developer Aspersax",
            role: "Arquitecto de Sistemas de Precisión",
            bio: "Experto en integración de sistemas Django-React con hardware robótico. Líder en el despliegue de modelos de IA aplicados a la agricultura sostenible en Finca La Riverita."
        }
    ]
};

// Rendering Functions
function renderTimeline() {
    const container = document.getElementById('history-container');
    container.innerHTML = aspersaxData.history.map(item => `
        <div class="timeline-item">
            <span style="color: var(--secondary-green); font-weight: 700;">${item.year}</span>
            <h3>${item.title}</h3>
            <p>${item.description}</p>
        </div>
    `).join('');
}

function renderModules() {
    const container = document.getElementById('services-container');
    container.innerHTML = aspersaxData.modules.map(mod => `
        <div class="card">
            <h3>${mod.title}</h3>
            <p style="color: var(--text-light); margin-top: 1rem; min-height: 80px;">${mod.description}</p>
            <div class="price">${mod.price}</div>
            <button class="btn-primary">Ver Módulo</button>
        </div>
    `).join('');
}

function renderTeam() {
    const container = document.getElementById('team-container');
    container.innerHTML = aspersaxData.team.map(member => `
        <div class="card" style="max-width: 600px;">
            <h3>${member.name}</h3>
            <p style="color: var(--secondary-green); font-weight: 600; margin-bottom: 1.5rem;">${member.role}</p>
            <p>${member.bio}</p>
        </div>
    `).join('');
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    renderTimeline();
    renderModules();
    renderTeam();
});
