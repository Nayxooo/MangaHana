// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// Change l'affiche de la section populaire toutes les 8 secondes avec un fondu
// et permet de changer les affiches via les flèches
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

const mangaFlexes = document.querySelectorAll('.manga-flex');
let currentIndex = 0;
let autoChangeInterval;
        
function showManga(index) {
    mangaFlexes.forEach((manga, i) => {
        manga.classList.toggle('hidden', i !== index);
    });
}
        
function nextManga() {
    currentIndex = (currentIndex + 1) % mangaFlexes.length;
    showManga(currentIndex);
}
        
function prevManga() {
    currentIndex = (currentIndex - 1 + mangaFlexes.length) % mangaFlexes.length;
    showManga(currentIndex); 
}
        
        
document.getElementById('next-btn').addEventListener('click', () => {
    clearInterval(autoChangeInterval); 
    currentIndex = (currentIndex + 1) % mangaFlexes.length; 
    showManga(currentIndex); 
});
            
document.getElementById('prev-btn').addEventListener('click', () => {
    clearInterval(autoChangeInterval); 
    currentIndex = (currentIndex - 1 + mangaFlexes.length) % mangaFlexes.length; 
    showManga(currentIndex); 
});
        
showManga(currentIndex);