// Section 1 : création des collections et jeu de données
// Les _id sont fixés pour pouvoir les réutiliser dans les sections suivantes :
//   auteurs      aaaaaaaaaaaaaaaaaaaaaa01 ... a10
//   livres       bbbbbbbbbbbbbbbbbbbbbb01 ... b22
//   utilisateurs cccccccccccccccccccccc01 ... c12
//   emprunts     dddddddddddddddddddddd01 ... d24

db = db.getSiblingDB("bibliotheque");

const id = (prefix, n) => ObjectId(prefix.repeat(22) + String(n).padStart(2, "0"));
const A = (n) => id("a", n);
const B = (n) => id("b", n);
const U = (n) => id("c", n);
const E = (n) => id("d", n);
const D = (s) => new Date(s + "T10:00:00Z");

// 1.1 Création des collections (on repart d'une base vide)
db.dropDatabase();
["auteurs", "livres", "utilisateurs", "emprunts"].forEach((c) => db.createCollection(c));

// 1.2 Insertion des données

db.auteurs.insertMany([
  { _id: A(1), nom: "Victor Hugo", nationalite: "Française", annee_naissance: 1802, annee_deces: 1885, biographie: "Poète, romancier et dramaturge, figure majeure du romantisme français.", livres_ecrits: 40 },
  { _id: A(2), nom: "George Orwell", nationalite: "Britannique", annee_naissance: 1903, annee_deces: 1950, biographie: "Écrivain et journaliste connu pour ses critiques du totalitarisme.", livres_ecrits: 9 },
  { _id: A(3), nom: "J.K. Rowling", nationalite: "Britannique", annee_naissance: 1965, biographie: "Autrice de la saga Harry Potter.", livres_ecrits: 15 },
  { _id: A(4), nom: "Isaac Asimov", nationalite: "Américaine", annee_naissance: 1920, annee_deces: 1992, biographie: "Biochimiste et auteur prolifique de science-fiction.", livres_ecrits: 500 },
  { _id: A(5), nom: "Albert Camus", nationalite: "Française", annee_naissance: 1913, annee_deces: 1960, biographie: "Écrivain et philosophe, prix Nobel de littérature 1957.", livres_ecrits: 25 },
  { _id: A(6), nom: "Léon Tolstoï", nationalite: "Russe", annee_naissance: 1828, annee_deces: 1910, biographie: "Romancier russe, auteur de Guerre et Paix.", livres_ecrits: 30 },
  { _id: A(7), nom: "Charles Baudelaire", nationalite: "Française", annee_naissance: 1821, annee_deces: 1867, biographie: "Poète, auteur des Fleurs du mal.", livres_ecrits: 6 },
  { _id: A(8), nom: "Jules Verne", nationalite: "Française", annee_naissance: 1828, annee_deces: 1905, biographie: "Pionnier du roman d'aventures scientifiques.", livres_ecrits: 62 },
  { _id: A(9), nom: "Frank Herbert", nationalite: "Américaine", annee_naissance: 1920, annee_deces: 1986, biographie: "Auteur du cycle de Dune.", livres_ecrits: 23 },
  { _id: A(10), nom: "Marguerite Duras", nationalite: "Française", annee_naissance: 1914, annee_deces: 1996, biographie: "Romancière et cinéaste (aucun livre au catalogue).", livres_ecrits: 34 },
]);

