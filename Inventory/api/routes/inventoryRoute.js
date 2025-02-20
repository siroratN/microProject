import express from "express"
import * as inventoryController from "../controller/inventory.js"

const router = express.Router()

router.get("/getProducts/:id", inventoryController.getProductsById)
router.post("/addProduct", inventoryController.addProduct)
router.post("/updateStock", inventoryController.updateStock)
router.get("/getAllProducts", inventoryController.getAllProducts)

export default router