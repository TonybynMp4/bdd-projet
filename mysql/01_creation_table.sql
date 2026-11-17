-- 1. Création de la table voiture
-- (les DROP permettent de relancer tous les fichiers depuis le début)

SET NAMES utf8mb4;

DROP TABLE IF EXISTS location;
DROP TABLE IF EXISTS client;
DROP TABLE IF EXISTS voiture;

CREATE TABLE voiture (
    id                 INT AUTO_INCREMENT PRIMARY KEY,
    marque             VARCHAR(50)    NOT NULL,
    modele             VARCHAR(50)    NOT NULL,
    annee              YEAR           NOT NULL,
    kilometrage        INT UNSIGNED   NOT NULL DEFAULT 0,
    couleur            VARCHAR(30)    NOT NULL,
    prix_achat         DECIMAL(10, 2) NOT NULL,
    prix_location_jour DECIMAL(8, 2)  NOT NULL,
    disponibilite      TINYINT(1)     NOT NULL DEFAULT 1 -- 1 = disponible, 0 = non disponible
);

DESCRIBE voiture;
