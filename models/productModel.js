const db = require("./database");
exports.getAllProducts = () => {

 return new Promise((resolve,reject)=>{

  db.all(
   `
   SELECT *
   FROM products
   ORDER BY position ASC
   `,
   [],
   (err,rows)=>{

    if(err) reject(err);

    resolve(rows);

   }
  );

 });

};

exports.getVisibleProducts = () => {

 return new Promise((resolve,reject)=>{

  db.all(
   `
   SELECT *
   FROM products
   WHERE visible=1
   ORDER BY position ASC
   `,
   [],
   (err,rows)=>{

    if(err) reject(err);

    resolve(rows);

   }
  );

 });

};

exports.createProduct = product => {

 return new Promise((resolve,reject)=>{

  db.run(
   `
   INSERT INTO products
   (
    name,
    description,
    price,
    image,
    category,
    allergens,
    visible,
    featured,
    position
   )

   VALUES(?,?,?,?,?,?,?,?,?)
   `,
   [
    product.name,
    product.description,
    product.price,
    product.image,
    product.category,
    product.allergens,
    product.visible,
    product.featured,
    product.position
   ],

   function(err){

    if(err) reject(err);

    resolve(this.lastID);

   }
  );

 });

};

exports.deleteProduct = id => {

 return new Promise((resolve,reject)=>{

  db.run(
   `
   DELETE FROM products
   WHERE id=?
   `,
   [id],
   err=>{

    if(err) reject(err);

    resolve();

   }
  );

 });

};

exports.updateVisibility = (id,visible)=>{

 return new Promise((resolve,reject)=>{

  db.run(
   `
   UPDATE products
   SET visible=?
   WHERE id=?
   `,
   [visible,id],
   err=>{

    if(err) reject(err);

    resolve();

   }
  );

 });

};