import express from "express"
import * as stockController from "../controller/stockController.js"

const router = express.Router()

router.post("/updateQuantity/:id", stockController.log_stock)
router.get("/", (req, res) => {
    res.json({ message: "Stock Controller is working!" });
});

export default router