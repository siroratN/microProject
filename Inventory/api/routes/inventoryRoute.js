import express from "express"
import * as inventoryController from "../controller/inventory.js"

const router = express.Router()

router.get("/getProducts/:id", inventoryController.getProducts)
router.get("/getProducts/", inventoryController.getAllProducts)
router.post("/addProduct", inventoryController.addProduct)
router.post("/updateStock", inventoryController.updateStock)
// router.get("/sendAlertMessage", inventoryController.sendAlertMessage)

export default router