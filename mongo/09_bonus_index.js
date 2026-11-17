// Bonus : optimisation (index et $lookup)

// 1) Index simples sur les champs filtrés, triés ou joints
db.livres.createIndex({ titre: 1 })
db.livres.createIndex({ genre: 1 })
db.livres.createIndex({ disponible: 1 })
db.livres.createIndex({ auteur_id: 1 })
db.emprunts.createIndex({ livre_id: 1 })
db.emprunts.createIndex({ utilisateur_id: 1 })
db.emprunts.createIndex({ statut: 1 })
db.emprunts.createIndex({ date_emprunt: 1 })

// 2) Index composés pour les combinaisons filtre + tri fréquentes
db.livres.createIndex({ genre: 1, note_moyenne: -1 })
db.emprunts.createIndex({ utilisateur_id: 1, statut: 1 })

// Liste des index créés
db.livres.getIndexes().map(i => i.name)
db.emprunts.getIndexes().map(i => i.name)

// Vérification : « Science-Fiction triée par note » utilise l'index composé
db.livres.find({ genre: "Science-Fiction" }).sort({ note_moyenne: -1 }).explain().queryPlanner.winningPlan

// 3) Limiter les $lookup inutiles
// Les emprunts référencent livres et utilisateurs : ce sont des relations plusieurs-à-plusieurs qui grossissent sans limite, l'embedding ferait exploser la taille des documents. Les index sur livre_id, utilisateur_id et auteur_id (point 1) rendent ces $lookup rapides.
// Quand une requête n'a besoin que d'un champ stable de l'autre collection, on peut le recopier (référence étendue) pour éviter le $lookup : par exemple le nom de l'auteur dans chaque livre, qui ne change pas.

// Référence étendue : copie du nom de l'auteur dans les livres
db.livres.aggregate([
  { $lookup: { from: "auteurs", localField: "auteur_id", foreignField: "_id", as: "a" } },
  { $set: { auteur_nom: { $first: "$a.nom" } } },
  { $project: { auteur_nom: 1 } },
  { $merge: { into: "livres", whenMatched: "merge", whenNotMatched: "discard" } }
])

// La liste « titre + auteur » se lit alors sans $lookup
db.livres.find({}, { _id: 0, titre: 1, auteur_nom: 1 }).sort({ titre: 1 }).limit(5)
