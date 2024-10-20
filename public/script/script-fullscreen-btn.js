document.getElementById("fullscreen-btn").addEventListener("click", function() {
    if (!document.fullscreenElement) {
        // Si l'écran n'est pas déjà en mode plein écran, on entre en mode plein écran
        document.documentElement.requestFullscreen();
    } else {
        // Sinon, on quitte le mode plein écran
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
});