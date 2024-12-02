        // Cambiar entre secciones
        function switchTab(tabId) {
            const contents = document.querySelectorAll('.tab-content');
            contents.forEach(content => content.classList.remove('active'));
            const activeTab = document.getElementById(tabId);
            if (activeTab) activeTab.classList.add('active');
        }

        // Filtrar contenido en las secciones
        function filterContent(section) {
            const input = document.getElementById(`search-${section}`).value.toLowerCase();
            const grid = document.getElementById(`grid-${section}`);
            const cards = grid.querySelectorAll('.card');
        
            cards.forEach(card => {
                if (card.textContent.toLowerCase().includes(input)) {
                    card.classList.remove('hidden'); // Muestra la carta
                } else {
                    card.classList.add('hidden'); // Oculta la carta
                }
            });
        }