// Variable global para el audio actual
let currentAudio = null;

// Seleccionar el botón y el cuerpo del documento
const darkModeToggle = document.getElementById('dark-mode-toggle');
const body = document.body;

function showCategory(categoryId) {
  // Ocultar todas las categorías
  const categories = document.querySelectorAll('.category');
  categories.forEach(category => {
    category.classList.remove('active');
  });

  // Mostrar la categoría seleccionada
  const selectedCategory = document.getElementById(categoryId);
  if (selectedCategory) {
    selectedCategory.classList.add('active');
  }
}

function playAudioAndAddText(audioFile, text) {
  // Si hay un audio en reproducción, lo detenemos
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0; // Reiniciamos el audio
  }

  // Creamos un nuevo objeto Audio y lo asignamos a currentAudio
  currentAudio = new Audio(audioFile);
  currentAudio.play();

  // Seleccionamos el textarea
  const textarea = document.querySelector('.text-box-container textarea');

  // Concatenar el texto al contenido actual (sin saltos de línea)
  textarea.value += (textarea.value.trim() ? ' ' : '') + text;
}

// Verificar si hay una preferencia guardada en el almacenamiento local
const darkModePreference = localStorage.getItem('darkMode');
if (darkModePreference === 'enabled') {
    body.classList.add('dark-mode');
    darkModeToggle.textContent = 'Modo Claro';
}

// Agregar un evento al botón para alternar el modo oscuro
darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');

    // Cambiar el texto del botón según el estado
    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'enabled');
        darkModeToggle.textContent = 'Modo Claro';
    } else {
        localStorage.setItem('darkMode', 'disabled');
        darkModeToggle.textContent = 'Modo Oscuro';
    }
});
