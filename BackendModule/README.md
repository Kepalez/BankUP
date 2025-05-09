Pueden configurar POSTGRES_USER, POSTGRES_PASSWORD y POSTGRES_DB en el archivo **.env**

#### Levantar contenedor
```
docker-compose up -d
```

#### Tirar contenedor
```
docker-compose down --volumes --remove-orphans
```

#### Entrar a la base de datos por medio de la terminal
```
docker exec -it postgres_db psql -U postgres -d postgres_db
```
