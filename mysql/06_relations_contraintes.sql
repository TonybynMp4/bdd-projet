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
SOURCE /mysql/06.data.sql;

SELECT * FROM client;
SELECT * FROM location;

-- 6.3 Contraintes

-- b) La date de retour doit être postérieure à la date de location
ALTER TABLE location
    ADD CONSTRAINT chk_dates_location CHECK (date_retour > date_location);

-- a) et c) Un client ne loue qu'une voiture à la fois, une voiture indisponible ou déjà louée ne peut pas être louée
-- Ces règles portent sur d'autres lignes ou tables : un CHECK ne suffit pas, on passe par des triggers. Une voiture est refusée si disponibilite = 0 ou si elle est déjà louée sur une période qui chevauche. Le trigger d'insertion calcule aussi prix_total quand il n'est pas fourni.

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

    IF EXISTS (
        SELECT 1 FROM location
        WHERE voiture_id = NEW.voiture_id
          AND date_location < NEW.date_retour
          AND NEW.date_location < date_retour
    ) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Cette voiture est déjà louée sur cette période';
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

    IF EXISTS (
        SELECT 1 FROM location
        WHERE voiture_id = NEW.voiture_id
          AND id <> NEW.id
          AND date_location < NEW.date_retour
          AND NEW.date_location < date_retour
    ) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Cette voiture est déjà louée sur cette période';
    END IF;
END //

DELIMITER ;

-- Triggers créés
SELECT TRIGGER_NAME, ACTION_TIMING, EVENT_MANIPULATION, EVENT_OBJECT_TABLE
FROM information_schema.TRIGGERS
WHERE TRIGGER_SCHEMA = DATABASE();

-- 3.12 Voitures apparaissant au moins une fois dans location
SELECT id, marque, modele FROM voiture v
WHERE EXISTS (SELECT 1 FROM location l WHERE l.voiture_id = v.id);
-- (requête de la section 3, exécutée ici car la table location n'existe qu'à partir de la section 6)
