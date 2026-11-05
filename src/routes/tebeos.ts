import { Router, Request, Response } from "express";
import { ObjectId, Document } from "mongodb";
import { coleccionTebeos } from "../db/mongo";
import { DatosTebeo, ErrorAPI, Tebeo } from "../types/tebeo";
import { obtenerId, validarTebeo } from "../utils/validacion";

export const tebeosRouter = Router();

type TResponse = Response<Tebeo | Tebeo[] | ErrorAPI>;
const convertir = (documento: Document): Tebeo => ({
  _id: (documento._id as ObjectId).toHexString(),
  titulo: documento.titulo as string,
  autor: documento.autor as string,
  editorial: documento.editorial as string,
  numero: documento.numero as number,
  fechaPublicacion: documento.fechaPublicacion as string,
  precio: documento.precio as number,
  leido: documento.leido as boolean
});

const errorServidor = (res: TResponse, error: unknown): void => {
  console.error("Error de MongoDB:", error);
  res.status(500).json({ error: "Error interno del servidor" });
};

tebeosRouter.get("/", async (_req: Request, res: TResponse) => {
  try {
    const documentos = await coleccionTebeos().find({}).toArray();
    res.status(200).json(documentos.map(convertir));
  } catch (error) { errorServidor(res, error); }
});

tebeosRouter.get("/:id", async (req: Request, res: TResponse) => {
  const _id = obtenerId(req.params.id);
  if (!_id) { res.status(400).json({ error: "Identificador incorrecto" }); return; }
  try {
    const documento = await coleccionTebeos().findOne({ _id });
    if (!documento) { res.status(404).json({ error: "Tebeo no encontrado" }); return; }
    res.status(200).json(convertir(documento));
  } catch (error) { errorServidor(res, error); }
});

tebeosRouter.post("/", async (req: Request, res: TResponse) => {
  const resultado = validarTebeo(req.body);
  if (!resultado.datos) { res.status(400).json({ error: resultado.error! }); return; }
  try {
    const datos: DatosTebeo = resultado.datos;
    const insercion = await coleccionTebeos().insertOne(datos);
    res.status(201).json({ _id: insercion.insertedId.toHexString(), ...datos });
  } catch (error) { errorServidor(res, error); }
});

tebeosRouter.put("/:id", async (req: Request, res: TResponse) => {
  const _id = obtenerId(req.params.id);
  if (!_id) { res.status(400).json({ error: "Identificador incorrecto" }); return; }
  const resultado = validarTebeo(req.body);
  if (!resultado.datos) { res.status(400).json({ error: resultado.error! }); return; }
  try {
    const documento = await coleccionTebeos().findOneAndUpdate(
      { _id }, { $set: resultado.datos }, { returnDocument: "after" }
    );
    if (!documento) { res.status(404).json({ error: "Tebeo no encontrado" }); return; }
    res.status(200).json(convertir(documento));
  } catch (error) { errorServidor(res, error); }
});

tebeosRouter.delete("/:id", async (req: Request, res: TResponse) => {
  const _id = obtenerId(req.params.id);
  if (!_id) { res.status(400).json({ error: "Identificador incorrecto" }); return; }
  try {
    const documento = await coleccionTebeos().findOneAndDelete({ _id });
    if (!documento) { res.status(404).json({ error: "Tebeo no encontrado" }); return; }
    res.status(200).json(convertir(documento));
  } catch (error) { errorServidor(res, error); }
});
