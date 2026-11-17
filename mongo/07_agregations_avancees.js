// Section 7 : agrégations avancées
// Les emprunts annulés ne sont pas comptés comme des emprunts réels (7.4, 7.5, 7.13, 7.14).
// Les durées sont en jours ($dateDiff). Un emprunt non rendu a une durée qui court jusqu'à maintenant.

db = db.getSiblingDB("bibliotheque");
const show = (label, res) => {
  print(`\n=== ${label}`);
  printjson(res.toArray ? res.toArray() : res);
};

const nonAnnule = { $match: { statut: { $ne: "annule" } } };
const dureeRetour = { $toInt: { $dateDiff: { startDate: "$date_emprunt", endDate: "$date_retour_reelle", unit: "day" } } };
const dureeJusquaMaintenant = {
  $toInt: {
    $dateDiff: { startDate: "$date_emprunt", endDate: { $ifNull: ["$date_retour_reelle", "$$NOW"] }, unit: "day" },
  },
};
const joinLivre = [
  { $lookup: { from: "livres", localField: "livre_id", foreignField: "_id", as: "livre" } },
  { $unwind: "$livre" },
];
const joinUtilisateur = [
  { $lookup: { from: "utilisateurs", localField: "utilisateur_id", foreignField: "_id", as: "utilisateur" } },
  { $unwind: "$utilisateur" },
];

// 7.1 Montant total des amendes par utilisateur
show("7.1 Total des amendes par utilisateur",
  db.emprunts.aggregate([
    { $match: { amende: { $gt: 0 } } },
    { $group: { _id: "$utilisateur_id", total_amendes: { $sum: "$amende" } } },
    { $lookup: { from: "utilisateurs", localField: "_id", foreignField: "_id", as: "u" } },
    { $project: { _id: 0, utilisateur: { $first: "$u.nom" }, total_amendes: 1 } },
    { $sort: { total_amendes: -1 } },
  ])
);

// 7.2 Durée moyenne d'emprunt par livre (emprunts rendus)
show("7.2 Durée moyenne d'emprunt par livre",
  db.emprunts.aggregate([
    { $match: { date_retour_reelle: { $exists: true } } },
    { $group: { _id: "$livre_id", duree_moyenne_jours: { $avg: dureeRetour } } },
    { $lookup: { from: "livres", localField: "_id", foreignField: "_id", as: "l" } },
    { $project: { _id: 0, titre: { $first: "$l.titre" }, duree_moyenne_jours: { $round: ["$duree_moyenne_jours", 1] } } },
    { $sort: { duree_moyenne_jours: -1 } },
  ])
);

// 7.3 Taux d'occupation par livre : durée totale empruntée / jours depuis l'ajout * 100
show("7.3 Taux d'occupation par livre",
  db.livres.aggregate([
    {
      $lookup: {
        from: "emprunts",
        localField: "_id",
        foreignField: "livre_id",
        pipeline: [nonAnnule, { $project: { duree: dureeJusquaMaintenant } }],
        as: "emprunts",
      },
    },
    {
      $project: {
        _id: 0,
        titre: 1,
        jours_empruntes: { $sum: "$emprunts.duree" },
        jours_au_catalogue: { $toInt: { $dateDiff: { startDate: "$date_ajout", endDate: "$$NOW", unit: "day" } } },
      },
    },
    {
      $set: {
        taux_occupation: {
          $round: [{ $multiply: [{ $divide: ["$jours_empruntes", "$jours_au_catalogue"] }, 100] }, 2],
        },
      },
    },
    { $sort: { taux_occupation: -1 } },
  ])
);

// 7.4 Top 5 des livres les plus empruntés
show("7.4 Top 5 des livres les plus empruntés",
  db.emprunts.aggregate([
    nonAnnule,
    { $group: { _id: "$livre_id", nb_emprunts: { $sum: 1 } } },
    { $sort: { nb_emprunts: -1, _id: 1 } },
    { $limit: 5 },
    { $lookup: { from: "livres", localField: "_id", foreignField: "_id", as: "l" } },
    { $project: { _id: 0, titre: { $first: "$l.titre" }, nb_emprunts: 1 } },
  ])
);

