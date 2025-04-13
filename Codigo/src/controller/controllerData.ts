import { Request, Response } from "express";
import { ApiRestService } from "../model/ApiRestService.js";

const apiService = new ApiRestService();

export class ControllerData {

    static async storeMetadata(req: Request, res: Response) {
        try {
            console.log("Controller storemetada activo");
            const metadata = req.body; 
            const result = await apiService.storeMetadata(metadata);
            console.log("Enviando respuesta:", result);
            res.status(result.status).json(result);
        } catch (error) {
            res.status(500).json({
            status: 500,
            message: "Error al guardar datos",
            data: false,
          });
        }
      }

      static async getTotalStorage(req: Request, res: Response) {
        try {
            console.log("Controller totalStorage activo");
            const usuarioId = Number(req.params.usuarioId);
            const result = await apiService.getTotalStorage(usuarioId);
            res.status(result.status).json(result);
        } catch (error) {
            res.status(500).json({
            status: 500,
            message: "Error al obtener almacenamiento",
            data: 0,
          });
        }
      }

      static async getStatistics(req: Request, res: Response) {
        try {
            console.log("Controller getStatistics activo");
            const usuarioId = Number(req.query.usuarioId);
            const fechaInicio = req.query.fechaInicio as string;
            const fechaFin = req.query.fechaFin as string;
            const tipoArchivoId = Number (req.query.tipoArchivoId);
            
            const result = await apiService.getStatistics(
                usuarioId,
                fechaInicio,
                fechaFin,
                tipoArchivoId
            );
            res.status(result.status).json(result);
        } catch (error) {
            res.status(500).json({
            status: 500,
            message: "Error al obtener estadísticas",
            data: [],
          }
        );
    }
}
}