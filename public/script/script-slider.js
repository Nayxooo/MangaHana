const Slider1 = document.getElementById('Slider1');
const Slider2 = document.getElementById('Slider2');
const inner = Slider1.querySelector('.inner');
const inner2 = Slider2.querySelector('.inner');

setInterval(() => {
    inner.classList.remove('inner');
    void inner.offsetWidth; 
    inner.classList.add('inner'); 
}, 25000); 

setInterval(() => {
    inner2.classList.remove('inner');
    void inner.offsetWidth; 
    inner2.classList.add('inner'); 
}, 25000); 