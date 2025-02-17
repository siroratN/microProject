import express from "express"
import * as authenController from "../controller/authenController.js";

const router = express.Router()

router.post("/register", authenController.Register)
router.post("/login", authenController.Login)


export default router