// Section 6 : jointures avec $lookup

db = db.getSiblingDB("bibliotheque");
const show = (label, res) => {
  print(`\n=== ${label}`);
  printjson(res.toArray ? res.toArray() : res);
};

// 6.1 Livres avec titre, genre et nom de l'auteur
show("6.1 Livres et auteurs",
  db.livres.aggregate([
    { $lookup: { from: "auteurs", localField: "auteur_id", foreignField: "_id", as: "auteur" } },
    { $unwind: { path: "$auteur", preserveNullAndEmptyArrays: true } },
    { $project: { _id: 0, titre: 1, genre: 1, auteur: "$auteur.nom" } },
  ])
);

// 6.2 Emprunts avec titre du livre, nom de l'utilisateur et dates
show("6.2 Emprunts détaillés",
  db.emprunts.aggregate([
    { $lookup: { from: "livres", localField: "livre_id", foreignField: "_id", as: "livre" } },
    { $lookup: { from: "utilisateurs", localField: "utilisateur_id", foreignField: "_id", as: "utilisateur" } },
    { $unwind: "$livre" },
    { $unwind: "$utilisateur" },
    {
      $project: {
        _id: 0,
        titre: "$livre.titre",
        utilisateur: "$utilisateur.nom",
        date_emprunt: 1,
        date_retour_prevue: 1,
      },
    },
    { $sort: { date_emprunt: 1 } },
  ])
);

// 6.3 Utilisateurs avec nom, email et nombre d'emprunts en cours
show("6.3 Emprunts en cours par utilisateur",
  db.utilisateurs.aggregate([
    {
      $lookup: {
        from: "emprunts",
        localField: "_id",
        foreignField: "utilisateur_id",
        pipeline: [{ $match: { statut: "en_cours" } }],
        as: "en_cours",
      },
    },
    { $project: { _id: 0, nom: 1, email: 1, emprunts_en_cours: { $size: "$en_cours" } } },
    { $sort: { emprunts_en_cours: -1, nom: 1 } },
  ])
);

// 6.4 Auteurs avec la liste de leurs livres (titre, année)
show("6.4 Auteurs et leurs livres",
  db.auteurs.aggregate([
    {
      $lookup: {
        from: "livres",
        localField: "_id",
        foreignField: "auteur_id",
        pipeline: [{ $project: { _id: 0, titre: 1, annee_publication: 1 } }],
        as: "livres",
      },
    },
    { $project: { _id: 0, nom: 1, livres: 1 } },
  ])
);

// 6.5 Livres disponibles avec titre, auteur et note
show("6.5 Livres disponibles avec auteur",
  db.livres.aggregate([
    { $match: { disponible: true } },
    { $lookup: { from: "auteurs", localField: "auteur_id", foreignField: "_id", as: "auteur" } },
    { $unwind: { path: "$auteur", preserveNullAndEmptyArrays: true } },
    { $project: { _id: 0, titre: 1, auteur: "$auteur.nom", note_moyenne: 1 } },
    { $sort: { note_moyenne: -1 } },
  ])
);

// 6.6 Emprunts en retard avec livre, utilisateur, dates et amende
show("6.6 Emprunts en retard",
  db.emprunts.aggregate([
    { $match: { statut: "retard" } },
    { $lookup: { from: "livres", localField: "livre_id", foreignField: "_id", as: "livre" } },
    { $lookup: { from: "utilisateurs", localField: "utilisateur_id", foreignField: "_id", as: "utilisateur" } },
    { $unwind: "$livre" },
    { $unwind: "$utilisateur" },
    {
      $project: {
        _id: 0,
        titre: "$livre.titre",
        utilisateur: "$utilisateur.nom",
        date_emprunt: 1,
        date_retour_prevue: 1,
        amende: 1,
      },
    },
  ])
);

// 6.7 Nombre total de livres empruntés par utilisateur
show("6.7 Livres empruntés par utilisateur",
  db.utilisateurs.aggregate([
    { $lookup: { from: "emprunts", localField: "_id", foreignField: "utilisateur_id", as: "emprunts" } },
    { $project: { _id: 0, nom: 1, total_emprunts: { $size: "$emprunts" } } },
    { $sort: { total_emprunts: -1, nom: 1 } },
  ])
);

// 6.8 Nombre total d'emprunts par livre
show("6.8 Emprunts par livre",
  db.emprunts.aggregate([
    { $group: { _id: "$livre_id", total_emprunts: { $sum: 1 } } },
    { $lookup: { from: "livres", localField: "_id", foreignField: "_id", as: "livre" } },
    { $unwind: "$livre" },
    { $project: { _id: 0, titre: "$livre.titre", total_emprunts: 1 } },
    { $sort: { total_emprunts: -1, titre: 1 } },
  ])
);

// 6.9 Nombre total d'emprunts des livres de chaque auteur
show("6.9 Emprunts par auteur",
  db.auteurs.aggregate([
    { $lookup: { from: "livres", localField: "_id", foreignField: "auteur_id", as: "livres" } },
    { $unwind: "$livres" },
    { $lookup: { from: "emprunts", localField: "livres._id", foreignField: "livre_id", as: "emprunts" } },
    { $group: { _id: "$nom", total_emprunts: { $sum: { $size: "$emprunts" } } } },
    { $sort: { total_emprunts: -1, _id: 1 } },
  ])
);

// 6.10 Par genre : nombre de livres et note moyenne
show("6.10 Statistiques par genre",
  db.livres.aggregate([
    { $group: { _id: "$genre", nombre_livres: { $sum: 1 }, note_moyenne: { $avg: "$note_moyenne" } } },
    { $set: { note_moyenne: { $round: ["$note_moyenne", 2] } } },
    { $sort: { nombre_livres: -1, _id: 1 } },
  ])
);
