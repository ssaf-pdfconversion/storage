interface SocketInterface {
    sendData(
        idConversion : number,
        usuarioId: number, 
        tipoArchivoId: number, 
        size: number, 
        fechaHora: string): Promise<string>;
}
