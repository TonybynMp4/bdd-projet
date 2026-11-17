// Section 5 : suppressions

db = db.getSiblingDB("bibliotheque");
const show = (label, res) => {
  print(`\n=== ${label}`);
  printjson(res.toArray ? res.toArray() : res);
};

// 5.1 Supprimer le livre "Le Messie de Dune" par son _id
show("5.1 Suppression d'un livre par _id",
  db.livres.deleteOne({ _id: ObjectId("bbbbbbbbbbbbbbbbbbbbbb22") })
);

// 5.2 Supprimer les livres de poésie
show("5.2 Suppression du genre Poésie",
  db.livres.deleteMany({ genre: "Poésie" })
);

// 5.3 Supprimer les livres publiés avant 1900
show("5.3 Suppression des livres d'avant 1900",
  db.livres.deleteMany({ annee_publication: { $lt: 1900 } })
);

// 5.4 Supprimer les emprunts annulés
show("5.4 Suppression des emprunts annulés",
  db.emprunts.deleteMany({ statut: "annule" })
);

// 5.5 Supprimer les utilisateurs qui n'ont jamais emprunté
const emprunteurs = db.emprunts.distinct("utilisateur_id");
show("5.5 Utilisateurs sans emprunt (avant suppression)",
  db.utilisateurs.find({ _id: { $nin: emprunteurs } }, { nom: 1 })
);
show("5.5 Suppression des utilisateurs sans emprunt",
  db.utilisateurs.deleteMany({ _id: { $nin: emprunteurs } })
);

// 5.6 Supprimer les livres sans auteur (auteur_id null ou absent ; { $eq: null } couvre les deux cas)
show("5.6 Suppression des livres sans auteur",
  db.livres.deleteMany({ auteur_id: null })
);

// 5.7 Supprimer tous les emprunts d'Inès Girard
show("5.7 Suppression des emprunts d'un utilisateur",
  db.emprunts.deleteMany({ utilisateur_id: ObjectId("cccccccccccccccccccccc09") })
);

// 5.8 Supprimer les livres notés moins de 2
show("5.8 Suppression des livres notés < 2",
  db.livres.deleteMany({ note_moyenne: { $lt: 2 } })
);

// 5.9 Supprimer les auteurs qui n'ont aucun livre dans la collection
const auteursAvecLivres = db.livres.distinct("auteur_id");
show("5.9 Auteurs sans livre (avant suppression)",
  db.auteurs.find({ _id: { $nin: auteursAvecLivres } }, { nom: 1 })
);
show("5.9 Suppression des auteurs sans livre",
  db.auteurs.deleteMany({ _id: { $nin: auteursAvecLivres } })
);

// 5.10 Supprimer les emprunts retournés il y a plus d'un an
const ilYaUnAn = new Date();
ilYaUnAn.setFullYear(ilYaUnAn.getFullYear() - 1);
show("5.10 Suppression des emprunts retournés il y a plus d'un an",
  db.emprunts.deleteMany({ statut: "retourne", date_retour_reelle: { $lt: ilYaUnAn } })
);

// État final
["auteurs", "livres", "utilisateurs", "emprunts"].forEach((c) =>
  print(`${c}: ${db[c].countDocuments()} documents`)
);
