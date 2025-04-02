export class ControllerData {

    static storeMetadata(): boolean {
        return true;
    }

    static getTotalStorage(): number {
        return 69;
    }

    static getStatistics(): object {
        return {
            message: "getStatistics funciona correctamente",
            timestamp: new Date().toISOString()
        };
    }



}