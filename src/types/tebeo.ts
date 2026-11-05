export type Tebeo = {
  _id: string;
  titulo: string;
  autor: string;
  editorial: string;
  numero: number;
  fechaPublicacion: string;
  precio: number;
  leido: boolean;
};

export type ErrorAPI = { error: string };

export type DatosTebeo = Omit<Tebeo, "_id">;
