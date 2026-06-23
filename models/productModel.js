const db = require("./database");

function run(sql, params = []) {
  return new Promise((res, rej) => {
    db.run(sql, params, function (err) {
      if (err) return rej(err);
      res(this);
    });
  });
}

function all(sql, params = []) {
  return new Promise((res, rej) => {
    db.all(sql, params, (err, rows) => {
      if (err) return rej(err);
      res(rows);
    });
  });
}

/* GET ALL */
exports.getAllProducts = () =>
  all("SELECT * FROM products ORDER BY position ASC");

/* GET VISIBLE */
exports.getVisibleProducts = () =>
  all("SELECT * FROM products WHERE visible=1 ORDER BY position ASC");

/* CREATE */
exports.createProduct = (p) =>
  run(`
    INSERT INTO products (
      name, description, price,
      image, category,
      visible, position
    )
    VALUES (?,?,?,?,?,?,?)
  `, [
    p.name,
    p.description,
    Number(p.price),
    p.image,
    p.category,
    p.visible ?? 1,
    p.position ?? 0
  ]).then(r => r.lastID);

/* DELETE */
exports.deleteProduct = (id) =>
  run("DELETE FROM products WHERE id=?", [id]);

/* VISIBILITY */
exports.updateVisibility = (id, v) =>
  run(
    "UPDATE products SET visible=? WHERE id=?",
    [v, id]
  );

/* UPDATE */
exports.updateProduct = (id, p) =>
  run(`
    UPDATE products
    SET name=?, description=?, price=?, image=?, category=?
    WHERE id=?
  `, [
    p.name,
    p.description,
    Number(p.price),
    p.image,
    p.category,
    id
  ]);

/* =========================
   SAFE REORDER (NEW)
========================= */
exports.reorder = async (draggedId, targetId) => {

  const items = await all(
    "SELECT id FROM products ORDER BY position ASC"
  );

  const draggedIndex = items.findIndex(x => x.id == draggedId);
  const targetIndex = items.findIndex(x => x.id == targetId);

  if (draggedIndex < 0 || targetIndex < 0) return;

  const moved = items.splice(draggedIndex, 1)[0];
  items.splice(targetIndex, 0, moved);

  const updates = items.map((item, index) =>
    run(
      "UPDATE products SET position=? WHERE id=?",
      [index, item.id]
    )
  );

  await Promise.all(updates);
};