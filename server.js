    const express = require('express');
    const fs = require('fs');
    const path = require('path');
    // const rateLimit = require('express-rate-limit'); 

    const app = express();
    const PORT = 3000;

    // Limite de requête par IP à 120 par fenêtre de 15 minutes
    // const limiter = rateLimit({
    //     windowMs: 15 * 60 * 1000, 
    //     max: 120, 
    //     message: 'Trop de requêtes, veuillez réessayer plus tard.', 
    // });

    // // Application du middleware à toutes les routes API
    // app.use('/api/', limiter);

    // Donne l'accès au robots.txt
    app.get('/robots.txt', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'robots.txt')); 
    });

    // Route pour la page profil.html
    app.get('/profil', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'profil.html')); 
    });

    app.get('/catalogue', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'catalogue.html')); 
    });

    app.get('/about-us', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'a-propos.html')); 
    });

    app.get('/privacy-policy', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'privacy-policy.html')); 
    });

    app.get('/dmca', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'dmca.html')); 
    });

    app.get('/manifest.json', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'manifest.json')); 
    });

    app.get('/service-worker.js', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'service-worker.js')); 
    });

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
        const mangaDir = path.join(__dirname, 'scans', manga);

        fs.access(mangaDir, fs.constants.F_OK, (err) => {
            if (err) {
                return res.redirect('/');
            }
            res.sendFile(path.join(__dirname, 'public', 'manga.html'));
        });
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

            const chapters = files.filter(file => fs.statSync(path.join(chaptersDir, file)).isDirectory());

            // trie les chapitres comme des nombres (éviter que 10 soit au dessus de 1)
            chapters.sort((a, b) => parseInt(a) - parseInt(b));

            res.json(chapters); 
        });
    });

    // API pour obtenir les pages disponibles d'un chapitre
    app.get('/api/:manga/chapters/:chapter/pages', (req, res) => {
        const manga = req.params.manga;
        const chapter = req.params.chapter;
        const chapterDir = path.join(__dirname, 'scans', manga, chapter); 

        fs.readdir(chapterDir, (err, files) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Erreur de lecture des pages');
            }

            const pages = files.filter(file => /\.(jpg|jpeg|png|gif)$/.test(file));

            // Trie les pages numériquement si elles sont nommées avec des nombres
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

    // API pour obtenir le dernier chapitre disponible d'un manga
    app.get('/api/:manga/last-chapter', (req, res) => {
        const manga = req.params.manga;
        const chaptersDir = path.join(__dirname, 'scans', manga); 

        fs.readdir(chaptersDir, (err, files) => {
            if (err) {
                console.error(`Erreur de lecture des chapitres pour ${manga}:`, err);
                return res.status(500).send('Erreur lors de la lecture des chapitres');
            }
            const chapters = files.filter(file => fs.statSync(path.join(chaptersDir, file)).isDirectory());

            if (chapters.length > 0) {
                chapters.sort((a, b) => parseInt(a) - parseInt(b));

                // Prends le dernier chapitre
                const lastChapter = chapters[chapters.length - 1];
                res.json({ dernierChapitre: lastChapter });
            } else {
                res.json({ dernierChapitre: null }); 
            }
        });
    });

    // Route dynamique pour les tags
    app.get('/catalogue/:tag', (req, res) => {
        const tag = req.params.tag.toLowerCase();

        // Liste des tags autorisés
        const tags = [
            'action', 'aventure', 'comedie', 'drame', 'ecchi', 'fantaisie', 
            'horreur', 'mystere', 'romance', 'science-fiction', 'slice-of-life', 
            'sports', 'suspense'
        ];

        // Vérifier si le tag est valide
        if (!tags.includes(tag)) {
            return res.redirect('/catalogue'); // Rediriger si le tag n'est pas dans la liste
        }

        // Lire le fichier tag.html
        const filePath = path.join(__dirname, 'public', 'tag.html');
        fs.readFile(filePath, 'utf8', (err, html) => {
            if (err) {
                console.error('Erreur de lecture du fichier tag.html', err);
                return res.status(500).send('Erreur interne du serveur');
            }

            // Remplacer les placeholders avec le tag
            const title = `${tag.charAt(0).toUpperCase() + tag.slice(1)} | MangaHana`;
            const renderedHtml = html
                .replace(/{{title}}/g, title) // Remplacer le title
                .replace(/{{tag}}/g, tag.charAt(0).toUpperCase() + tag.slice(1)); // Remplacer le h1

            res.send(renderedHtml);
        });
    });




    // Servir le dossier 'public' pour le contenu statique
    app.use(express.static(path.join(__dirname, 'public')));
    // Servir le dossier 'scans' pour accéder aux images
    app.use('/scans', express.static(path.join(__dirname, 'scans')));

    // Route pour afficher les chapitres d'un manga donné
    app.get('/:manga/:chapter', (req, res) => {
        const manga = req.params.manga;
        const chapter = req.params.chapter;
        const mangaDir = path.join(__dirname, 'scans', manga); 
        const chapterDir = path.join(mangaDir, chapter); 

        // Vérifie si le répertoire du manga existe
        fs.access(mangaDir, fs.constants.F_OK, (err) => {
            if (err) {
                // Renvoie vers l'accueil si le manga n'existe pas
                return res.redirect('/');
            }

            fs.access(chapterDir, fs.constants.F_OK, (chapterErr) => {
                if (chapterErr) {
                    return res.redirect(`/${manga}`);
                }

                // Renvoie vers la page si le lien est bon
                res.sendFile(path.join(__dirname, 'public', 'scan.html'));
            });
        });
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
