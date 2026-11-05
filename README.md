# Práctica 3 — API REST de tebeos

API REST con **Node.js, Express, TypeScript y el driver oficial de MongoDB**. No utiliza Mongoose.

## Requisitos

- Node.js 20 o superior
- MongoDB local ejecutándose en `mongodb://127.0.0.1:27017` (o un MongoDB accesible mediante `MONGODB_URI`)

## Instalación y ejecución

```bash
npm i
npm run dev
```

La API escucha por defecto en `http://localhost:3000`. Para personalizar la conexión, define las variables de entorno `MONGODB_URI`, `MONGODB_DB` y `PORT` (ver `.env.example`). No se carga automáticamente un archivo `.env`.

**Importante:** si MongoDB no está arrancado, la aplicación mostrará un error de conexión y no iniciará el servidor HTTP.

## Endpoints

| Método | Ruta | Resultado correcto |
|---|---|---|
| GET | `/tebeos` | 200, array de tebeos (puede estar vacío) |
| GET | `/tebeos/:id` | 200, tebeo |
| POST | `/tebeos` | 201, tebeo creado |
| PUT | `/tebeos/:id` | 200, tebeo actualizado |
| DELETE | `/tebeos/:id` | 200, tebeo eliminado |

Los IDs se generan automáticamente con MongoDB y se devuelven como cadenas hexadecimales. PUT exige todos los campos salvo `_id`. Las validaciones devuelven 400, un ID inexistente devuelve 404 y los fallos internos devuelven 500, siempre con `{ "error": "..." }`.

## Ejemplos para Postman o curl

Crear:

```bash
curl -i -X POST http://localhost:3000/tebeos -H "Content-Type: application/json" -d '{"titulo":"Asterix el Galo","autor":"René Goscinny","editorial":"Dargaud","numero":1,"fechaPublicacion":"1959-10-29","precio":8.95,"leido":false}'
```

Listar:

```bash
curl -i http://localhost:3000/tebeos
```

Consultar uno (sustituir `ID` por el `_id` devuelto en POST):

```bash
curl -i http://localhost:3000/tebeos/ID
```

Actualizar completamente:

```bash
curl -i -X PUT http://localhost:3000/tebeos/ID -H "Content-Type: application/json" -d '{"titulo":"Asterix y Cleopatra","autor":"René Goscinny","editorial":"Dargaud","numero":6,"fechaPublicacion":"1965-01-01","precio":9.95,"leido":true}'
```

Eliminar:

```bash
curl -i -X DELETE http://localhost:3000/tebeos/ID
```

Pruebas de error recomendadas: GET con ID `abc` (400), GET con ID hexadecimal válido que no exista (404), POST sin `titulo` (400), POST con `numero: 0` (400), POST con fecha `2025-02-30` (400), POST con `precio: -1` (400), PUT sin todos los campos (400).

## Estructura

- `src/index.ts`: configura Express y arranca el servidor tras conectar con MongoDB.
- `src/db/mongo.ts`: conexión a la base de datos.
- `src/routes/tebeos.ts`: cinco rutas CRUD.
- `src/types/tebeo.ts`: tipos `Tebeo` y `ErrorAPI`.
- `src/utils/validacion.ts`: validación de datos e IDs.

## Entrega

El guion exige **enlace a un repositorio GitHub clonable**, con `package.json` y `package-lock.json`, sin `node_modules`. Subir los archivos del proyecto y comprobar que funciona con `npm i` y `npm run dev`.
