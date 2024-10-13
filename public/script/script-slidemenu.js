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
