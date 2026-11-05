import express, { ErrorRequestHandler } from "express";
import { conectarMongo, cerrarMongo } from "./db/mongo";
import { tebeosRouter } from "./routes/tebeos";

const app = express();
app.use(express.json());
app.use("/tebeos", tebeosRouter);

const manejarErrores: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof SyntaxError && "body" in error) {
    res.status(400).json({ error: "JSON incorrecto" });
    return;
  }
  console.error(error);
  res.status(500).json({ error: "Error interno del servidor" });
};
app.use(manejarErrores);

const puerto = Number(process.env.PORT || 3000);

const iniciar = async (): Promise<void> => {
  try {
    await conectarMongo();
    const servidor = app.listen(puerto, () => {
      console.log(`API disponible en http://localhost:${puerto}/tebeos`);
    });
    const cerrar = (): void => {
      servidor.close(() => { void cerrarMongo().then(() => process.exit(0)); });
    };
    process.on("SIGINT", cerrar);
    process.on("SIGTERM", cerrar);
  } catch (error) {
    console.error("No se pudo conectar a MongoDB:", error);
    await cerrarMongo();
    process.exitCode = 1;
  }
};

void iniciar();
