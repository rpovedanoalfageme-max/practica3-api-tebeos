"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongo_1 = require("./db/mongo");
const tebeos_1 = require("./routes/tebeos");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/tebeos", tebeos_1.tebeosRouter);
const manejarErrores = (error, _req, res, _next) => {
    if (error instanceof SyntaxError && "body" in error) {
        res.status(400).json({ error: "JSON incorrecto" });
        return;
    }
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
};
app.use(manejarErrores);
const puerto = Number(process.env.PORT || 3000);
const iniciar = async () => {
    try {
        await (0, mongo_1.conectarMongo)();
        const servidor = app.listen(puerto, () => {
            console.log(`API disponible en http://localhost:${puerto}/tebeos`);
        });
        const cerrar = () => {
            servidor.close(() => { void (0, mongo_1.cerrarMongo)().then(() => process.exit(0)); });
        };
        process.on("SIGINT", cerrar);
        process.on("SIGTERM", cerrar);
    }
    catch (error) {
        console.error("No se pudo conectar a MongoDB:", error);
        await (0, mongo_1.cerrarMongo)();
        process.exitCode = 1;
    }
};
void iniciar();
