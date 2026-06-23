const express = require("express");
const router = express.Router();

const ProductController = require("../controllers/productController");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const Product = require("../models/productModel");

/* PUBLIC */
router.get("/public", ProductController.publicMenu);

/* ADMIN */
router.get("/admin", auth, ProductController.adminMenu);

/* CREATE */
router.post("/", auth, upload.single("image"), ProductController.create);

/* DELETE */
router.delete("/:id", auth, ProductController.remove);

/* TOGGLE */
router.put("/:id/visibility", auth, ProductController.toggle);

/* UPDATE */
router.put("/:id", auth, upload.single("image"), ProductController.update);

/* =========================
   REORDER (PRODUCTION SAFE)
========================= */
router.put("/reorder", auth, async (req, res) => {
  try {
    const { draggedId, targetId } = req.body;

    await Product.reorder(draggedId, targetId);

    res.json({ success: true });

  } catch (e) {
    res.status(500).json({ error: "reorder failed" });
  }
});

module.exports = router;