import express from "express"
import * as authenController from "../controller/authenController.js";

const router = express.Router()

router.post("/register", authenController.Register)
router.post("/login", authenController.Login)
router.get("/logout", authenController.Logout)
router.get("/checkPermission", authenController.checkPermission)


export default router