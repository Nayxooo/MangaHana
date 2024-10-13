// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// Change l'affiche de la section populaire toutes les 8 secondes avec un fondu
// et permet de changer les affiches via les flèches
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

const mangaFlexes = document.querySelectorAll('.manga-flex');
const fadeElement = document.getElementById('fade');
let currentIndex = 0;
let autoChangeInterval;
        
function showManga(index) {
    mangaFlexes.forEach((manga, i) => {
        manga.classList.toggle('hidden', i !== index);
    });
}
        
function nextManga() {
    fadeElement.classList.add('active'); 
        
    setTimeout(() => {
        currentIndex = (currentIndex + 1) % mangaFlexes.length;
        showManga(currentIndex);
        fadeElement.classList.remove('active'); 
    }, 500); 
}
        
function prevManga() {
    currentIndex = (currentIndex - 1 + mangaFlexes.length) % mangaFlexes.length;
    showManga(currentIndex); 
}
        
function resetAutoChange() {
    clearInterval(autoChangeInterval); 
    autoChangeInterval = setInterval(nextManga, 12000); 
}
        
document.getElementById('next-btn').addEventListener('click', () => {
    clearInterval(autoChangeInterval); 
    currentIndex = (currentIndex + 1) % mangaFlexes.length; 
    showManga(currentIndex); 
    resetAutoChange(); 
});
            
document.getElementById('prev-btn').addEventListener('click', () => {
    clearInterval(autoChangeInterval); 
    currentIndex = (currentIndex - 1 + mangaFlexes.length) % mangaFlexes.length; 
    showManga(currentIndex); 
    resetAutoChange(); 
});
        
showManga(currentIndex);
        
autoChangeInterval = setInterval(nextManga, 12000);