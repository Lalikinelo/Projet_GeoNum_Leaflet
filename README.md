# Projet_GeoNum_Leaflet
Projet javascript/Leaflet - Master 2 GeoNum

Titre:
Carte de la pollution aux particules fines à Lyon. 
Prendre le métro pour limiter les émissions: quel parking optimal pour son véhicule ?

Objectifs:
- Utiliser un maximum de fonctionnalités de la bibliotheque Leaflet JS pour monter en compétences
- Faciliter et encourager le parking des véhicules des automobilistes à proximité des arrêts de metro

Couches affichées:
- Lignes de Metro et accès aux stations de metro
- Concentration en particules fines 2.5 PM par IRIS
- Parkings

Fonctionnalités:
- Chargement de données vecteur (géométrie en polygone) de la pollution par IRIS: geoJson par URL et fichier local,  shapfile.
- Utilisition des plugins shpfile, animatedMarkers et MarkerCluster.
- Affichage de geometries ponctuelles et lignes des métros avec adaptation des styles (couleur, icones)
- Animation en lien avec la souris: Mise en valeur dune icone, création de buffer de 300m autur des parkings, démarrage d'une animation, affichage d'informations liées au parking
- Affichage d'une légende et d'un controle de coouches de données.

Sources de données:
Concentration annuelle en pm2.5 par IRIS, les lignes de métro de Lyon et les accès aux stations (source data Grand Lyon), et les parkings de la zone.

Remarque:
Pour faire fonctionner toutes les fonctionnalités (notamment le chargement du shapefile), le fichier html doit être intérprété par un navigateur via un serveur web. 
Pour le développement , le serveur http de python 3.10 a été utilisé.

Difficultés rencontrées (et résolues avec les autres étudiants du master, la documentation Leaflet, stackexchange):
- Marqeurs animés: Inversion des coordonnées pour les marqueurs animés.
- Création de la légende: Le nom des lignes de metro a été codé en dur. Impossible de récupérer le nom des lignes de métro depuis le fichier shapfile sans ajouter un délais. 
  En effet, La légende est créée avant la fin de la lecture et l'exploitation du shapefile.
- Création du controle de couches: Même problème. Obligé de rajouter un délais de 8s avant la création du controle de couches pour laisser le temps au programme de lire toutes les données
- Ajout des parking et des buffer et leur animation.
- Nettoyage des données des lignes de metro car certaines lignes étaient enregistrées dans les 2 sens.


Le travail a été en partie effectué en binôme avec avec Saulo.
Merci Mickael Perrier (Lyon2/ENSLyon/UJM) votre cours et ce projet qui m'a permis de me progresser en javascript!