db.livres.insertMany([
  { _id: B(1), titre: "1984", auteur_id: A(2), annee_publication: 1949, genre: "Dystopie", nombre_pages: 328, langue: "Français", editeur: "Gallimard", disponible: true, note_moyenne: 4.7, date_ajout: D("2023-01-15"), tags: ["Classique", "Politique", "Dystopie"] },
  { _id: B(2), titre: "La Ferme des animaux", auteur_id: A(2), annee_publication: 1945, genre: "Roman", nombre_pages: 112, langue: "Français", editeur: "Gallimard", disponible: false, note_moyenne: 4.3, date_ajout: D("2023-02-10"), tags: ["Classique", "Satire"] },
  { _id: B(3), titre: "Les Misérables", auteur_id: A(1), annee_publication: 1862, genre: "Roman", nombre_pages: 1488, langue: "Français", editeur: "Le Livre de Poche", disponible: true, note_moyenne: 4.8, date_ajout: D("2023-03-05"), tags: ["Classique", "Histoire", "Ancien"] },
  { _id: B(4), titre: "Notre-Dame de Paris", auteur_id: A(1), annee_publication: 1831, genre: "Roman", nombre_pages: 940, langue: "Français", editeur: "Folio", disponible: true, note_moyenne: 4.5, date_ajout: D("2023-03-20"), tags: ["Classique", "Ancien"] },
  { _id: B(5), titre: "Harry Potter à l'école des sorciers", auteur_id: A(3), annee_publication: 1997, genre: "Fantasy", nombre_pages: 320, langue: "Français", editeur: "Gallimard Jeunesse", disponible: false, note_moyenne: 4.6, date_ajout: D("2023-05-12"), tags: ["Jeunesse", "Magie"] },
  { _id: B(6), titre: "Harry Potter et la Chambre des secrets", auteur_id: A(3), annee_publication: 1998, genre: "Fantasy", nombre_pages: 368, langue: "Français", editeur: "Gallimard Jeunesse", disponible: true, note_moyenne: 4.4, date_ajout: D("2023-05-12"), tags: ["Jeunesse", "Magie", "Aventure"] },
  { _id: B(7), titre: "Fondation", auteur_id: A(4), annee_publication: 1951, genre: "Science-Fiction", nombre_pages: 255, langue: "Français", editeur: "Folio SF", disponible: true, note_moyenne: 4.5, date_ajout: D("2023-06-01"), tags: ["Espace", "Classique"] },
  { _id: B(8), titre: "Les Robots", auteur_id: A(4), annee_publication: 1950, genre: "Science-Fiction", nombre_pages: 253, langue: "Français", editeur: "J'ai lu", disponible: false, note_moyenne: 4.2, date_ajout: D("2023-06-01"), tags: ["Robots", "Nouvelles"] },
  { _id: B(9), titre: "L'Étranger", auteur_id: A(5), annee_publication: 1942, genre: "Roman", nombre_pages: 186, langue: "Français", editeur: "Folio", disponible: true, note_moyenne: 4.1, date_ajout: D("2023-07-18"), tags: ["Classique", "Philosophie", "Absurde"] },
  { _id: B(10), titre: "La Peste", auteur_id: A(5), annee_publication: 1947, genre: "Roman", nombre_pages: 352, langue: "Français", editeur: "Folio", disponible: false, note_moyenne: 4.4, date_ajout: D("2023-07-18"), tags: ["Classique", "Philosophie"] },
  { _id: B(11), titre: "Guerre et Paix", auteur_id: A(6), annee_publication: 1869, genre: "Roman historique", nombre_pages: 1572, langue: "Français", editeur: "Folio", disponible: true, note_moyenne: 4.6, date_ajout: D("2023-09-02"), tags: ["Classique", "Histoire", "Ancien"] },
  { _id: B(12), titre: "Anna Karénine", auteur_id: A(6), annee_publication: 1877, genre: "Roman", nombre_pages: 864, langue: "Français", editeur: "Folio", disponible: true, note_moyenne: 4.3, date_ajout: D("2023-09-02"), tags: ["Classique", "Romance"] },
  { _id: B(13), titre: "Les Fleurs du mal", auteur_id: A(7), annee_publication: 1857, genre: "Poésie", nombre_pages: 256, langue: "Français", editeur: "Le Livre de Poche", disponible: true, note_moyenne: 4.2, date_ajout: D("2024-01-10"), tags: ["Classique", "Poésie", "Ancien"] },
  { _id: B(14), titre: "Le Spleen de Paris", auteur_id: A(7), annee_publication: 1869, genre: "Poésie", nombre_pages: 160, langue: "Français", editeur: "Folio", disponible: false, note_moyenne: 3.9, date_ajout: D("2024-01-10"), tags: ["Poésie"] },
  { _id: B(15), titre: "Vingt mille lieues sous les mers", auteur_id: A(8), annee_publication: 1870, genre: "Science-Fiction", nombre_pages: 512, langue: "Français", editeur: "Hetzel", disponible: true, note_moyenne: 4.0, date_ajout: D("2024-02-14"), tags: ["Aventure", "Classique"] },
  { _id: B(16), titre: "De la Terre à la Lune", auteur_id: A(8), annee_publication: 1865, genre: "Science-Fiction", nombre_pages: 224, langue: "Français", editeur: "Hetzel", disponible: false, note_moyenne: 3.8, date_ajout: D("2024-02-14"), tags: ["Aventure", "Espace"] },
  { _id: B(17), titre: "Dune", auteur_id: A(9), annee_publication: 1965, genre: "Science-Fiction", nombre_pages: 896, langue: "Français", editeur: "Pocket", disponible: false, note_moyenne: 4.7, date_ajout: D("2024-04-22"), tags: ["Espace", "Classique", "Écologie"] },
  { _id: B(18), titre: "Contes populaires anonymes", auteur_id: null, annee_publication: 1984, genre: "Conte", nombre_pages: 210, langue: "Français", editeur: "L'École des loisirs", disponible: true, note_moyenne: 3.5, date_ajout: D("2024-06-30"), tags: ["Jeunesse", "Tradition"] },
  { _id: B(19), titre: "Le Cerveau vert", auteur_id: A(9), annee_publication: 1966, genre: "Science-Fiction", nombre_pages: 192, langue: "Français", editeur: "Pocket", disponible: true, note_moyenne: 1.8, date_ajout: D("2024-08-05"), tags: ["Espace"] },
  { _id: B(20), titre: "Harry Potter et le Prisonnier d'Azkaban", auteur_id: A(3), annee_publication: 1999, genre: "Fantasy", nombre_pages: 448, langue: "Français", editeur: "Gallimard Jeunesse", disponible: false, note_moyenne: 4.8, date_ajout: D("2025-01-20"), tags: ["Jeunesse", "Magie", "Aventure"] },
  { _id: B(21), titre: "Les Dieux eux-mêmes", auteur_id: A(4), annee_publication: 1972, genre: "Science-Fiction", nombre_pages: 320, langue: "Français", editeur: "Folio SF", disponible: true, note_moyenne: 4.4, date_ajout: D("2025-06-03"), tags: ["Espace", "Univers parallèle"] },
  { _id: B(22), titre: "Le Messie de Dune", auteur_id: A(9), annee_publication: 1969, genre: "Science-Fiction", nombre_pages: 288, langue: "Français", editeur: "Pocket", disponible: true, note_moyenne: 4.1, date_ajout: D("2025-06-03"), tags: ["Espace", "Suite"] },
]);

