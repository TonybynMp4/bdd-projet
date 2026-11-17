// Section 2 : requêtes de sélection

db = db.getSiblingDB("bibliotheque");
const show = (label, res) => {
  print(`\n=== ${label}`);
  printjson(res.toArray ? res.toArray() : res);
};

// 2.1 Livres du genre "Science-Fiction"
show("2.1 Science-Fiction",
  db.livres.find({ genre: "Science-Fiction" }, { _id: 0, titre: 1, genre: 1 })
);

// 2.2 Livres publiés avant 1950
show("2.2 Publiés avant 1950",
  db.livres.find({ annee_publication: { $lt: 1950 } }, { _id: 0, titre: 1, annee_publication: 1 })
);

// 2.3 Livres disponibles avec une note >= 4.5
show("2.3 Disponibles et note >= 4.5",
  db.livres.find(
    { disponible: true, note_moyenne: { $gte: 4.5 } },
    { _id: 0, titre: 1, disponible: 1, note_moyenne: 1 }
  )
);

// 2.4 Livres de 200 à 400 pages
show("2.4 Entre 200 et 400 pages",
  db.livres.find(
    { nombre_pages: { $gte: 200, $lte: 400 } },
    { _id: 0, titre: 1, nombre_pages: 1 }
  )
);

// 2.5 Livres de Victor Hugo (on récupère d'abord l'_id de l'auteur)
const hugo = db.auteurs.findOne({ nom: "Victor Hugo" });
show("2.5 Livres de Victor Hugo",
  db.livres.find({ auteur_id: hugo._id }, { _id: 0, titre: 1, auteur_id: 1 })
);

// 2.6 Livres avec le tag "Classique"
show("2.6 Tag Classique",
  db.livres.find({ tags: "Classique" }, { _id: 0, titre: 1, tags: 1 })
);

// 2.7 Livres disponibles triés par note décroissante
show("2.7 Disponibles triés par note",
  db.livres
    .find({ disponible: true }, { _id: 0, titre: 1, note_moyenne: 1 })
    .sort({ note_moyenne: -1 })
);

// 2.8 Top 5 des livres les mieux notés
show("2.8 Top 5 par note",
  db.livres.find({}, { _id: 0, titre: 1, note_moyenne: 1 }).sort({ note_moyenne: -1 }).limit(5)
);

// 2.9 Livres publiés en 1984
show("2.9 Publiés en 1984",
  db.livres.find({ annee_publication: 1984 }, { _id: 0, titre: 1, annee_publication: 1 })
);

// 2.10 Livres dont le titre contient "Guerre"
show("2.10 Titre contenant « Guerre »",
  db.livres.find({ titre: { $regex: "Guerre", $options: "i" } }, { _id: 0, titre: 1 })
);
