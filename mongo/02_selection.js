// 2. Requêtes de sélection

// 2.1 Livres du genre "Science-Fiction"
db.livres.find({ genre: "Science-Fiction" }, { _id: 0, titre: 1, genre: 1 })

// 2.2 Livres publiés avant 1950
db.livres.find({ annee_publication: { $lt: 1950 } }, { _id: 0, titre: 1, annee_publication: 1 })

// 2.3 Livres disponibles avec une note >= 4.5
db.livres.find(
  { disponible: true, note_moyenne: { $gte: 4.5 } },
  { _id: 0, titre: 1, disponible: 1, note_moyenne: 1 }
)

// 2.4 Livres de 200 à 400 pages
db.livres.find({ nombre_pages: { $gte: 200, $lte: 400 } }, { _id: 0, titre: 1, nombre_pages: 1 })

// 2.5 Livres de Victor Hugo (on récupère d'abord l'_id de l'auteur)
const hugo = db.auteurs.findOne({ nom: "Victor Hugo" })
db.livres.find({ auteur_id: hugo._id }, { _id: 0, titre: 1, auteur_id: 1 })

// 2.6 Livres avec le tag "Classique"
db.livres.find({ tags: "Classique" }, { _id: 0, titre: 1, tags: 1 })

// 2.7 Livres disponibles triés par note décroissante
db.livres.find({ disponible: true }, { _id: 0, titre: 1, note_moyenne: 1 }).sort({ note_moyenne: -1 })

// 2.8 Top 5 des livres les mieux notés
db.livres.find({}, { _id: 0, titre: 1, note_moyenne: 1 }).sort({ note_moyenne: -1 }).limit(5)

// 2.9 Livres publiés en 1984
db.livres.find({ annee_publication: 1984 }, { _id: 0, titre: 1, annee_publication: 1 })

// 2.10 Livres dont le titre contient "Guerre"
db.livres.find({ titre: { $regex: "Guerre", $options: "i" } }, { _id: 0, titre: 1 })
