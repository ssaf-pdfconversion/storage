import Metadata from "./types/Metadata.js";

export interface ApiInterface {
  storeMetadata(datos: Metadata): Promise<object>;

  getTotalStorage(usuarioId: number): Promise<number>;

  getStatistics(
    usuarioId: number,
    fechaInicio: string,
    fechaFin: string,
    tipoArchivoId?: number
  ): Promise<object>;
}
