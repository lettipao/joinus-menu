const db = require("./database");

exports.findAdmin = username => {

 return new Promise((resolve,reject)=>{

  db.get(
   "SELECT * FROM admins WHERE username=?",
   [username],
   (err,row)=>{

    if(err) reject(err);

    resolve(row);
   }
  );

 });

};