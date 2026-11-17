// 8. Tableaux et sous-documents

// 8.1 Livres ayant exactement 3 tags
db.livres.find({ tags: { $size: 3 } }, { _id: 0, titre: 1, tags: 1 })

// 8.2 Livres dont le premier tag est "Classique"
db.livres.find({ "tags.0": "Classique" }, { _id: 0, titre: 1, tags: 1 })

// 8.3 Ajouter le tag "Promotion" à tous les romans
db.livres.updateMany({ genre: "Roman" }, { $addToSet: { tags: "Promotion" } })
db.livres.find({ genre: "Roman" }, { _id: 0, titre: 1, tags: 1 })

// 8.4 Retirer le tag "Ancien" de tous les livres qui l'ont
db.livres.updateMany({ tags: "Ancien" }, { $pull: { tags: "Ancien" } })
db.livres.countDocuments({ tags: "Ancien" })

// 8.5 Utilisateurs ayant l'abonnement "Numérique"
db.utilisateurs.find({ abonnements: "Numérique" }, { _id: 0, nom: 1, abonnements: 1 })

// 8.6 Utilisateurs ayant au moins 2 abonnements
db.utilisateurs.find({ "abonnements.1": { $exists: true } }, { _id: 0, nom: 1, abonnements: 1 })

// 8.7 Livres avec un nombre de pages pair
db.livres.find({ nombre_pages: { $mod: [2, 0] } }, { _id: 0, titre: 1, nombre_pages: 1 })

// 8.8 Livres dont le titre compte au moins 3 mots
db.livres.find({ $expr: { $gte: [{ $size: { $split: ["$titre", " "] } }, 3] } }, { _id: 0, titre: 1 })

// 8.9 Auteurs nés au XXe siècle (1901 à 2000)
db.auteurs.find({ annee_naissance: { $gte: 1901, $lte: 2000 } }, { _id: 0, nom: 1, annee_naissance: 1 })

// 8.10 Arrondir la note moyenne de tous les livres à l'entier le plus proche
//      ($round arrondit au pair, 4.5 donnerait 4 ; floor(x + 0.5) donne l'arrondi classique)
db.livres.updateMany({}, [{ $set: { note_moyenne: { $floor: { $add: ["$note_moyenne", 0.5] } } } }])
db.livres.find({}, { _id: 0, titre: 1, note_moyenne: 1 })
