// Bonus : index pour accélérer les recherches, tris et $lookup

db = db.getSiblingDB("bibliotheque");
const show = (label, res) => {
  print(`\n=== ${label}`);
  printjson(res.toArray ? res.toArray() : res);
};

// livres : champs filtrés ou triés, clé étrangère vers auteurs
db.livres.createIndex({ titre: 1 });
db.livres.createIndex({ genre: 1 });
db.livres.createIndex({ disponible: 1 });
db.livres.createIndex({ auteur_id: 1 });
db.livres.createIndex({ genre: 1, note_moyenne: -1 }); // filtre par genre + tri par note

// emprunts : clés étrangères utilisées par les $lookup, statut et date
db.emprunts.createIndex({ livre_id: 1 });
db.emprunts.createIndex({ utilisateur_id: 1 });
db.emprunts.createIndex({ statut: 1 });
db.emprunts.createIndex({ date_emprunt: 1 });
db.emprunts.createIndex({ utilisateur_id: 1, statut: 1 }); // emprunts en cours d'un utilisateur

show("Index de livres", db.livres.getIndexes().map((i) => i.key));
show("Index de emprunts", db.emprunts.getIndexes().map((i) => i.key));

// Vérification : la requête « Science-Fiction triée par note » utilise l'index composé
const plan = db.livres.find({ genre: "Science-Fiction" }).sort({ note_moyenne: -1 }).explain();
show("Plan d'exécution (genre + tri par note)", {
  stage: plan.queryPlanner.winningPlan.stage,
  index: plan.queryPlanner.winningPlan.inputStage?.indexName,
});
