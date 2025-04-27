import express, { json } from "express";
import { router } from "./routes/routes.js";
import cors from "cors"; 
import https from "https";
import fs from "fs";
import path from 'path';
import { fileURLToPath } from 'url';

import dotenv from 'dotenv';
dotenv.config();

import { APP_HOST, APP_PORT } from './config.js';

export const app = express(); 
app.use(json());
app.disable("x-powered-by");

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", router);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/static', express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  next(()=>{
    res.status(404)
  })
});

const keyPath = path.join(__dirname, '..', 'dist', 'certs', 'storagessl.key');
const certPath = path.join(__dirname, '..', 'dist', 'certs', 'storagessl.crt');

console.log(keyPath)
console.log(certPath)

const options = {
  key: fs.readFileSync(keyPath),
  cert: fs.readFileSync(certPath)
};

// Iniciar el servidor
https.createServer(options, app)
  .listen(APP_PORT, () => {
    console.log("Servidor corriendo en" , APP_HOST, APP_PORT);
  });


