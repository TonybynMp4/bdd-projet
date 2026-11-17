-- 9. Jointures complémentaires

SET NAMES utf8mb4;

-- 9.1 Clients avec le modèle de chaque voiture louée (locations passées et en cours)
SELECT c.nom, c.email, v.modele, l.date_location
FROM client c
JOIN location l ON l.client_id = c.id
JOIN voiture  v ON v.id = l.voiture_id
ORDER BY c.nom, l.date_location;

-- 9.2 Clients ayant loué la même voiture plusieurs fois
SELECT c.nom, v.marque, v.modele, COUNT(*) AS nombre_locations
FROM location l
JOIN client  c ON c.id = l.client_id
JOIN voiture v ON v.id = l.voiture_id
GROUP BY c.id, c.nom, v.id, v.marque, v.modele
HAVING COUNT(*) > 1;

-- 9.3 Clients n'ayant jamais loué de voiture
SELECT c.id, c.nom, c.email
FROM client c
LEFT JOIN location l ON l.client_id = c.id
WHERE l.id IS NULL;

-- 9.4 Clients ayant loué une Toyota
SELECT DISTINCT c.nom, c.email
FROM client c
JOIN location l ON l.client_id = c.id
JOIN voiture  v ON v.id = l.voiture_id
WHERE v.marque = 'Toyota'
ORDER BY c.nom;

-- 9.5 Pour chaque voiture louée : modèle, première et dernière date de location
SELECT v.id, v.marque, v.modele,
       MIN(l.date_location) AS premiere_location,
       MAX(l.date_location) AS derniere_location
FROM voiture v
JOIN location l ON l.voiture_id = v.id
GROUP BY v.id, v.marque, v.modele
ORDER BY v.id;

-- 9.6 Clients ayant loué entre le 1er janvier et le 31 décembre 2023
SELECT DISTINCT c.nom, c.email
FROM client c
JOIN location l ON l.client_id = c.id
WHERE l.date_location BETWEEN '2023-01-01' AND '2023-12-31'
ORDER BY c.nom;

-- 9.7 Voitures jamais louées
SELECT v.id, v.marque, v.modele
FROM voiture v
LEFT JOIN location l ON l.voiture_id = v.id
WHERE l.id IS NULL;

-- 9.8 Nombre total de jours de location par voiture
SELECT v.id, v.marque, v.modele,
       SUM(DATEDIFF(l.date_retour, l.date_location)) AS total_jours
FROM voiture v
JOIN location l ON l.voiture_id = v.id
GROUP BY v.id, v.marque, v.modele
ORDER BY total_jours DESC;

-- 9.9 Nombre de voitures différentes louées par chaque client
SELECT c.nom, COUNT(DISTINCT l.voiture_id) AS voitures_differentes
FROM client c
LEFT JOIN location l ON l.client_id = c.id
GROUP BY c.id, c.nom
ORDER BY voitures_differentes DESC, c.nom;

-- 9.10 Voitures louées par au moins 2 clients différents
SELECT v.id, v.marque, v.modele, COUNT(DISTINCT l.client_id) AS clients_differents
FROM voiture v
JOIN location l ON l.voiture_id = v.id
GROUP BY v.id, v.marque, v.modele
HAVING COUNT(DISTINCT l.client_id) >= 2
ORDER BY clients_differents DESC, v.id;

-- 9.11 Client ayant dépensé le plus
SELECT c.nom, SUM(l.prix_total) AS total_depense
FROM client c
JOIN location l ON l.client_id = c.id
GROUP BY c.id, c.nom
ORDER BY total_depense DESC
LIMIT 1;

-- 9.12 Location la plus longue de chaque client
SELECT nom, modele, date_location, date_retour, duree_jours
FROM (
    SELECT c.nom, v.modele, l.date_location, l.date_retour,
           DATEDIFF(l.date_retour, l.date_location) AS duree_jours,
           RANK() OVER (PARTITION BY c.id ORDER BY DATEDIFF(l.date_retour, l.date_location) DESC) AS rang
    FROM client c
    JOIN location l ON l.client_id = c.id
    JOIN voiture  v ON v.id = l.voiture_id
) AS locations_classees
WHERE rang = 1
ORDER BY duree_jours DESC;

-- 9.13 Voitures louées plus d'une fois : modèle, première et dernière date de location
SELECT v.id, v.marque, v.modele, COUNT(*) AS nombre_locations,
       MIN(l.date_location) AS premiere_location,
       MAX(l.date_location) AS derniere_location
FROM voiture v
JOIN location l ON l.voiture_id = v.id
GROUP BY v.id, v.marque, v.modele
HAVING COUNT(*) > 1
ORDER BY v.id;

-- 9.14 Nombre total de jours de location par client
SELECT c.nom, SUM(DATEDIFF(l.date_retour, l.date_location)) AS total_jours
FROM client c
JOIN location l ON l.client_id = c.id
GROUP BY c.id, c.nom
ORDER BY total_jours DESC;

-- 9.15 Voitures louées par un seul client
SELECT v.id, v.marque, v.modele, MIN(c.nom) AS client
FROM voiture v
JOIN location l ON l.voiture_id = v.id
JOIN client   c ON c.id = l.client_id
GROUP BY v.id, v.marque, v.modele
HAVING COUNT(DISTINCT l.client_id) = 1
ORDER BY v.id;

-- 9.16 Durée moyenne de location de chaque client
SELECT c.nom, ROUND(AVG(DATEDIFF(l.date_retour, l.date_location)), 1) AS duree_moyenne_jours
FROM client c
JOIN location l ON l.client_id = c.id
GROUP BY c.id, c.nom
ORDER BY duree_moyenne_jours DESC;

-- 9.17 Clients ayant loué des voitures de marques différentes
SELECT c.nom, COUNT(DISTINCT v.marque) AS marques_differentes,
       GROUP_CONCAT(DISTINCT v.marque ORDER BY v.marque SEPARATOR ', ') AS marques
FROM client c
JOIN location l ON l.client_id = c.id
JOIN voiture  v ON v.id = l.voiture_id
GROUP BY c.id, c.nom
HAVING COUNT(DISTINCT v.marque) > 1
ORDER BY marques_differentes DESC, c.nom;

-- 9.18 Client ayant loué le plus de voitures différentes
SELECT c.nom, COUNT(DISTINCT l.voiture_id) AS voitures_differentes
FROM client c
JOIN location l ON l.client_id = c.id
GROUP BY c.id, c.nom
ORDER BY voitures_differentes DESC, c.nom
LIMIT 1;

-- 9.19 Location la plus chère de chaque client
SELECT nom, modele, date_location, prix_total
FROM (
    SELECT c.nom, v.modele, l.date_location, l.prix_total,
           RANK() OVER (PARTITION BY c.id ORDER BY l.prix_total DESC) AS rang
    FROM client c
    JOIN location l ON l.client_id = c.id
    JOIN voiture  v ON v.id = l.voiture_id
) AS locations_classees
WHERE rang = 1
ORDER BY prix_total DESC;

-- 9.20 Clients dont la durée moyenne de location dépasse 7 jours
SELECT c.nom, ROUND(AVG(DATEDIFF(l.date_retour, l.date_location)), 1) AS duree_moyenne_jours
FROM client c
JOIN location l ON l.client_id = c.id
GROUP BY c.id, c.nom
HAVING AVG(DATEDIFF(l.date_retour, l.date_location)) > 7
ORDER BY duree_moyenne_jours DESC;
