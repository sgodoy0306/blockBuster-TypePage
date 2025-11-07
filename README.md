# blockBuster-TypePage

Proyecto simple para administrar una tienda/página Blockbuster: manejo de películas, actores, géneros, estudios y reservas. El repositorio contiene un backend en Node.js (Express + PostgreSQL) y un frontend estático (HTML/CSS/JS) almacenado bajo `frontend/`.

## Estructura del repositorio (resumen)

- `backend/` - servidor Node.js (Express). Entrypoint: `backend/src/api.js`.
	- `backend/src/controllers/` - controladores por entidad (movies, actors, users, etc.).
	- `backend/src/routes/` - rutas de la API.
	- `backend/src/middlewares/` - middlewares (auth, roles).
	- `backend/package.json` - scripts: `start` y `dev`.
- `frontend/` - HTML/CSS/JS estático para la UI.
	- `frontend/src/js/` - scripts JS (se extrajeron de los HTML para mejor organización).
	- múltiples páginas HTML como `actors-add.html`, `movies-add.html`, `actors-delete.html`, etc.
- `docker-compose.yml` - orquesta servicios (si está configurado para base de datos + backend).
- `Makefile` - tareas convenientes (si aplica).

## Requisitos

- Node.js (>= 16 recomendable) y npm
- PostgreSQL (si usas la DB localmente en vez de docker)
- Docker & docker-compose (opcional, recomendado para montaje rápido)

## Variables de entorno (backend)

El backend usa `dotenv`. Coloca un archivo `.env` en `backend/` con (ejemplo):

```
PORT=3001
DATABASE_URL=postgres://user:password@localhost:5432/blockbuster
JWT_SECRET=tu_secreto_jwt
```

Ajusta los valores según tu entorno.

## Ejecutar localmente (backend)

1. Instala dependencias y lanza el servidor:

```bash
cd backend
npm install
# Modo desarrollo con reinicio automático (nodemon)
npm run dev
# o para producción
npm start
```

Por defecto el servidor se inicia en el puerto indicado en `PORT` (por defecto documentado aquí: `3001`). Comprueba `backend/src/api.js` si quieres confirmar el puerto.

## Ejecutar frontend (local, estático)

El frontend está compuesto por archivos HTML estáticos. Puedes abrir los archivos directamente en el navegador, pero algunos navegadores restringen llamadas fetch por CORS/file protocol. Es recomendable servir el directorio con un servidor estático simple
O usar `npx http-server .` o cualquier servidor estático.

## Ejecutar con Docker Compose

Si prefieres orquestar backend + DB con docker-compose (si está configurado):

```bash
docker-compose up --build
```

Revisa `docker-compose.yml` para ver servicios y puertos expuestos.

## API (vista rápida)

El backend expone rutas REST bajo `/api`. Algunas rutas principales (según controladores presentes):

- `GET /api/movies` - listar películas
- `POST /api/movies` - crear película
- `PUT /api/movie/:id` - actualizar película
- `GET /api/actors` - listar actores
- `POST /api/actors` - crear actor
- `DELETE /api/actor/:id` - borrar actor
- `GET /api/genres` - listar géneros
- `GET /api/film_studios` - listar estudios
- `POST /api/movie/:movieId/genres` - asignar género a película
- `POST /api/movie/:movieId/actors` - asignar actor a película

Además hay rutas para usuarios, autenticación, reservas y otras operaciones. Para ver la lista exacta, consulta `backend/src/routes/`.

### Autenticación

Muchas rutas requieren autenticación con JWT. Los frontend HTML guardan el token en `localStorage` o `sessionStorage` bajo la clave `authToken` y lo envían en el header `Authorization: Bearer <token>`.

## Frontend — notas importantes

- Los archivos HTML se encuentran en `frontend/` y los estilos en `frontend/src/`.
- Para organización, extraje los scripts inline a `frontend/src/js/` (por ejemplo `actors-add.js`, `movies-add.js`, etc.). Si mueves o renombrarás archivos, actualiza las referencias `<script src="./src/js/....js"></script>` en los HTML.
- El frontend espera que la API esté disponible en `http://localhost:3001/api/...`. Si tu backend usa otra URL/puerto, actualiza las constantes en los JS o utiliza un proxy.

## Desarrollo y pruebas

- Para desarrollar backend, usa `npm run dev` en `backend/`.
- Para probar endpoints usa `curl`, Postman o Insomnia.

Ejemplo rápido con curl para listar películas:

```bash
curl http://localhost:3001/api/movies
```

Ejemplo para crear un actor (requiere token si la ruta está protegida):

```bash
curl -X POST http://localhost:3001/api/actors \
	-H 'Content-Type: application/json' \
	-H "Authorization: Bearer <TU_TOKEN>" \
	-d '{"name":"Nuevo Actor"}'
```

## Estructura del código (dónde mirar)

- Rutas y controladores: `backend/src/routes/`, `backend/src/controllers/`
- Middlewares: `backend/src/middlewares/` (autenticación y roles)
- Frontend: `frontend/` (HTML) y `frontend/src/js/` (JS)

## Contribuir

1. Haz fork / branch
2. Implementa cambios y agrega tests si aplica
3. Abre PR con descripción clara


