const express = require("express");
const router = express.Router();

const ProductController =
 require("../controllers/productController");

const auth =
 require("../middleware/auth");

const upload =
 require("../middleware/upload");

/* PUBLIC */
router.get(
 "/public",
 ProductController.publicMenu
);

/* ADMIN */
router.get(
 "/admin",
 auth,
 ProductController.adminMenu
);

/* CREATE PRODUCT */
router.post(
 "/",
 auth,
 upload.single("image"),
 ProductController.create
);

/* DELETE */
router.delete(
 "/:id",
 auth,
 ProductController.remove
);

/* TOGGLE VISIBILITY */
router.put(
 "/:id/visibility",
 auth,
 ProductController.toggle
);

router.put("/reorder", auth, async (req,res)=>{

 const {draggedId, targetId} = req.body;

 const db = require("../models/database");

 db.serialize(()=>{

  db.run(
   "UPDATE products SET position = position + 1 WHERE id = ?",
   [targetId]
  );

  db.run(
   "UPDATE products SET position = position - 1 WHERE id = ?",
   [draggedId]
  );

 });

 res.json({success:true});
});

module.exports = router;