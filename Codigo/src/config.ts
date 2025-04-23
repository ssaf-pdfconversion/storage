export const APP_HOST = process.env.APP_HOST || "localhost";
export const APP_PORT = Number(process.env.APP_PORT) || 3000;

export const DB_HOST = process.env.DB_HOST || "localhost";
export const DB_USER = process.env.DB_USER || "root";
export const DB_PASSWORD = process.env.DB_PASSWORD || "storage";
export const DB_DATABASE = process.env.DB_DATABASE || "storage";
export const DB_PORT = Number(process.env.DB_PORT) || 3306;