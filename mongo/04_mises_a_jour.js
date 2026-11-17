// Section 4 : mises à jour

db = db.getSiblingDB("bibliotheque");
const show = (label, res) => {
  print(`\n=== ${label}`);
  printjson(res.toArray ? res.toArray() : res);
};

// 4.1 Rendre indisponible le livre "1984"
show("4.1 disponible = false pour un _id",
  db.livres.updateOne(
    { _id: ObjectId("bbbbbbbbbbbbbbbbbbbbbb01") },
    { $set: { disponible: false } }
  )
);
show("4.1 vérification",
  db.livres.find({ _id: ObjectId("bbbbbbbbbbbbbbbbbbbbbb01") }, { titre: 1, disponible: 1 })
);

// 4.2 Augmenter la note de "Le Cerveau vert" de 0.5
show("4.2 note_moyenne + 0.5",
  db.livres.updateOne(
    { _id: ObjectId("bbbbbbbbbbbbbbbbbbbbbb19") },
    { $inc: { note_moyenne: 0.5 } }
  )
);
show("4.2 vérification",
  db.livres.find({ _id: ObjectId("bbbbbbbbbbbbbbbbbbbbbb19") }, { titre: 1, note_moyenne: 1 })
);

// 4.3 Ajouter le tag "Littérature" aux romans ($addToSet évite les doublons)
show("4.3 tag Littérature sur les romans",
  db.livres.updateMany({ genre: "Roman" }, { $addToSet: { tags: "Littérature" } })
);
show("4.3 vérification",
  db.livres.find({ genre: "Roman" }, { _id: 0, titre: 1, tags: 1 })
);

// 4.4 Remettre disponibles les livres dont l'emprunt est retourné
//     (sauf ceux qui sont de nouveau empruntés : en_cours ou retard)
const livresRetournes = db.emprunts.distinct("livre_id", { statut: "retourne" });
const livresEmpruntes = db.emprunts.distinct("livre_id", { statut: { $in: ["en_cours", "retard"] } });
show("4.4 disponible = true pour les livres retournés",
  db.livres.updateMany(
    { _id: { $in: livresRetournes, $nin: livresEmpruntes } },
    { $set: { disponible: true } }
  )
);
show("4.4 vérification",
  db.livres.find({ _id: { $in: livresRetournes } }, { _id: 0, titre: 1, disponible: 1 })
);

// 4.5 Changer l'année de publication des "Contes populaires anonymes"
show("4.5 annee_publication = 1990",
  db.livres.updateOne(
    { _id: ObjectId("bbbbbbbbbbbbbbbbbbbbbb18") },
    { $set: { annee_publication: 1990 } }
  )
);
show("4.5 vérification",
  db.livres.find({ _id: ObjectId("bbbbbbbbbbbbbbbbbbbbbb18") }, { titre: 1, annee_publication: 1 })
);

// 4.6 Ajouter le tag "Bestseller" aux livres de J.K. Rowling
const rowling = db.auteurs.findOne({ nom: "J.K. Rowling" });
show("4.6 tag Bestseller pour J.K. Rowling",
  db.livres.updateMany({ auteur_id: rowling._id }, { $addToSet: { tags: "Bestseller" } })
);
show("4.6 vérification",
  db.livres.find({ auteur_id: rowling._id }, { _id: 0, titre: 1, tags: 1 })
);

// 4.7 Incrémenter le nombre d'emprunts d'Emma Laurent
show("4.7 nombre_emprunts + 1",
  db.utilisateurs.updateOne(
    { _id: ObjectId("cccccccccccccccccccccc05") },
    { $inc: { nombre_emprunts: 1 } }
  )
);
show("4.7 vérification",
  db.utilisateurs.find({ _id: ObjectId("cccccccccccccccccccccc05") }, { nom: 1, nombre_emprunts: 1 })
);

// 4.8 Passer en "retard" les emprunts en cours dont la date de retour prévue est dépassée
show("4.8 statut = retard",
  db.emprunts.updateMany(
    { statut: "en_cours", date_retour_prevue: { $lt: new Date() } },
    { $set: { statut: "retard" } }
  )
);
show("4.8 vérification",
  db.emprunts.find({ statut: "retard" }, { date_retour_prevue: 1, statut: 1 })
);

// 4.9 Enregistrer le retour de l'emprunt d2 à la date du jour
show("4.9 date_retour_reelle = maintenant",
  db.emprunts.updateOne(
    { _id: ObjectId("dddddddddddddddddddddd02") },
    { $set: { date_retour_reelle: new Date() } }
  )
);
show("4.9 vérification",
  db.emprunts.find({ _id: ObjectId("dddddddddddddddddddddd02") }, { date_retour_prevue: 1, date_retour_reelle: 1 })
);

// 4.10 Amende à 0 pour les emprunts rendus à temps
show("4.10 amende = 0 pour les retours à temps",
  db.emprunts.updateMany(
    {
      date_retour_reelle: { $exists: true },
      $expr: { $lte: ["$date_retour_reelle", "$date_retour_prevue"] },
    },
    { $set: { amende: 0 } }
  )
);
show("4.10 vérification",
  db.emprunts.find(
    { $expr: { $lte: ["$date_retour_reelle", "$date_retour_prevue"] }, date_retour_reelle: { $exists: true } },
    { date_retour_prevue: 1, date_retour_reelle: 1, amende: 1 }
  )
);
