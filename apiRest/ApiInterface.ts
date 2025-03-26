interface ApiInterface {
 
    storeMetadata(datos: {
        idConversion : number,
        usuarioId: number;
        tipoArchivoId: number;
        size: number;
        fechaHora: string; 
    }): Promise<object>;

    
    getTotalStorage(usuarioId: number): Promise<number>;


    getStatistics(
        usuarioId: number, 
        fechaInicio: string, 
        fechaFin: string, 
        tipoArchivoId?: number): Promise<object>;
}