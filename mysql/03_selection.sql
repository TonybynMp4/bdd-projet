-- 3. Requêtes de sélection

SET NAMES utf8mb4;

-- 3.1 Voitures d'un modèle et d'une couleur donnés
SELECT * FROM voiture
WHERE modele = 'Civic' AND couleur = 'Rouge';

-- 3.2 Les 3 voitures les plus anciennes
SELECT id, marque, modele, annee FROM voiture
ORDER BY annee ASC
LIMIT 3;

-- 3.3 Voitures dont le prix d'achat est supérieur à la moyenne
SELECT id, marque, modele, prix_achat FROM voiture
WHERE prix_achat > (SELECT AVG(prix_achat) FROM voiture);

-- 3.4 Voitures disponibles triées par prix de location croissant
SELECT id, marque, modele, prix_location_jour FROM voiture
WHERE disponibilite = 1
ORDER BY prix_location_jour ASC;

-- 3.5 Nombre de voitures par marque
SELECT marque, COUNT(*) AS nombre_voitures FROM voiture
GROUP BY marque
ORDER BY nombre_voitures DESC, marque;

-- 3.6 Voitures bleues dont le prix d'achat dépasse 10 000
SELECT id, marque, modele, couleur, prix_achat FROM voiture
WHERE couleur = 'Bleu' AND prix_achat > 10000;

-- 3.7 Voitures à plus de 30 000 à l'achat et plus de 500 par jour
SELECT id, marque, modele, prix_achat, prix_location_jour FROM voiture
WHERE prix_achat > 30000 AND prix_location_jour > 500;

-- 3.8 Voitures dont le rapport prix d'achat / prix de location dépasse 50
SELECT id, marque, modele, prix_achat, prix_location_jour,
       ROUND(prix_achat / prix_location_jour, 1) AS rapport
FROM voiture
WHERE prix_achat / prix_location_jour > 50
ORDER BY rapport DESC;

-- 3.9 Voitures dont l'année est impaire
SELECT id, marque, modele, annee FROM voiture
WHERE annee % 2 = 1;

-- 3.10 Les 5 voitures les moins chères à la location
SELECT id, marque, modele, prix_location_jour FROM voiture
ORDER BY prix_location_jour ASC
LIMIT 5;

-- 3.11 Marques des voitures disponibles avec moins de 100 000 km
SELECT DISTINCT marque FROM voiture
WHERE disponibilite = 1 AND kilometrage < 100000
ORDER BY marque;

-- 3.12 Voitures apparaissant au moins une fois dans location
-- La table location n'existe qu'à partir de la section 6 :
-- cette requête est exécutée à la fin de 06_relations_contraintes.sql.

-- 3.13 Les 10 voitures ajoutées le plus récemment (id auto-incrémenté = ordre d'ajout)
SELECT id, marque, modele, annee FROM voiture
ORDER BY id DESC
LIMIT 10;

-- 3.14 Voitures dans les 20 % les plus chères à l'achat
SELECT id, marque, modele, prix_achat
FROM (
    SELECT *, PERCENT_RANK() OVER (ORDER BY prix_achat DESC) AS rang
    FROM voiture
) AS classement
WHERE rang < 0.2
ORDER BY prix_achat DESC;

-- 3.15 Nombre de voitures par couleur, de la plus fréquente à la moins fréquente
SELECT couleur, COUNT(*) AS nombre_voitures FROM voiture
GROUP BY couleur
ORDER BY nombre_voitures DESC, couleur;

-- 3.16 Voitures entre 50 000 et 100 000 km
SELECT id, marque, modele, kilometrage FROM voiture
WHERE kilometrage BETWEEN 50000 AND 100000;

-- 3.17 Voitures dont le prix de location est inférieur à la moyenne
SELECT id, marque, modele, prix_location_jour FROM voiture
WHERE prix_location_jour < (SELECT AVG(prix_location_jour) FROM voiture);

-- 3.18 Écart entre prix d'achat et prix de location journalier
SELECT id, marque, modele, prix_achat, prix_location_jour,
       prix_achat - prix_location_jour AS ecart
FROM voiture;

-- 3.19 Voitures disponibles postérieures à 2015
SELECT id, marque, modele, annee FROM voiture
WHERE disponibilite = 1 AND annee > 2015;

-- 3.20 Toyota à moins de 100 par jour et moins de 10 000 km
SELECT * FROM voiture
WHERE marque = 'Toyota' AND prix_location_jour < 100 AND kilometrage < 10000;