db.utilisateurs.insertMany([
  { _id: U(1), nom: "Alice Martin", email: "alice.martin@mail.fr", type: "Étudiant", date_inscription: D("2024-09-01"), nombre_emprunts: 3, abonnements: ["Premium", "Numérique"] },
  { _id: U(2), nom: "Bruno Lefebvre", email: "bruno.lefebvre@mail.fr", type: "Professeur", date_inscription: D("2023-02-15"), nombre_emprunts: 3, abonnements: ["Standard"] },
  { _id: U(3), nom: "Chloé Dubois", email: "chloe.dubois@mail.fr", type: "Étudiant", date_inscription: D("2024-10-03"), nombre_emprunts: 3, abonnements: ["Numérique"] },
  { _id: U(4), nom: "David Moreau", email: "david.moreau@mail.fr", type: "Membre", date_inscription: D("2023-11-20"), nombre_emprunts: 3, abonnements: ["Premium", "Audio", "Numérique"] },
  { _id: U(5), nom: "Emma Laurent", email: "emma.laurent@mail.fr", type: "Étudiant", date_inscription: D("2025-01-08"), nombre_emprunts: 2, abonnements: [] },
  { _id: U(6), nom: "François Petit", email: "francois.petit@mail.fr", type: "Professeur", date_inscription: D("2022-09-12"), nombre_emprunts: 2, abonnements: ["Premium"] },
  { _id: U(7), nom: "Gabrielle Roux", email: "gabrielle.roux@mail.fr", type: "Membre", date_inscription: D("2024-03-27"), nombre_emprunts: 2, abonnements: ["Standard", "Numérique"] },
  { _id: U(8), nom: "Hugo Fournier", email: "hugo.fournier@mail.fr", type: "Étudiant", date_inscription: D("2025-09-15"), nombre_emprunts: 2, abonnements: ["Audio"] },
  { _id: U(9), nom: "Inès Girard", email: "ines.girard@mail.fr", type: "Membre", date_inscription: D("2023-06-05"), nombre_emprunts: 2, abonnements: ["Premium", "Standard"] },
  { _id: U(10), nom: "Julien Bonnet", email: "julien.bonnet@mail.fr", type: "Professeur", date_inscription: D("2024-01-22"), nombre_emprunts: 2, abonnements: ["Numérique"] },
  { _id: U(11), nom: "Karim Mercier", email: "karim.mercier@mail.fr", type: "Étudiant", date_inscription: D("2026-09-02"), nombre_emprunts: 0, abonnements: ["Standard"] },
  { _id: U(12), nom: "Léa Blanc", email: "lea.blanc@mail.fr", type: "Membre", date_inscription: D("2026-10-11"), nombre_emprunts: 0, abonnements: [] },
]);

