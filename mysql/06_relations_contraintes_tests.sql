-- Tests des contraintes de la section 6.3
-- Les quatre premiers INSERT doivent être refusés. À exécuter avec l'option --force pour que le client continue après chaque erreur.

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

-- c) la voiture 12 (Tesla Model 3) est déjà louée du 1er au 4 septembre 2026
INSERT INTO location (voiture_id, client_id, date_location, date_retour)
VALUES (12, 8, '2026-09-02', '2026-09-03');

-- Une location valide passe, avec prix_total calculé par le trigger (4 jours x 49.50, tarif de la Corolla après la hausse de la section 4)
-- Elle est annulée ensuite pour ne pas modifier les données des sections suivantes.
START TRANSACTION;
INSERT INTO location (voiture_id, client_id, date_location, date_retour)
VALUES (1, 8, '2026-12-01', '2026-12-05');
SELECT * FROM location WHERE client_id = 8;
ROLLBACK;

-- Aucune ligne n'a été ajoutée
SELECT COUNT(*) AS nombre_locations FROM location;
