// SEARCHBAR de la NAVBAR
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search_text');
    const searchResults = document.getElementById('search-results');

    function handleSearchInput() {
        const searchQuery = searchInput.value.toLowerCase();
        searchResults.innerHTML = ''; 

        if (searchQuery.length < 3) {
            searchResults.style.display = 'none'; // Recherche à partir de 3 caractères
            return;
        }

        fetch('/api/manga-data')
            .then(response => response.json())
            .then(data => {
                const filteredResults = Object.keys(data).filter(key => 
                    data[key].Nom.toLowerCase().includes(searchQuery) ||
                    data[key].Alias.toLowerCase().includes(searchQuery)
                );

                if (filteredResults.length > 0) {
                    searchResults.style.display = 'flex'; 
                    
                    // Limite à 6 résultats maximum
                    const maxResults = 6;
                    filteredResults.slice(0, maxResults).forEach((key, index) => {
                        const manga = data[key];
                        const resultItem = document.createElement('a');
                        resultItem.href = `/${key}`; 
                        resultItem.classList.add('search-result-item');

                        const mangaDetails = document.createElement('div');
                        mangaDetails.classList.add('manga-details');

                        const mangaImage = document.createElement('img');
                        mangaImage.src = manga.Image; 
                        mangaImage.alt = `tome-${key}`; 
                        mangaImage.classList.add('img');

                        const mangaInfo = document.createElement('div');
                        mangaInfo.classList.add('infos');
                        const mangaName = document.createElement('p');
                        mangaName.classList.add('bolder');
                        mangaName.textContent = manga.Nom; 
                        const mangaTags = document.createElement('p');
                        mangaTags.classList.add('darker');
                        const tags = manga.Tags;
                        mangaTags.textContent = `Genres : ${tags}`; 

                        mangaInfo.appendChild(mangaName);
                        mangaInfo.appendChild(mangaTags);
                        mangaDetails.appendChild(mangaImage);
                        mangaDetails.appendChild(mangaInfo);

                        resultItem.appendChild(mangaDetails);
                        searchResults.appendChild(resultItem);

                        // Border radius pour le dernier item
                        if (index === filteredResults.slice(0, maxResults).length - 1) {
                            resultItem.style.borderBottomLeftRadius = '8px';
                            resultItem.style.borderBottomRightRadius = '8px';
                        }
                    });
                } else {
                    searchResults.style.display = 'none'; 
                }
            })
            .catch(error => console.error('Erreur lors du chargement des données des mangas:', error));
    }

    searchInput.addEventListener('input', handleSearchInput);

    // Masque les résultats en cliquant à l'extérieur de la searchbar ou des résultats
    document.addEventListener('click', (event) => {
        if (!searchInput.contains(event.target) && !searchResults.contains(event.target)) {
            searchResults.style.display = 'none'; 
        }
    });

    // Réaffiche les résultats en cliquant sur la searchbar (si au moins 3 lettres ont été saisies)
    searchInput.addEventListener('focus', () => {
        if (searchInput.value.length >= 3) {
            searchResults.style.display = 'flex'; 
        }
    });
});

// Reset bouton searchbar
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search_text');
    const clearButton = document.getElementById('clear-button');

    // Fonction pour mettre à jour l'affichage du bouton
    function toggleClearButton() {
        if (searchInput.value.length > 0) {
            clearButton.style.display = 'block'; // Afficher si quelque chose est tapé
        } else {
            clearButton.style.display = 'none'; // Masquer sinon
        }
    }

    // Appeler toggleClearButton dès que la page se charge
    toggleClearButton();

    // Écouter les changements dans le champ de recherche
    searchInput.addEventListener('input', toggleClearButton);

    // Lorsque le bouton est cliqué, on réinitialise le champ et cache le bouton
    clearButton.addEventListener('click', () => {
        searchInput.value = ''; // Vider le champ de recherche
        toggleClearButton(); // Masquer le bouton après la réinitialisation
        searchInput.focus(); // Remettre le focus sur l'input
    });
});

// TO TOP BTN
window.onscroll = function() {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;
    const toTopButton = document.getElementById('to-top-btn');
        
    const showAfter = 100;

    if (scrollPosition < showAfter) {
        toTopButton.style.display = "none";
    } else {
        toTopButton.style.display = "block";
    }
};

document.getElementById('to-top-btn').addEventListener('click', function() {
    window.scrollTo({
      top: 0, 
      behavior: 'smooth' 
    });
});

// SLIDE MENU
const burgerButton = document.querySelector('.burger-menu-btn');
const slideMenu = document.querySelector('.slidemenu');
const closeSlidemenuBtn = document.getElementById('close-slidemenu');
const overlay = document.createElement('div');

overlay.classList.add('overlay');
document.body.appendChild(overlay);

burgerButton.addEventListener('click', () => {
    slideMenu.classList.toggle('open');  
    overlay.classList.toggle('active');  
});

overlay.addEventListener('click', () => {
    slideMenu.classList.remove('open');  
    overlay.classList.remove('active');  
});

closeSlidemenuBtn.addEventListener('click', () => {
    slideMenu.classList.remove('open');  
    overlay.classList.remove('active');  
});

// RANDOM MANGA
fetch('/api/manga-data')
    .then(response => response.json())
    .then(data => {
        // Liste des mangas
        const mangaList = Object.keys(data).map(key => ({ name: data[key].Nom, url: `/${key}` }));

        const randomMangaLinks = document.querySelectorAll('.randomMangaLink');

        randomMangaLinks.forEach(link => {
            link.addEventListener('click', function(event) {
                event.preventDefault(); 
                const randomIndex = Math.floor(Math.random() * mangaList.length); 
                const selectedManga = mangaList[randomIndex]; 
                window.location.href = selectedManga.url; 
            });
        });
    })
    .catch(error => console.error('Erreur lors du chargement des mangas:', error));