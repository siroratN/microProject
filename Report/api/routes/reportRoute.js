import express from "express"
import * as reportController from "../controller/reportController.js"

const router = express.Router()

router.post("/report", reportController.log_stock)

export default router