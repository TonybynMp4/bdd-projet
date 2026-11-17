-- 7. Jointures
-- Une location est « en cours » si la date du jour est entre date_location et date_retour.

SET NAMES utf8mb4;

-- 7.1 Voitures en location actuellement, avec les informations du client
SELECT v.id AS voiture_id, v.marque, v.modele,
       c.nom, c.email, c.telephone,
       l.date_location, l.date_retour
FROM location l
JOIN voiture v ON v.id = l.voiture_id
JOIN client  c ON c.id = l.client_id
WHERE CURDATE() BETWEEN l.date_location AND l.date_retour;

-- 7.2 Historique complet des locations de la voiture n°1 (Toyota Corolla)
SELECT l.id AS location_id, v.marque, v.modele, c.nom AS client,
       l.date_location, l.date_retour, l.prix_total
FROM location l
JOIN voiture v ON v.id = l.voiture_id
JOIN client  c ON c.id = l.client_id
WHERE v.id = 1
ORDER BY l.date_location;

-- 7.3 Locations en cours du client n°1 (Sophie Bernard)
SELECT c.nom, v.marque, v.modele, l.date_location, l.date_retour, l.prix_total
FROM location l
JOIN voiture v ON v.id = l.voiture_id
JOIN client  c ON c.id = l.client_id
WHERE c.id = 1
  AND CURDATE() BETWEEN l.date_location AND l.date_retour;
