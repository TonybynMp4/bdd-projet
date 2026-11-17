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

## MongoDB

```sh
docker compose exec mongo mongosh -u efrei -p efrei --authenticationDatabase admin bibliotheque --file /mongo/02_selection.js
```

`01_setup.js` vide la base et recharge le jeu de données : à relancer avant une section si une section précédente a modifié les données.

## MySQL

Les fichiers s'exécutent dans l'ordre, chaque section partant de l'état laissé par la précédente :

```sh
for f in mysql/*.sql; do
  docker compose exec -T mysql mysql -t -uefrei -pefrei location_voitures < "$f"
done
```
