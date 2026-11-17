// 5. Suppressions

// 5.1 Supprimer le livre "Le Messie de Dune" par son _id
db.livres.deleteOne({ _id: ObjectId("bbbbbbbbbbbbbbbbbbbbbb22") })

// 5.2 Supprimer les livres de poésie
db.livres.deleteMany({ genre: "Poésie" })

// 5.3 Supprimer les livres publiés avant 1900
db.livres.deleteMany({ annee_publication: { $lt: 1900 } })

// 5.4 Supprimer les emprunts annulés
db.emprunts.deleteMany({ statut: "annule" })

// 5.5 Supprimer les utilisateurs qui n'ont jamais emprunté
const emprunteurs = db.emprunts.distinct("utilisateur_id")
db.utilisateurs.find({ _id: { $nin: emprunteurs } }, { nom: 1 })
db.utilisateurs.deleteMany({ _id: { $nin: emprunteurs } })

// 5.6 Supprimer les livres sans auteur (le filtre null couvre auteur_id null et absent)
db.livres.deleteMany({ auteur_id: null })

// 5.7 Supprimer tous les emprunts d'Inès Girard
db.emprunts.deleteMany({ utilisateur_id: ObjectId("cccccccccccccccccccccc09") })

// 5.8 Supprimer les livres notés moins de 2
db.livres.deleteMany({ note_moyenne: { $lt: 2 } })

// 5.9 Supprimer les auteurs qui n'ont aucun livre dans la collection
const auteursAvecLivres = db.livres.distinct("auteur_id")
db.auteurs.find({ _id: { $nin: auteursAvecLivres } }, { nom: 1 })
db.auteurs.deleteMany({ _id: { $nin: auteursAvecLivres } })

// 5.10 Supprimer les emprunts retournés il y a plus d'un an
const ilYaUnAn = new Date(new Date().setFullYear(new Date().getFullYear() - 1))
db.emprunts.deleteMany({ statut: "retourne", date_retour_reelle: { $lt: ilYaUnAn } })
