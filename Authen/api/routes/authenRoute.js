import express from "express"
import * as authenController from "../controller/authen.js"

const router = express.Router()

router.post("/register", authenController.Register)


export default router