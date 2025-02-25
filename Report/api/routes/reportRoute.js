import express from "express"
import * as reportController from "../controller/reportController.js"

const router = express.Router()

router.post("/Createreport", reportController.createReport)
router.get("/Createreport/download/", reportController.downloadReport);

export default router