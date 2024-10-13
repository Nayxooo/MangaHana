import requests
import os

def download_image(url, folder, image_name):
    """Télécharge une image et la sauvegarde dans un dossier donné."""
    if not os.path.exists(folder):
        os.makedirs(folder)
    
    response = requests.get(url)
    
    if response.status_code == 200:
        image_path = os.path.join(folder, image_name)
        with open(image_path, 'wb') as f:
            f.write(response.content)
        print(f'Téléchargé : {image_path}')
    else:
        print(f'Erreur lors du téléchargement de {url}: {response.status_code}')

def download_images_from_chapters(start_chapter, end_chapter):
    """Télécharge toutes les images des chapitres spécifiés et les place dans scans/jujutsu-kaisen."""
    base_url = 'https://anime-sama.fr/s2/scans/frieren'
    base_folder = 'scans/frieren'

    for chapter in range(start_chapter, end_chapter + 1):
        folder_name = os.path.join(base_folder, str(chapter))  # Dossier pour chaque chapitre
        # folder_name = os.path.join(base_folder, str(chapter-1)) Si il y a un chapitre 0
        chapter_url = f'{base_url}/{chapter}/'
        
        # Supposition de 30 pages par chapitre, à améliorer si possible
        for image_number in range(1, 30):
            image_url = f'{chapter_url}{image_number}.jpg'
            download_image(image_url, folder_name, f'{image_number}.jpg')

# Chapitres 11 à 126
download_images_from_chapters(110.1, 110.1)

# Exemple :
# download_images_from_chapters(4, 7)
# Téléchargera du chapitre 3 à 6