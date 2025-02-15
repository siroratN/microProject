import express from "express"
import * as stockController from "../controller/stockController.js"

const router = express.Router()

router.post("/log_stock", stockController.log_stock)

export default router