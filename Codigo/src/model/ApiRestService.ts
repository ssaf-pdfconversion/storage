
import pool from "../db/Database.js";
import { ApiInterface } from "../interfaces/ApiInterface.js";
import  AppResponse  from "../interfaces/types/AppResponse.js";
import  Metadata  from "../interfaces/types/Metadata.js";


function formatDateForMySQL(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toISOString().slice(0, 19).replace("T", " ");
  }
  

export class ApiRestService implements ApiInterface {

    
    async storeMetadata(datos: Metadata): Promise<AppResponse<boolean>> {
        console.log("Entro al modelo");
        console.log(datos);
        
        const conn = await pool.getConnection();

        try{
            
            await conn.beginTransaction();

            // Tabla transacción
            const timestampQueryFormatted = formatDateForMySQL(datos.transaction.timestampQuery);

            const transactionResult : any = await conn.query("INSERT INTO transactions (TIMESTAMP_QUERY)  VALUES (?)",
                [timestampQueryFormatted]
            );

            const transactionId = transactionResult.insertId;

            // Tabla conversiones
            for (const conversion of datos.transaction.conversions){

                const timestampQueryFormattedConversion = formatDateForMySQL(conversion.conversionTimestamp);
                const byteSize = conversion.size * 1024 * 1024;

                const conversionsResult : any = await conn.query(
                    "INSERT INTO conversions (USER_ID, TRANSACTIONS_ID, FILE_TYPE_ID, SIZE, CONVERSION_TIMESTAMP, CONVERSION_STATUS) VALUES (?, ?, ?, ?, ?, ?)",
                [
                    conversion.userId,
                    transactionId,
                    conversion.fileTypeId,
                    byteSize,
                    timestampQueryFormattedConversion,
                    conversion.conversionStatus ? 1 : 0,
                ] 
            );
            const conversionId = conversionsResult.insertId;

            // Tabla iteraciones
            for (const iteration of conversion.iterations){

                const timestampFormattedInitial = formatDateForMySQL(iteration.initialTimestamp);
                const timestampFormattedreturn = formatDateForMySQL(iteration.returnTimestamp);

                await conn.query ("INSERT INTO iterations (CONVERSIONS_ID, INITIAL_TIMESTAMP, CONVERSION_SUCCESS, MESSAGE, RETURN_TIMESTAMP, NODE_ID) VALUES (?, ?, ?, ?, ?, ?)",
                    [
                        conversionId,
                        timestampFormattedInitial,
                        iteration.conversionSuccess ? 1 : 0,
                        iteration.message,
                        timestampFormattedreturn,
                        iteration.nodeId
                        
                    ]
                );   
            }
        }
        
        await conn.commit();
        
        return {
            status: 200,
            message: "Datos guardados correctamente",
            data: true,
        };

    }catch (error){

        await conn.rollback();
        console.log(" Error al almacenar los datos:", error);
        console.log("Datos recibidos:", JSON.stringify(datos, null, 2));
        
        return {
            status: 500,
            message: "Error al guardar los datos desde el modelo",
            data: false,
        };
    } finally {
        conn.release();
    }
}

    async getTotalStorage(usuarioId: number): Promise<AppResponse<number>> {
        try {
            console.log(usuarioId);
            

            const rows = await pool.query ("SELECT SUM(SIZE) AS total FROM conversions WHERE USER_ID = ?",
            [usuarioId]);

            console.log("Resultado de query:", rows);

            const totalBytes = rows?.[0]?.total ?? 0;
            const total = +(totalBytes / (1024 * 1024)).toFixed(2);

            return {
                status: 200,
                message: "Total de almacenamiento del usuario",
                data:total,
    
            };

        }catch(error){
            console.log("Error al obtener almacenamiento total del usuario");
            console.log(" Error al almacenar los datos:", error);

            return {
                status: 500,
                message: "Error al obtener almacenamiento total del usuario",
                data:0,
    
            };
        }

    }

    async getStatistics(usuarioId: number, fechaInicio: string, fechaFin: string, tipoArchivoId?: number): Promise<AppResponse<any>> {

        // Me dio sueño y no se que va
        
        return {
            status: 200,
            message: "Datos guardados correctamente",
            data:1,
        };
    }
}
