import { Router } from "express";

import {  ControllerData} from "../controller/controllerData.js";

export const router = Router();


router.post("/storeMetadata", (req, res) => {
    res.json(ControllerData.storeMetadata());
});

router.get("/getTotalStorage", (req, res) => {
    res.json(ControllerData.getTotalStorage());
});

router.get("/getStatistics", (req, res) => {
    res.json(ControllerData.getStatistics());
});



