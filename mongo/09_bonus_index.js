// Bonus : index pour accélérer les recherches, tris et $lookup

// Index sur livres : champs filtrés ou triés, clé étrangère vers auteurs,
// et index composé pour « filtre par genre + tri par note »
db.livres.createIndex({ titre: 1 })
db.livres.createIndex({ genre: 1 })
db.livres.createIndex({ disponible: 1 })
db.livres.createIndex({ auteur_id: 1 })
db.livres.createIndex({ genre: 1, note_moyenne: -1 })

// Index sur emprunts : clés étrangères des $lookup, statut, date,
// et index composé pour « emprunts en cours d'un utilisateur »
db.emprunts.createIndex({ livre_id: 1 })
db.emprunts.createIndex({ utilisateur_id: 1 })
db.emprunts.createIndex({ statut: 1 })
db.emprunts.createIndex({ date_emprunt: 1 })
db.emprunts.createIndex({ utilisateur_id: 1, statut: 1 })

// Liste des index créés
db.livres.getIndexes().map(i => i.name)
db.emprunts.getIndexes().map(i => i.name)

// Vérification : la requête « Science-Fiction triée par note » utilise l'index composé
db.livres.find({ genre: "Science-Fiction" }).sort({ note_moyenne: -1 }).explain().queryPlanner.winningPlan