// Emprunts : [n, livre, utilisateur, date_emprunt, date_retour_prevue, date_retour_reelle, statut, amende]
const emprunts = [
  [1, 1, 1, "2026-01-10", "2026-01-24", "2026-01-22", "retourne", 0],
  [2, 5, 1, "2026-10-20", "2026-11-03", null, "en_cours", null],
  [3, 7, 2, "2026-02-05", "2026-02-19", "2026-02-25", "retourne", 3],
  [4, 17, 2, "2026-11-05", "2026-11-19", null, "en_cours", null],
  [5, 3, 3, "2026-03-01", "2026-03-15", "2026-03-14", "retourne", null],
  [6, 10, 3, "2026-09-01", "2026-09-15", null, "retard", 12.5],
  [7, 2, 4, "2026-10-25", "2026-11-08", null, "retard", 4.5],
  [8, 11, 4, "2025-05-10", "2025-05-24", "2025-05-20", "retourne", null],
  [9, 9, 5, "2026-04-12", "2026-04-26", "2026-04-26", "retourne", null],
  [10, 16, 5, "2026-11-01", "2026-11-15", null, "en_cours", null],
  [11, 6, 6, "2026-05-03", "2026-05-17", "2026-05-30", "retourne", 6.5],
  [12, 20, 6, "2026-11-10", "2026-11-24", null, "en_cours", null],
  [13, 4, 7, "2026-06-15", "2026-06-29", null, "annule", null],
  [14, 12, 7, "2026-06-20", "2026-07-04", "2026-07-01", "retourne", null],
  [15, 15, 8, "2026-07-02", "2026-07-16", "2026-07-20", "retourne", 2],
  [16, 8, 8, "2026-11-12", "2026-11-26", null, "en_cours", null],
  [17, 13, 9, "2024-12-01", "2024-12-15", "2024-12-10", "retourne", null],
  [18, 1, 9, "2026-08-08", "2026-08-22", "2026-08-21", "retourne", 1],
  [19, 17, 10, "2026-09-10", "2026-09-24", "2026-09-23", "retourne", null],
  [20, 7, 10, "2026-10-01", "2026-10-15", null, "annule", null],
  [21, 5, 2, "2026-03-20", "2026-04-03", "2026-04-02", "retourne", null],
  [22, 14, 3, "2026-11-02", "2026-11-16", null, "en_cours", null],
  [23, 18, 1, "2026-05-05", "2026-05-19", "2026-05-18", "retourne", null],
  [24, 19, 4, "2026-01-15", "2026-01-29", "2026-01-28", "retourne", null],
];

db.emprunts.insertMany(
  emprunts.map(([n, livre, user, debut, prevue, reelle, statut, amende]) => {
    const doc = {
      _id: E(n),
      livre_id: B(livre),
      utilisateur_id: U(user),
      date_emprunt: D(debut),
      date_retour_prevue: D(prevue),
      statut,
    };
    if (reelle) doc.date_retour_reelle = D(reelle);
    if (amende !== null) doc.amende = amende;
    return doc;
  })
);

// Vérification
["auteurs", "livres", "utilisateurs", "emprunts"].forEach((c) =>
  print(`${c}: ${db[c].countDocuments()} documents`)
);
