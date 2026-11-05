"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarTebeo = exports.obtenerId = void 0;
const mongodb_1 = require("mongodb");
const obtenerId = (id) => {
    // ObjectId.isValid admite algunos formatos no canónicos; aquí se exigen 24 hexadecimales.
    return /^[0-9a-fA-F]{24}$/.test(id) ? new mongodb_1.ObjectId(id) : null;
};
exports.obtenerId = obtenerId;
const fechaValida = (valor) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(valor))
        return false;
    const [anio, mes, dia] = valor.split("-").map(Number);
    if (anio < 1 || mes < 1 || mes > 12 || dia < 1)
        return false;
    const fecha = new Date(Date.UTC(anio, mes - 1, dia));
    fecha.setUTCFullYear(anio);
    return fecha.getUTCFullYear() === anio &&
        fecha.getUTCMonth() === mes - 1 && fecha.getUTCDate() === dia;
};
const validarTebeo = (valor) => {
    if (typeof valor !== "object" || valor === null || Array.isArray(valor)) {
        return { error: "El cuerpo debe ser un objeto JSON" };
    }
    const obj = valor;
    const campos = ["titulo", "autor", "editorial", "numero", "fechaPublicacion", "precio", "leido"];
    if (Object.keys(obj).some(campo => !campos.includes(campo))) {
        return { error: "El cuerpo contiene campos no permitidos" };
    }
    for (const campo of ["titulo", "autor", "editorial"]) {
        if (typeof obj[campo] !== "string" || obj[campo].trim() === "") {
            return { error: `El campo ${campo} debe ser un texto no vacío` };
        }
    }
    if (typeof obj.numero !== "number" || !Number.isInteger(obj.numero) || obj.numero <= 0) {
        return { error: "El campo numero debe ser un entero mayor que cero" };
    }
    if (typeof obj.fechaPublicacion !== "string" || !fechaValida(obj.fechaPublicacion)) {
        return { error: "fechaPublicacion debe ser una fecha válida YYYY-MM-DD" };
    }
    if (typeof obj.precio !== "number" || !Number.isFinite(obj.precio) || obj.precio < 0) {
        return { error: "El campo precio debe ser un número mayor o igual a cero" };
    }
    if (typeof obj.leido !== "boolean") {
        return { error: "El campo leido debe ser booleano" };
    }
    return { datos: {
            titulo: obj.titulo.trim(),
            autor: obj.autor.trim(),
            editorial: obj.editorial.trim(),
            numero: obj.numero,
            fechaPublicacion: obj.fechaPublicacion,
            precio: obj.precio,
            leido: obj.leido
        } };
};
exports.validarTebeo = validarTebeo;
