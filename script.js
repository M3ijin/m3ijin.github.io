// ========================================
// Variables globales
// ========================================
let currentAudio = null;

// Estado de los sliders
const sliderStates = {
    voces: { currentIndex: 0, itemsPerView: 3 },
    sonidos: { currentIndex: 0, itemsPerView: 3 },
    fondos: { currentIndex: 0, itemsPerView: 3 }
};

// ========================================
// Elementos del DOM
// ========================================
const darkModeToggle = document.getElementById('dark-mode-toggle');
const body = document.body;


// ========================================
// Inicialización de Sliders
// ========================================
function initSliders() {
    // Calcular items por vista según el ancho de pantalla
    updateItemsPerView();
    
    // Inicializar cada slider
    initSlider('voces');
    initSlider('sonidos');
    initSlider('fondos');
    
    // Actualizar al redimensionar ventana
    window.addEventListener('resize', debounce(() => {
        updateItemsPerView();
        initSlider('voces');
        initSlider('sonidos');
        initSlider('fondos');
    }, 250));
}

function updateItemsPerView() {
    const width = window.innerWidth;
    let itemsPerView = 3;
    
    if (width < 480) {
        itemsPerView = 1;
    } else if (width < 768) {
        itemsPerView = 2;
    } else {
        itemsPerView = 3;
    }
    
    sliderStates.voces.itemsPerView = itemsPerView;
    sliderStates.sonidos.itemsPerView = itemsPerView;
    sliderStates.fondos.itemsPerView = itemsPerView;
}

function initSlider(sliderId) {
    const track = document.getElementById(`slider-${sliderId}`);
    const dotsContainer = document.getElementById(`dots-${sliderId}`);
    
    if (!track) return;
    
    const items = track.querySelectorAll('.slider-item');
    const state = sliderStates[sliderId];
    const totalItems = items.length;
    const totalPages = Math.ceil(totalItems / state.itemsPerView);
    
    // Crear puntos de navegación
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalPages; i++) {
        const dot = document.createElement('div');
        dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
        dot.onclick = () => goToSlide(sliderId, i);
        dotsContainer.appendChild(dot);
    }
    
    // Resetear posición
    updateSliderPosition(sliderId);
}

function updateSliderPosition(sliderId) {
    const track = document.getElementById(`slider-${sliderId}`);
    const state = sliderStates[sliderId];
    const items = track.querySelectorAll('.slider-item');
    
    if (items.length === 0) return;
    
    const itemWidth = items[0].offsetWidth;
    const gap = 16; // 1rem en pixels
    const offset = -(state.currentIndex * state.itemsPerView * (itemWidth + gap));
    
    track.style.transform = `translateX(${offset}px)`;
    
    // Actualizar dots
    const dots = document.querySelectorAll(`#dots-${sliderId} .slider-dot`);
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === state.currentIndex);
    });
}


// ========================================
// Funciones de navegación del slider
// ========================================
function slideVoces(direction) {
    slide('voces', direction);
}

function slideSonidos(direction) {
    slide('sonidos', direction);
}

function slideFondos(direction) {
    slide('fondos', direction);
}

function slide(sliderId, direction) {
    const track = document.getElementById(`slider-${sliderId}`);
    const items = track.querySelectorAll('.slider-item');
    const state = sliderStates[sliderId];
    const totalPages = Math.ceil(items.length / state.itemsPerView);
    
    state.currentIndex += direction;
    
    // Limitar índice
    if (state.currentIndex < 0) {
        state.currentIndex = 0;
    } else if (state.currentIndex >= totalPages) {
        state.currentIndex = totalPages - 1;
    }
    
    updateSliderPosition(sliderId);
}

function goToSlide(sliderId, index) {
    const state = sliderStates[sliderId];
    state.currentIndex = index;
    updateSliderPosition(sliderId);
}


// ========================================
// Gestión de categorías
// ========================================
function showCategory(categoryId) {
    // Obtener todas las categorías y botones
    const categories = document.querySelectorAll('.category');
    const tabButtons = document.querySelectorAll('.tab-button');
    
    // Ocultar todas las categorías y desactivar botones
    categories.forEach(category => {
        category.classList.remove('active');
    });
    
    tabButtons.forEach(button => {
        button.classList.remove('active');
        button.setAttribute('aria-selected', 'false');
    });
    
    // Mostrar la categoría seleccionada
    const selectedCategory = document.getElementById(categoryId);
    if (selectedCategory) {
        selectedCategory.classList.add('active');
    }
    
    // Activar el botón correspondiente
    const activeButton = document.querySelector(`[onclick="showCategory('${categoryId}')"]`);
    if (activeButton) {
        activeButton.classList.add('active');
        activeButton.setAttribute('aria-selected', 'true');
    }
}


