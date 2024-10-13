import pandas as pd
import json

def excel_to_json(file_path, output_file='output.json'):
    """
    Convertit un fichier Excel en JSON.
    
    :param file_path: Chemin du fichier Excel à convertir.
    :param output_file: Nom du fichier JSON de sortie.
    """
    
    # Charger le fichier Excel
    df = pd.read_excel('C:\\Users\\noaar\\Desktop\\MangaHana\\bot\\Excel-JSON.xlsx', engine='openpyxl')

    # Afficher les noms de colonnes
    print("Noms de colonnes :", df.columns.tolist())

    # Remplacer les NaN par des chaînes vides
    df = df.fillna("")

    # Créer un dictionnaire pour stocker les résultats
    result = {}

    # Parcourir chaque ligne du DataFrame
    for index, row in df.iterrows():
        # Le nom est dans la colonne 'Noms', et les autres attributs sont dans les autres colonnes
        name = row['Noms']
        result[name] = {
            'Statut': row['Statut'],
            'Auteur(s)': row['Auteur(s)'],
            'Sortie': str(int(row['Sortie'])) if row['Sortie'] != "" else "",  # Enlever le .0
            'Synopsis': row['Synopsis'],
            'Alias': row['Alias'],
            'Tags': row['Tags']
        }
    
    # Écrire les données dans un fichier JSON
    with open(output_file, 'w', encoding='utf-8') as json_file:
        json.dump(result, json_file, ensure_ascii=False, indent=4)
    
    print(f"Fichier JSON généré : {output_file}")

# Exemple d'utilisation
excel_to_json('votre_fichier_excel.xlsx')

