import { Router } from "express";

import {  ControllerData} from "../controller/controllerData.js";

export const router = Router();


router.post("/storeMetadata", ControllerData.storeMetadata);
router.get("/getTotalStorage/:usuarioId", ControllerData.getTotalStorage);
router.get("/getStatistics", ControllerData.getStatistics);
