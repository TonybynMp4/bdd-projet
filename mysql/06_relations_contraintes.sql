-- 6. Relations et contraintes

SET NAMES utf8mb4;

-- 6.1 Table client
CREATE TABLE client (
    id        INT AUTO_INCREMENT PRIMARY KEY,
    nom       VARCHAR(100) NOT NULL,
    email     VARCHAR(150) NOT NULL UNIQUE,
    telephone VARCHAR(20)
);

-- 6.2 Table location, avec clés étrangères vers voiture et client
CREATE TABLE location (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    voiture_id    INT  NOT NULL,
    client_id     INT  NOT NULL,
    date_location DATE NOT NULL,
    date_retour   DATE NOT NULL, -- date de retour prévue
    prix_total    DECIMAL(10, 2),
    CONSTRAINT fk_location_voiture FOREIGN KEY (voiture_id) REFERENCES voiture (id),
    CONSTRAINT fk_location_client  FOREIGN KEY (client_id)  REFERENCES client (id)
);

-- Jeu de données : 8 clients (le dernier n'a jamais loué) et 20 locations de 2023 à aujourd'hui
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

SELECT * FROM client;
SELECT * FROM location;

-- 6.3 Contraintes

-- b) La date de retour doit être postérieure à la date de location
ALTER TABLE location
    ADD CONSTRAINT chk_dates_location CHECK (date_retour > date_location);

-- a) Un client ne peut louer qu'une voiture à la fois (pas de chevauchement de dates)
-- c) Une voiture non disponible (disponibilite = 0) ne peut pas être louée
-- Ces règles portent sur d'autres lignes ou tables : un CHECK ne suffit pas, on passe par des triggers.
-- Le trigger d'insertion calcule aussi prix_total quand il n'est pas fourni.

DELIMITER //

CREATE TRIGGER location_avant_insertion
BEFORE INSERT ON location
FOR EACH ROW
BEGIN
    IF (SELECT disponibilite FROM voiture WHERE id = NEW.voiture_id) = 0 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Cette voiture n''est pas disponible à la location';
    END IF;

    IF EXISTS (
        SELECT 1 FROM location
        WHERE client_id = NEW.client_id
          AND date_location < NEW.date_retour
          AND NEW.date_location < date_retour
    ) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Ce client a déjà une location sur cette période';
    END IF;

    IF NEW.prix_total IS NULL THEN
        SET NEW.prix_total = DATEDIFF(NEW.date_retour, NEW.date_location)
            * (SELECT prix_location_jour FROM voiture WHERE id = NEW.voiture_id);
    END IF;
END //

CREATE TRIGGER location_avant_modification
BEFORE UPDATE ON location
FOR EACH ROW
BEGIN
    IF EXISTS (
        SELECT 1 FROM location
        WHERE client_id = NEW.client_id
          AND id <> NEW.id
          AND date_location < NEW.date_retour
          AND NEW.date_location < date_retour
    ) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Ce client a déjà une location sur cette période';
    END IF;
END //

DELIMITER ;

SELECT TRIGGER_NAME, ACTION_TIMING, EVENT_MANIPULATION, EVENT_OBJECT_TABLE
FROM information_schema.TRIGGERS
WHERE TRIGGER_SCHEMA = DATABASE();

-- 3.12 (reportée de la section 3) Voitures apparaissant au moins une fois dans location
SELECT id, marque, modele FROM voiture v
WHERE EXISTS (SELECT 1 FROM location l WHERE l.voiture_id = v.id);
