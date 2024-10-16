fetch('/api/manga-data')
    .then(response => response.json())
    .then(data => {
        const mangaList = Object.keys(data).map(key => ({ name: data[key].Nom, url: `/${key}` }));

        const randomMangaLink = document.getElementById('randomMangaLink');
        
        randomMangaLink.addEventListener('click', function(event) {
            event.preventDefault(); 
            const randomIndex = Math.floor(Math.random() * mangaList.length);
            const selectedManga = mangaList[randomIndex];
            window.location.href = selectedManga.url;
        });
    })