// 7.5 Top 5 des utilisateurs les plus actifs
show("7.5 Top 5 des utilisateurs les plus actifs",
  db.emprunts.aggregate([
    nonAnnule,
    { $group: { _id: "$utilisateur_id", nb_emprunts: { $sum: 1 } } },
    { $sort: { nb_emprunts: -1, _id: 1 } },
    { $limit: 5 },
    { $lookup: { from: "utilisateurs", localField: "_id", foreignField: "_id", as: "u" } },
    { $project: { _id: 0, nom: { $first: "$u.nom" }, nb_emprunts: 1 } },
  ])
);

// 7.6 Livres notés au moins 4.5 et d'au moins 300 pages
show("7.6 Note >= 4.5 et >= 300 pages",
  db.livres.aggregate([
    { $match: { note_moyenne: { $gte: 4.5 }, nombre_pages: { $gte: 300 } } },
    { $project: { _id: 0, titre: 1, note_moyenne: 1, nombre_pages: 1 } },
  ])
);

// 7.7 Auteurs ayant au moins un livre disponible
show("7.7 Auteurs avec au moins un livre disponible",
  db.auteurs.aggregate([
    {
      $lookup: {
        from: "livres",
        localField: "_id",
        foreignField: "auteur_id",
        pipeline: [{ $match: { disponible: true } }, { $project: { _id: 0, titre: 1 } }],
        as: "disponibles",
      },
    },
    { $match: { "disponibles.0": { $exists: true } } },
    { $project: { _id: 0, nom: 1, livres_disponibles: "$disponibles.titre" } },
  ])
);

// 7.8 Top 3 des emprunts les plus longs
show("7.8 Top 3 des emprunts les plus longs",
  db.emprunts.aggregate([
    nonAnnule,
    { $set: { duree_jours: dureeJusquaMaintenant } },
    { $sort: { duree_jours: -1 } },
    { $limit: 3 },
    ...joinLivre,
    ...joinUtilisateur,
    { $project: { _id: 0, titre: "$livre.titre", utilisateur: "$utilisateur.nom", statut: 1, duree_jours: 1 } },
  ])
);

// 7.9 Livres jamais empruntés
show("7.9 Livres jamais empruntés",
  db.livres.aggregate([
    { $lookup: { from: "emprunts", localField: "_id", foreignField: "livre_id", as: "emprunts" } },
    { $match: { emprunts: { $size: 0 } } },
    { $project: { _id: 0, titre: 1 } },
  ])
);

// 7.10 Utilisateurs n'ayant jamais emprunté
show("7.10 Utilisateurs n'ayant jamais emprunté",
  db.utilisateurs.aggregate([
    { $lookup: { from: "emprunts", localField: "_id", foreignField: "utilisateur_id", as: "emprunts" } },
    { $match: { emprunts: { $size: 0 } } },
    { $project: { _id: 0, nom: 1, email: 1 } },
  ])
);

// 7.11 Durée moyenne d'emprunt par genre (emprunts rendus)
show("7.11 Durée moyenne d'emprunt par genre",
  db.emprunts.aggregate([
    { $match: { date_retour_reelle: { $exists: true } } },
    ...joinLivre,
    { $group: { _id: "$livre.genre", duree_moyenne_jours: { $avg: dureeRetour } } },
    { $set: { duree_moyenne_jours: { $round: ["$duree_moyenne_jours", 1] } } },
    { $sort: { duree_moyenne_jours: -1 } },
  ])
);

// 7.12 Livres empruntés par des utilisateurs ayant un abonnement "Premium"
show("7.12 Livres empruntés par des abonnés Premium",
  db.emprunts.aggregate([
    ...joinUtilisateur,
    { $match: { "utilisateur.abonnements": "Premium" } },
    ...joinLivre,
    { $group: { _id: "$livre.titre", emprunte_par: { $addToSet: "$utilisateur.nom" } } },
    { $sort: { _id: 1 } },
  ])
);

// 7.13 Top 3 des auteurs les plus lus (nombre d'emprunts de leurs livres)
show("7.13 Top 3 des auteurs les plus lus",
  db.emprunts.aggregate([
    nonAnnule,
    ...joinLivre,
    { $group: { _id: "$livre.auteur_id", nb_emprunts: { $sum: 1 } } },
    { $lookup: { from: "auteurs", localField: "_id", foreignField: "_id", as: "a" } },
    { $unwind: "$a" },
    { $project: { _id: 0, auteur: "$a.nom", nb_emprunts: 1 } },
    { $sort: { nb_emprunts: -1, auteur: 1 } },
    { $limit: 3 },
  ])
);

