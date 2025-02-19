import express from "express"
import * as reportController from "../controller/reportController.js"

const router = express.Router()

router.post("/Createreport", reportController.createReport)

export default router