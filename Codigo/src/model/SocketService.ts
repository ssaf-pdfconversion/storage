
import { SocketInterface } from "../interfaces/SocketInterface.js";

export class SocketService implements SocketInterface {
    async sendData(usuarioId: number, tipoArchivoId: number, size: number, fechaHora: string): Promise<string> {
        // 
        return "Data enviadaaaaa";
    }
}