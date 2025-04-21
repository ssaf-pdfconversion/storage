
import { response } from "express";
import pool from "../db/Database.js";
import { ApiInterface } from "../interfaces/ApiInterface.js";
import  AppResponse  from "../interfaces/types/AppResponse.js";
import  Metadata  from "../interfaces/types/Metadata.js";
import Statistics from "../interfaces/types/Statistics.js";
import { format, eachDayOfInterval } from 'date-fns';


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
                

                const conversionsResult : any = await conn.query(
                    "INSERT INTO conversions (USER_ID, TRANSACTIONS_ID, FILE_TYPE_ID, SIZE, CONVERSION_TIMESTAMP, CONVERSION_STATUS) VALUES (?, ?, ?, ?, ?, ?)",
                [
                    conversion.userId,
                    transactionId,
                    conversion.fileTypeId,
                    conversion.size,
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
            status: true,
            message: "Datos guardados correctamente",
            data: true,
        };

    }catch (error){

        await conn.rollback();
        console.log(" Error al almacenar los datos:", error);
        console.log("Datos recibidos:", JSON.stringify(datos, null, 2));
        
        return {
            status: false,
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

        const rows = await pool.query(
            "SELECT SUM(SIZE) AS total FROM conversions WHERE USER_ID = ?",
            [usuarioId]
        );

        console.log("Resultado de query:", rows);

        const total = rows?.[0]?.total ?? 0;
        const totalMB = total / (1024 * 1024);

        return {
            status: true,
            message: "Total de almacenamiento del usuario",
            data: totalMB,
        };

    } catch (error) {
        console.log("Error al obtener almacenamiento total del usuario");
        console.log(" Error al almacenar los datos:", error);

        return {
            status: false,
            message: "Error al obtener almacenamiento total del usuario",
            data: 0,
        };
    }
}


    async getStatistics(usuarioId: number, fechaInicio: string, fechaFin: string, tipoArchivoId: number): Promise<AppResponse<Statistics[]>> {

        try{
            console.log("Valores recibidos:", {
                usuarioId,
                fechaInicio,
                fechaFin,
                tipoArchivoId
              })

            const rows = await pool.query
            ("SELECT DATE(CONVERT_TZ(CONVERSION_TIMESTAMP, '+00:00', '-05:00')) AS date, SUM(SIZE) AS total FROM conversions WHERE USER_ID = ? AND DATE(CONVERT_TZ(CONVERSION_TIMESTAMP, '+00:00', '-05:00')) BETWEEN ? AND ? AND FILE_TYPE_ID = ? GROUP BY date ORDER BY date",
                [usuarioId,fechaInicio, fechaFin, tipoArchivoId ]
            )

            console.log("Resultado de query:", rows);
            
            const conversionesPorFecha: Record<string, number> = {};
            for (const row of rows) {
              const fecha = format(new Date(row.date), 'yyyy-MM-dd');
              const totalMB = +(row.total / (1024 * 1024)).toFixed(2); 
              conversionesPorFecha[fecha] = totalMB;
            }

            function parseFechaLocal(fechaStr: string): Date {
                const [año, mes, dia] = fechaStr.split('-').map(Number);
                return new Date(año, mes - 1, dia); 
              }

            const fechas = eachDayOfInterval({
                start: parseFechaLocal(fechaInicio),
                end: parseFechaLocal(fechaFin)
              });
            
              const estadisticas: Statistics[] = fechas.map(dia => {
                const fechaStr = format(dia, 'yyyy-MM-dd');
                return {
                  date: fechaStr,
                  totalMB: conversionesPorFecha[fechaStr] ?? 0
                };
              }
            );

            return {
                status: true,
                message: "Estadísticas diarias obtenidas correctamente",
                data: estadisticas
                
            };

        }catch (error){
            console.log(" Error al obtener la estadística: ", error);
            return {
                status: false,
                message: "Error al obtener la estadística",
                data: []
                
            };

        }
    }
}
