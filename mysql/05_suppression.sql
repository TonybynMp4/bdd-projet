-- 5. Suppressions

SET NAMES utf8mb4;

-- 5.1 Supprimer la voiture n°11 (Volkswagen Golf)
DELETE FROM voiture WHERE id = 11;

-- 5.2 Supprimer les voitures de plus de 200 000 km
SELECT id, marque, modele, kilometrage FROM voiture WHERE kilometrage > 200000;

DELETE FROM voiture WHERE kilometrage > 200000;

-- 5.3 Supprimer les voitures antérieures à 2000
SELECT id, marque, modele, annee FROM voiture WHERE annee < 2000;

DELETE FROM voiture WHERE annee < 2000;

-- Voitures restantes
SELECT id, marque, modele, annee, kilometrage FROM voiture;
