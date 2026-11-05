"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cerrarMongo = exports.coleccionTebeos = exports.conectarMongo = void 0;
const mongodb_1 = require("mongodb");
const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
const nombreBD = process.env.MONGODB_DB || "practica3_tebeos";
const cliente = new mongodb_1.MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
let db;
const conectarMongo = async () => {
    await cliente.connect();
    db = cliente.db(nombreBD);
    await db.command({ ping: 1 });
};
exports.conectarMongo = conectarMongo;
const coleccionTebeos = () => {
    if (!db)
        throw new Error("No existe conexión con MongoDB");
    return db.collection("tebeos");
};
exports.coleccionTebeos = coleccionTebeos;
const cerrarMongo = async () => {
    await cliente.close();
};
exports.cerrarMongo = cerrarMongo;
