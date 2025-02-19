import express from "express"
import * as inventoryController from "../controller/inventory.js"

const router = express.Router()

router.get("/getProducts/:id", inventoryController.getProductsById)
router.post("/addProduct", inventoryController.addProduct)
router.post("/updateStock", inventoryController.updateStock)
<<<<<<< HEAD
router.get("/getAllProducts", inventoryController.getAllProducts)
=======
router.get("/getProducts/", inventoryController.getAllProducts)
// router.get("/sendAlertMessage", inventoryController.sendAlertMessage)



>>>>>>> 86a73ca5446b82817f46ea017147831a12ad4fe6
export default router