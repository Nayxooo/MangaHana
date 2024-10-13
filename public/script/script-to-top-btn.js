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