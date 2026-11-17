-- Jeu de données de la section 6, chargé par 06_relations_contraintes.sql :
-- 8 clients (le dernier n'a jamais loué) et 20 locations de 2023 à aujourd'hui.

SET NAMES utf8mb4;

INSERT INTO client (nom, email, telephone) VALUES
    ('Sophie Bernard',  'sophie.bernard@mail.fr',  '0601020304'),
    ('Thomas Garnier',  'thomas.garnier@mail.fr',  '0611223344'),
    ('Camille Rousseau','camille.rousseau@mail.fr','0622334455'),
    ('Lucas Fontaine',  'lucas.fontaine@mail.fr',  '0633445566'),
    ('Manon Chevalier', 'manon.chevalier@mail.fr', '0644556677'),
    ('Nathan Lambert',  'nathan.lambert@mail.fr',  '0655667788'),
    ('Sarah Morel',     'sarah.morel@mail.fr',     '0666778899'),
    ('Yanis Robin',     'yanis.robin@mail.fr',     '0677889900');

-- prix_total = nombre de jours x prix de location journalier de la voiture
INSERT INTO location (voiture_id, client_id, date_location, date_retour, prix_total)
SELECT l.voiture_id, l.client_id, l.date_location, l.date_retour,
       DATEDIFF(l.date_retour, l.date_location) * v.prix_location_jour
FROM (
    SELECT  1 AS voiture_id, 1 AS client_id, DATE '2023-02-10' AS date_location, DATE '2023-02-15' AS date_retour
    UNION ALL SELECT  2, 2, '2023-05-01', '2023-05-08'
    UNION ALL SELECT  7, 3, '2023-07-14', '2023-07-24'
    UNION ALL SELECT  1, 4, '2023-09-03', '2023-09-06'
    UNION ALL SELECT 10, 5, '2024-03-01', '2024-03-04'
    UNION ALL SELECT  8, 1, '2024-06-10', '2024-06-20'
    UNION ALL SELECT  1, 1, '2025-01-05', '2025-01-12'
    UNION ALL SELECT 12, 2, '2025-04-18', '2025-04-28'
    UNION ALL SELECT  9, 6, '2025-07-01', '2025-07-08'
    UNION ALL SELECT  4, 4, '2025-08-15', '2025-08-17'
    UNION ALL SELECT 16, 7, '2025-10-01', '2025-10-15'
    UNION ALL SELECT  2, 3, '2026-02-01', '2026-02-10'
    UNION ALL SELECT  8, 5, '2026-03-12', '2026-03-22'
    UNION ALL SELECT  7, 6, '2026-05-05', '2026-05-20'
    UNION ALL SELECT  9, 4, '2026-06-01', '2026-06-03'
    UNION ALL SELECT 10, 6, '2026-08-10', '2026-08-12'
    UNION ALL SELECT 12, 7, '2026-09-01', '2026-09-04'
    UNION ALL SELECT  3, 1, '2026-11-10', '2026-11-24' -- en cours
    UNION ALL SELECT  6, 2, '2026-11-14', '2026-11-21' -- en cours
    UNION ALL SELECT 13, 3, '2026-11-01', '2026-11-30' -- en cours
) AS l
JOIN voiture v ON v.id = l.voiture_id
ORDER BY l.date_location;
