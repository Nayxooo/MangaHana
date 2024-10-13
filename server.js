const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Route pour obtenir les données des mangas
app.get('/api/manga-data', (req, res) => {
    fs.readFile(path.join(__dirname, 'manga-data.json'), 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erreur lors de la lecture des données des mangas' });
        }
        try {
            res.json(JSON.parse(data)); // Retourner les données JSON
        } catch (parseError) {
            console.error(parseError);
            return res.status(500).json({ error: 'Erreur lors de la conversion des données en JSON' });
        }
    });
});

// Route pour afficher la page manga.html avec les données du manga
app.get('/:manga', (req, res) => {
    const manga = req.params.manga;
    res.sendFile(path.join(__dirname, 'public', 'manga.html')); // Charger manga.html
});

// API pour obtenir la liste des chapitres disponibles d'un manga
app.get('/api/:manga/chapters', (req, res) => {
    const manga = req.params.manga;
    const chaptersDir = path.join(__dirname, 'scans', manga);
    
    fs.readdir(chaptersDir, (err, files) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Erreur de lecture des chapitres');
        }

        // Filtrer les dossiers qui correspondent aux chapitres
        const chapters = files.filter(file => fs.statSync(path.join(chaptersDir, file)).isDirectory());

        // trie les chapitres comme des nombres (éviter que 10 soit au dessus de 1)
        chapters.sort((a, b) => parseInt(a) - parseInt(b));

        res.json(chapters); // Retourner la liste des chapitres
    });
});

// API pour obtenir les pages disponibles d'un chapitre
app.get('/api/:manga/chapters/:chapter/pages', (req, res) => {
    const manga = req.params.manga;
    const chapter = req.params.chapter;
    const chapterDir = path.join(__dirname, 'scans', manga, chapter); // Chemin vers le chapitre

    fs.readdir(chapterDir, (err, files) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Erreur de lecture des pages');
        }

        // Filtrer les fichiers d'images (par exemple : .jpg, .png, etc.)
        const pages = files.filter(file => /\.(jpg|jpeg|png|gif)$/.test(file));

        // Trier les pages numériquement si elles sont nommées avec des nombres
        pages.sort((a, b) => parseInt(a) - parseInt(b));

        res.json(pages); // Retourner la liste des pages
    });
});

// API pour obtenir les pages d'un chapitre spécifique d'un manga
app.get('/api/:manga/chapters/:chapter', (req, res) => {
    const manga = req.params.manga;
    const chapterDir = path.join(__dirname, 'scans', manga, req.params.chapter);
    
    fs.readdir(chapterDir, (err, files) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Erreur de lecture des pages');
        }

        // Filtrer les fichiers d'images
        const pages = files.filter(file => /\.(jpg|jpeg|png|gif)$/.test(file));
        
        pages.sort((a, b) => parseInt(a) - parseInt(b));
        res.json(pages); 
    });
});

// Servir le dossier 'public' pour le contenu statique
app.use(express.static(path.join(__dirname, 'public')));
// Servir le dossier 'scans' pour accéder aux images
app.use('/scans', express.static(path.join(__dirname, 'scans')));

// Route pour les chapitres d'un manga donné
app.get('/:manga/:chapter', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'scan.html')); // Charger directement le fichier scan.html
});

// Route d'accueil
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route pour gérer toutes les autres pages non définies
app.get('*', (req, res) => {
  res.redirect('/');
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
