-- 4. Mises à jour

SET NAMES utf8mb4;

-- 4.1 Changer la couleur de la voiture n°5 (Renault Clio)
UPDATE voiture SET couleur = 'Noir' WHERE id = 5;

SELECT id, marque, modele, couleur FROM voiture WHERE id = 5;

-- 4.2 Augmenter de 10 % le prix de location des voitures de plus de 5 ans
SELECT id, marque, modele, annee, prix_location_jour FROM voiture
WHERE annee < YEAR(CURDATE()) - 5;

UPDATE voiture
SET prix_location_jour = ROUND(prix_location_jour * 1.10, 2)
WHERE annee < YEAR(CURDATE()) - 5;

SELECT id, marque, modele, annee, prix_location_jour FROM voiture
WHERE annee < YEAR(CURDATE()) - 5;

-- 4.3 Rendre disponibles les voitures de moins de 20 000 km
UPDATE voiture SET disponibilite = 1 WHERE kilometrage < 20000;

SELECT id, marque, modele, kilometrage, disponibilite FROM voiture
WHERE kilometrage < 20000;

-- 4.4 Ajouter 450 km à la voiture n°2 (Honda Civic) au retour d'une location
UPDATE voiture SET kilometrage = kilometrage + 450 WHERE id = 2;

SELECT id, marque, modele, kilometrage FROM voiture WHERE id = 2;
