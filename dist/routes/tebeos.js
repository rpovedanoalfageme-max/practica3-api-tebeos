"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tebeosRouter = void 0;
const express_1 = require("express");
const mongo_1 = require("../db/mongo");
const validacion_1 = require("../utils/validacion");
exports.tebeosRouter = (0, express_1.Router)();
const convertir = (documento) => ({
    _id: documento._id.toHexString(),
    titulo: documento.titulo,
    autor: documento.autor,
    editorial: documento.editorial,
    numero: documento.numero,
    fechaPublicacion: documento.fechaPublicacion,
    precio: documento.precio,
    leido: documento.leido
});
const errorServidor = (res, error) => {
    console.error("Error de MongoDB:", error);
    res.status(500).json({ error: "Error interno del servidor" });
};
exports.tebeosRouter.get("/", async (_req, res) => {
    try {
        const documentos = await (0, mongo_1.coleccionTebeos)().find({}).toArray();
        res.status(200).json(documentos.map(convertir));
    }
    catch (error) {
        errorServidor(res, error);
    }
});
exports.tebeosRouter.get("/:id", async (req, res) => {
    const _id = (0, validacion_1.obtenerId)(req.params.id);
    if (!_id) {
        res.status(400).json({ error: "Identificador incorrecto" });
        return;
    }
    try {
        const documento = await (0, mongo_1.coleccionTebeos)().findOne({ _id });
        if (!documento) {
            res.status(404).json({ error: "Tebeo no encontrado" });
            return;
        }
        res.status(200).json(convertir(documento));
    }
    catch (error) {
        errorServidor(res, error);
    }
});
exports.tebeosRouter.post("/", async (req, res) => {
    const resultado = (0, validacion_1.validarTebeo)(req.body);
    if (!resultado.datos) {
        res.status(400).json({ error: resultado.error });
        return;
    }
    try {
        const datos = resultado.datos;
        const insercion = await (0, mongo_1.coleccionTebeos)().insertOne(datos);
        res.status(201).json({ _id: insercion.insertedId.toHexString(), ...datos });
    }
    catch (error) {
        errorServidor(res, error);
    }
});
exports.tebeosRouter.put("/:id", async (req, res) => {
    const _id = (0, validacion_1.obtenerId)(req.params.id);
    if (!_id) {
        res.status(400).json({ error: "Identificador incorrecto" });
        return;
    }
    const resultado = (0, validacion_1.validarTebeo)(req.body);
    if (!resultado.datos) {
        res.status(400).json({ error: resultado.error });
        return;
    }
    try {
        const documento = await (0, mongo_1.coleccionTebeos)().findOneAndUpdate({ _id }, { $set: resultado.datos }, { returnDocument: "after" });
        if (!documento) {
            res.status(404).json({ error: "Tebeo no encontrado" });
            return;
        }
        res.status(200).json(convertir(documento));
    }
    catch (error) {
        errorServidor(res, error);
    }
});
exports.tebeosRouter.delete("/:id", async (req, res) => {
    const _id = (0, validacion_1.obtenerId)(req.params.id);
    if (!_id) {
        res.status(400).json({ error: "Identificador incorrecto" });
        return;
    }
    try {
        const documento = await (0, mongo_1.coleccionTebeos)().findOneAndDelete({ _id });
        if (!documento) {
            res.status(404).json({ error: "Tebeo no encontrado" });
            return;
        }
        res.status(200).json(convertir(documento));
    }
    catch (error) {
        errorServidor(res, error);
    }
});
