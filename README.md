# BDD_projet

TP Efrei M1-DEV2 :

- `mongo/` : NoSQL, gestion d'une bibliothèque numérique (MongoDB, base `bibliotheque`).
- `mysql/` : SQL, gestion des voitures (MySQL, base `location_voitures`).

Un fichier par section de l'énoncé.

## Démarrer les bases

```sh
docker compose up -d --wait
```

Identifiants : `efrei` / `efrei`. Ports 27017 (Mongo) et 3306 (MySQL), modifiables avec `MONGO_PORT` et `MYSQL_PORT`.
Le jeu de données Mongo est chargé au premier démarrage. `docker compose down -v` remet tout à zéro.

Les jeux de données sont séparés des requêtes, dans les fichiers `*.data.*` : `mongo/01.data.js`, `mysql/02.data.sql` et `mysql/06.data.sql`.

## MongoDB

Les fichiers 02 à 09 sont des requêtes mongosh directes : on peut les coller dans `mongosh` ou les envoyer en entrée standard, chaque résultat s'affiche.

```sh
docker compose exec -T mongo mongosh --quiet -u efrei -p efrei --authenticationDatabase admin bibliotheque < mongo/02_selection.js
```

`01.js` est un script qui vide la base et recharge le jeu de données. À relancer avant une section si une section précédente a modifié les données :

```sh
docker compose exec mongo mongosh -u efrei -p efrei --authenticationDatabase admin bibliotheque --file /mongo/01.js
```

## MySQL

Les fichiers s'exécutent dans l'ordre, chaque section partant de l'état laissé par la précédente. `-vvt` affiche chaque requête suivie de son résultat, `--force` laisse `06_relations_contraintes_tests.sql` continuer après chaque refus attendu :

```sh
for f in mysql/*.sql; do
  case "$f" in *.data.sql) continue ;; esac
  docker compose exec -T mysql mysql -vvt --force --default-character-set=utf8mb4 -uefrei -pefrei location_voitures < "$f"
done
```
