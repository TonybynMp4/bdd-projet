-- 8. Requêtes avancées
-- La table voiture n'a pas de date de mise en service : on prend le 1er janvier de son année.

SET NAMES utf8mb4;

-- 8.1 Revenu total par voiture
SELECT v.id, v.marque, v.modele, COALESCE(SUM(l.prix_total), 0) AS revenu_total
FROM voiture v
LEFT JOIN location l ON l.voiture_id = v.id
GROUP BY v.id, v.marque, v.modele
ORDER BY revenu_total DESC;

-- 8.2 Voitures les plus rentables depuis leur mise en service
--     (revenu total et part du prix d'achat déjà remboursée)
SELECT v.id, v.marque, v.modele, v.annee, v.prix_achat,
       SUM(l.prix_total) AS revenu_total,
       ROUND(SUM(l.prix_total) / v.prix_achat * 100, 2) AS pct_prix_achat_rembourse
FROM voiture v
JOIN location l ON l.voiture_id = v.id
WHERE l.date_location >= MAKEDATE(v.annee, 1)
GROUP BY v.id, v.marque, v.modele, v.annee, v.prix_achat
ORDER BY revenu_total DESC;

-- 8.3 Durée moyenne de location par voiture (en jours)
SELECT v.id, v.marque, v.modele,
       COUNT(*) AS nombre_locations,
       ROUND(AVG(DATEDIFF(l.date_retour, l.date_location)), 1) AS duree_moyenne_jours
FROM voiture v
JOIN location l ON l.voiture_id = v.id
GROUP BY v.id, v.marque, v.modele
ORDER BY duree_moyenne_jours DESC;

-- 8.4 Taux d'occupation : jours loués / jours depuis la mise en service x 100
--     (une location en cours compte jusqu'à aujourd'hui)
SELECT v.id, v.marque, v.modele,
       COALESCE(SUM(DATEDIFF(LEAST(l.date_retour, CURDATE()), l.date_location)), 0) AS jours_loues,
       DATEDIFF(CURDATE(), MAKEDATE(v.annee, 1)) AS jours_en_service,
       ROUND(
           COALESCE(SUM(DATEDIFF(LEAST(l.date_retour, CURDATE()), l.date_location)), 0)
           / DATEDIFF(CURDATE(), MAKEDATE(v.annee, 1)) * 100, 2
       ) AS taux_occupation_pct
FROM voiture v
LEFT JOIN location l ON l.voiture_id = v.id AND l.date_location <= CURDATE()
GROUP BY v.id, v.marque, v.modele, v.annee
ORDER BY taux_occupation_pct DESC;
