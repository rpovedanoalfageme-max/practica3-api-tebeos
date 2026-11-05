import { Collection, Db, Document, MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
const nombreBD = process.env.MONGODB_DB || "practica3_tebeos";
const cliente = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
let db: Db;

export const conectarMongo = async (): Promise<void> => {
  await cliente.connect();
  db = cliente.db(nombreBD);
  await db.command({ ping: 1 });
};

export const coleccionTebeos = (): Collection<Document> => {
  if (!db) throw new Error("No existe conexión con MongoDB");
  return db.collection("tebeos");
};

export const cerrarMongo = async (): Promise<void> => {
  await cliente.close();
};
