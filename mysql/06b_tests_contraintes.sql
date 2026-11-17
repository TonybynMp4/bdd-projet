-- 6.3 Vérification des contraintes : chaque INSERT doit être refusé.
-- À exécuter avec l'option --force pour que le client continue après chaque erreur.

SET NAMES utf8mb4;

-- b) date de retour avant la date de location -> violation de chk_dates_location
INSERT INTO location (voiture_id, client_id, date_location, date_retour)
VALUES (1, 8, '2026-12-10', '2026-12-05');

-- a) Sophie Bernard (client 1) a déjà la voiture 3 du 10 au 24 novembre 2026
INSERT INTO location (voiture_id, client_id, date_location, date_retour)
VALUES (1, 1, '2026-11-20', '2026-11-27');

-- c) la voiture 13 (Toyota RAV4) n'est pas disponible
INSERT INTO location (voiture_id, client_id, date_location, date_retour)
VALUES (13, 8, '2026-12-01', '2026-12-05');

-- Aucune ligne n'a été ajoutée
SELECT COUNT(*) AS nombre_locations FROM location;
