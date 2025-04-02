export interface SocketInterface {
    sendData(
        usuarioId: number, 
        tipoArchivoId: number, 
        size: number, 
        fechaHora: string): Promise<string>;
}
