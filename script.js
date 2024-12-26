// Variable global para el audio actual
let currentAudio = null;

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