// ========================================
// Reproducción de audio y adición de texto
// ========================================
function playAudioAndAddText(audioFile, text) {
    // Detener audio anterior si existe
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }
    
    // Crear y reproducir nuevo audio
    currentAudio = new Audio(audioFile);
    
    // Manejar errores de reproducción
    currentAudio.addEventListener('error', function() {
        console.error('Error al cargar el audio:', audioFile);
        showNotification('No se pudo reproducir el audio', 'error');
    });
    
    currentAudio.play().catch(error => {
        console.error('Error al reproducir:', error);
        showNotification('Error al reproducir el audio', 'error');
    });
    
    // Añadir texto al textarea
    const textarea = document.querySelector('.editable-area');
    if (textarea) {
        // Añadir espacio si ya hay contenido
        const currentValue = textarea.value.trim();
        textarea.value = currentValue ? currentValue + ' ' + text : text;
        
        // Enfocar el textarea
        textarea.focus();
        
        // Scroll al final del texto
        textarea.scrollTop = textarea.scrollHeight;
        
        // Efecto visual de feedback
        textarea.style.borderColor = 'var(--primary-color)';
        setTimeout(() => {
            textarea.style.borderColor = '';
        }, 300);
    }
}


// ========================================
// Sistema de notificaciones
// ========================================
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Estilos inline para la notificación
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        backgroundColor: type === 'error' ? '#ff6b6b' : '#6441a5',
        color: 'white',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        zIndex: '1000',
        animation: 'slideInRight 0.3s ease-out',
        fontWeight: '500'
    });
    
    document.body.appendChild(notification);
    
    // Eliminar después de 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}


// ========================================
// Modo oscuro
// ========================================
function initDarkMode() {
    // Obtener preferencia guardada o establecer modo oscuro por defecto
    let darkModePreference = localStorage.getItem('darkMode');
    
    // Si no hay preferencia, establecer modo oscuro como predeterminado
    if (!darkModePreference) {
        localStorage.setItem('darkMode', 'enabled');
        darkModePreference = 'enabled';
    }
    
    // Aplicar el modo según la preferencia
    if (darkModePreference === 'enabled') {
        body.classList.add('dark-mode');
        updateDarkModeButton(true);
    } else {
        updateDarkModeButton(false);
    }
}

function updateDarkModeButton(isDark) {
    const icon = darkModeToggle.querySelector('i');
    const text = darkModeToggle.querySelector('span');
    
    if (isDark) {
        icon.className = 'fas fa-sun';
        text.textContent = 'Modo Claro';
    } else {
        icon.className = 'fas fa-moon';
        text.textContent = 'Modo Oscuro';
    }
}

function toggleDarkMode() {
    body.classList.toggle('dark-mode');
    
    const isDarkMode = body.classList.contains('dark-mode');
    
    // Guardar preferencia
    localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
    
    // Actualizar botón
    updateDarkModeButton(isDarkMode);
    
    // Animación suave
    body.style.transition = 'background 0.3s ease, color 0.3s ease';
}

// Event listener para el botón de modo oscuro
if (darkModeToggle) {
    darkModeToggle.addEventListener('click', toggleDarkMode);
}


// ========================================
// Utilidades
// ========================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}


// ========================================
// Inicialización
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar modo oscuro
    initDarkMode();
    
    // Inicializar sliders
    initSliders();
});


// ========================================
// Atajos de teclado
// ========================================
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K para limpiar el textarea
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const textarea = document.querySelector('.editable-area');
        if (textarea) {
            textarea.value = '';
            showNotification('Texto limpiado', 'info');
        }
    }
    
    // Ctrl/Cmd + D para alternar modo oscuro
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        toggleDarkMode();
    }
    
    // Flechas izquierda/derecha para navegar en el slider activo
    const activeCategory = document.querySelector('.category.active');
    if (activeCategory && !e.target.matches('textarea, input')) {
        const categoryId = activeCategory.id;
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            slide(categoryId, -1);
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            slide(categoryId, 1);
        }
    }
});


// ========================================
// Animaciones CSS adicionales
// ========================================
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);


// ========================================
// Prevenir comportamiento por defecto
// ========================================
document.addEventListener('dragstart', function(e) {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
    }
});


// ========================================
// Auto-resize del textarea
// ========================================
const textarea = document.querySelector('.editable-area');
if (textarea) {
    textarea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.max(140, this.scrollHeight) + 'px';
    });
}


// ========================================
// Soporte táctil para sliders en móvil
// ========================================
function initTouchSupport() {
    const sliders = ['voces', 'sonidos', 'fondos'];
    
    sliders.forEach(sliderId => {
        const wrapper = document.querySelector(`#slider-${sliderId}`);
        if (!wrapper) return;
        
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        
        wrapper.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        });
        
        wrapper.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
        });
        
        wrapper.addEventListener('touchend', () => {
            if (!isDragging) return;
            
            const diff = startX - currentX;
            const threshold = 50;
            
            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    slide(sliderId, 1);
                } else {
                    slide(sliderId, -1);
                }
            }
            
            isDragging = false;
        });
    });
}

// Inicializar soporte táctil después de cargar
document.addEventListener('DOMContentLoaded', initTouchSupport);


// ========================================
// Logging para debug
// ========================================
console.log('🎵 TTS MrMeijin - Sistema cargado correctamente');
console.log('💡 Atajos: Ctrl+K (limpiar), Ctrl+D (modo oscuro), ←/→ (navegar slider)');
console.log('📱 Desliza horizontalmente en móvil para navegar');
