-- Jeu de données de la section 2 (18 voitures), chargé par 02_insertion.sql.

SET NAMES utf8mb4;

INSERT INTO voiture (marque, modele, annee, kilometrage, couleur, prix_achat, prix_location_jour, disponibilite) VALUES
    ('Toyota',     'Corolla',   2018,  85000, 'Blanc',  22000.00,  45.00, 1),
    ('Honda',      'Civic',     2019,  62000, 'Rouge',  24000.00,  50.00, 1),
    ('Honda',      'Civic',     2016, 120000, 'Bleu',   18000.00,  40.00, 0),
    ('Toyota',     'Yaris',     2023,   8000, 'Rouge',  19000.00,  35.00, 1),
    ('Renault',    'Clio',      2020,  45000, 'Gris',   16000.00,  35.00, 1),
    ('Peugeot',    '208',       2021,  30000, 'Bleu',   18500.00,  38.00, 0),
    ('BMW',        'Série 3',   2019,  95000, 'Noir',   42000.00,  90.00, 1),
    ('Mercedes',   'Classe C',  2022,  25000, 'Noir',   48000.00, 110.00, 1),
    ('Porsche',    '911',       2021,  15000, 'Rouge', 120000.00, 600.00, 0),
    ('Ferrari',    '488',       2019,  12000, 'Rouge', 230000.00, 900.00, 1),
    ('Volkswagen', 'Golf',      2015, 150000, 'Gris',   21000.00,  40.00, 1),
    ('Tesla',      'Model 3',   2022,  40000, 'Blanc',  45000.00, 120.00, 1),
    ('Toyota',     'RAV4',      2017, 110000, 'Bleu',   30000.00,  70.00, 0),
    ('Ford',       'Fiesta',    2013, 210000, 'Noir',   12000.00,  25.00, 1),
    ('Citroën',    'C3',        1998, 180000, 'Blanc',   9000.00,  20.00, 1),
    ('Audi',       'A4',        2020,  70000, 'Bleu',   38000.00,  85.00, 1),
    ('Renault',    'Mégane',    2014, 205000, 'Gris',   15000.00,  30.00, 0),
    ('Dacia',      'Sandero',   2024,   5000, 'Blanc',  13000.00,  30.00, 1);
