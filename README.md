# BDD_projet

TP NoSQL (Efrei M1-DEV2) : gestion d'une bibliothèque numérique avec MongoDB.

Chaque section de l'énoncé est dans `scripts/NN_*.js` (syntaxe mongosh, base `bibliotheque`).

```sh
./run.sh 1   # crée les collections et insère le jeu de données
./run.sh 2   # recharge les données puis exécute la section 2
```

`run.sh` utilise le conteneur Docker `efrei-mongo` (identifiants `efrei` / `efrei`).
Variables `MONGO_CONTAINER` et `MONGO_URI` pour changer de cible.
