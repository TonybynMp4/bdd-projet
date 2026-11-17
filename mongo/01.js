// Section 1 : création des collections et jeu de données
// Les données (auteurs, livres, utilisateurs, emprunts) sont dans 01.data.js.

db = db.getSiblingDB("bibliotheque");
load("/mongo/01.data.js");

// 1.1 Création des collections (on repart d'une base vide)
db.dropDatabase();
["auteurs", "livres", "utilisateurs", "emprunts"].forEach((c) => db.createCollection(c));

// 1.2 Insertion des données
db.auteurs.insertMany(donnees.auteurs);
db.livres.insertMany(donnees.livres);
db.utilisateurs.insertMany(donnees.utilisateurs);
db.emprunts.insertMany(donnees.emprunts);

// Vérification
["auteurs", "livres", "utilisateurs", "emprunts"].forEach((c) =>
  print(`${c}: ${db[c].countDocuments()} documents`)
);
