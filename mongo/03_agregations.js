// 3. Agrégations

// 3.1 Nombre de livres par genre
db.livres.aggregate([
  { $group: { _id: "$genre", count: { $sum: 1 } } },
  { $sort: { count: -1 } }
])

// 3.2 Note moyenne par genre, triée par ordre décroissant
db.livres.aggregate([
  { $group: { _id: "$genre", note_moyenne: { $avg: "$note_moyenne" } } },
  { $set: { note_moyenne: { $round: ["$note_moyenne", 2] } } },
  { $sort: { note_moyenne: -1 } }
])

// 3.3 Nombre total de pages par genre
db.livres.aggregate([
  { $group: { _id: "$genre", total_pages: { $sum: "$nombre_pages" } } },
  { $sort: { total_pages: -1 } }
])

// 3.4 Top 3 des livres les plus longs
db.livres.aggregate([
  { $sort: { nombre_pages: -1 } },
  { $limit: 3 },
  { $project: { _id: 0, titre: 1, nombre_pages: 1 } }
])

// 3.5 Âge moyen des livres (année courante - année de publication)
db.livres.aggregate([
  { $group: { _id: null, age_moyen: { $avg: { $subtract: [{ $year: "$$NOW" }, "$annee_publication"] } } } },
  { $project: { _id: 0, age_moyen: { $round: ["$age_moyen", 1] } } }
])

// 3.6 Top 3 des auteurs les plus prolifiques
db.auteurs.aggregate([
  { $sort: { livres_ecrits: -1 } },
  { $limit: 3 },
  { $project: { _id: 0, nom: 1, livres_ecrits: 1 } }
])

// 3.7 Livres dont la note est supérieure à la moyenne globale
db.livres.aggregate([
  { $setWindowFields: { output: { moyenne_globale: { $avg: "$note_moyenne" } } } },
  { $match: { $expr: { $gt: ["$note_moyenne", "$moyenne_globale"] } } },
  { $project: { _id: 0, titre: 1, note_moyenne: 1, moyenne_globale: { $round: ["$moyenne_globale", 2] } } },
  { $sort: { note_moyenne: -1 } }
])

// 3.8 Livres dont le titre commence par "L"
db.livres.aggregate([
  { $match: { titre: { $regex: "^L" } } },
  { $project: { _id: 0, titre: 1 } }
])

// 3.9 Livres publiés il y a plus de 50 ans
db.livres.aggregate([
  { $addFields: { age: { $subtract: [{ $year: "$$NOW" }, "$annee_publication"] } } },
  { $match: { age: { $gt: 50 } } },
  { $project: { _id: 0, titre: 1, annee_publication: 1, age: 1 } },
  { $sort: { age: -1 } }
])

// 3.10 Top 5 des livres disponibles avec le plus de pages
db.livres.aggregate([
  { $match: { disponible: true } },
  { $sort: { nombre_pages: -1 } },
  { $limit: 5 },
  { $project: { _id: 0, titre: 1, nombre_pages: 1 } }
])
