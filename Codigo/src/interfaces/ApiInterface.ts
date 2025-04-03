import AppResponse from "./types/AppResponse.js";
import Metadata from "./types/Metadata.js";

export interface ApiInterface {
  storeMetadata(datos: Metadata): Promise<AppResponse<boolean>>;

  getTotalStorage(usuarioId: number): Promise<AppResponse<number>>;

  getStatistics(
    usuarioId: number,
    fechaInicio: string,
    fechaFin: string,
    tipoArchivoId?: number
  ): Promise<AppResponse<any[]>>;
}
