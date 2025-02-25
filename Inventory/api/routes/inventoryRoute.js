import express from "express"
import * as inventoryController from "../controller/inventory.js"

const router = express.Router()

router.get("/getProducts/:id", inventoryController.getProductsById)
router.post("/addProduct", inventoryController.addProduct)
router.post("/updateStock", inventoryController.updateStock)
router.get("/getAllProducts", inventoryController.getAllProducts)
router.get("/dashboard_inventory", inventoryController.dashboard_inventory)
router.get("/getProductsByCategory/:category", inventoryController.getProductsByCategory)
router.get("/allCategories", inventoryController.allCategories)

export default router