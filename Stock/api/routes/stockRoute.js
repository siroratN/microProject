import express from "express"
import * as stockController from "../controller/stockController.js"

const router = express.Router()

router.post("/lock_stock", stockController.lock_stock)

export default router