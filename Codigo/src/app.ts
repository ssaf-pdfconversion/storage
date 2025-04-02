import express, { json } from "express";
import {router} from "./routes/routes.js";
import cors from "cors"; 
import http from "http";
import path from 'path';
import { fileURLToPath } from 'url';



const APP_HOST = "localhost";
const APP_PORT = 3000;

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

app.use(function (req, res, next) {
  res.send("holiiiiiiiiiiii")
});

http.createServer(app).listen(APP_PORT);
console.log("Server on port", APP_HOST, APP_PORT);