// 7.14 Nombre d'emprunts par mois sur l'année en cours
show("7.14 Emprunts par mois (année en cours)",
  db.emprunts.aggregate([
    nonAnnule,
    { $match: { $expr: { $eq: [{ $year: "$date_emprunt" }, { $year: "$$NOW" }] } } },
    { $group: { _id: { $month: "$date_emprunt" }, nb_emprunts: { $sum: 1 } } },
    { $project: { _id: 0, mois: "$_id", nb_emprunts: 1 } },
    { $sort: { mois: 1 } },
  ])
);

// 7.15 Livres ayant au moins un emprunt en cours
show("7.15 Livres avec un emprunt en cours",
  db.livres.aggregate([
    {
      $lookup: {
        from: "emprunts",
        localField: "_id",
        foreignField: "livre_id",
        pipeline: [{ $match: { statut: "en_cours" } }],
        as: "en_cours",
      },
    },
    { $match: { "en_cours.0": { $exists: true } } },
    { $project: { _id: 0, titre: 1, emprunts_en_cours: { $size: "$en_cours" } } },
  ])
);

// 7.16 Utilisateurs ayant emprunté au moins un livre de science-fiction
show("7.16 Utilisateurs ayant emprunté de la science-fiction",
  db.emprunts.aggregate([
    ...joinLivre,
    { $match: { "livre.genre": "Science-Fiction" } },
    ...joinUtilisateur,
    { $group: { _id: "$utilisateur.nom", livres: { $addToSet: "$livre.titre" } } },
    { $sort: { _id: 1 } },
  ])
);

// 7.17 Durée totale d'emprunt par utilisateur
show("7.17 Durée totale d'emprunt par utilisateur",
  db.emprunts.aggregate([
    nonAnnule,
    { $group: { _id: "$utilisateur_id", duree_totale_jours: { $sum: dureeJusquaMaintenant } } },
    { $lookup: { from: "utilisateurs", localField: "_id", foreignField: "_id", as: "u" } },
    { $project: { _id: 0, nom: { $first: "$u.nom" }, duree_totale_jours: 1 } },
    { $sort: { duree_totale_jours: -1 } },
  ])
);

// 7.18 Livres rendus en retard
show("7.18 Livres rendus en retard",
  db.emprunts.aggregate([
    { $match: { $expr: { $gt: ["$date_retour_reelle", "$date_retour_prevue"] } } },
    ...joinLivre,
    {
      $project: {
        _id: 0,
        titre: "$livre.titre",
        date_retour_prevue: 1,
        date_retour_reelle: 1,
        jours_de_retard: { $toInt: { $dateDiff: { startDate: "$date_retour_prevue", endDate: "$date_retour_reelle", unit: "day" } } },
      },
    },
  ])
);

// 7.19 Auteurs ayant au moins un livre noté 4.5 ou plus
show("7.19 Auteurs avec un livre noté >= 4.5",
  db.livres.aggregate([
    { $match: { note_moyenne: { $gte: 4.5 } } },
    { $lookup: { from: "auteurs", localField: "auteur_id", foreignField: "_id", as: "a" } },
    { $unwind: "$a" },
    { $group: { _id: "$a.nom", livres: { $push: { titre: "$titre", note: "$note_moyenne" } } } },
    { $sort: { _id: 1 } },
  ])
);

// 7.20 Utilisateurs ayant emprunté des livres d'au moins 2 genres différents
show("7.20 Utilisateurs avec au moins 2 genres",
  db.emprunts.aggregate([
    ...joinLivre,
    { $group: { _id: "$utilisateur_id", genres: { $addToSet: "$livre.genre" } } },
    { $match: { $expr: { $gte: [{ $size: "$genres" }, 2] } } },
    { $lookup: { from: "utilisateurs", localField: "_id", foreignField: "_id", as: "u" } },
    { $project: { _id: 0, nom: { $first: "$u.nom" }, genres: 1 } },
    { $sort: { nom: 1 } },
  ])
);
