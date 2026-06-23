const bcrypt = require("bcrypt");

const Admin = require(
 "../models/adminModel"
);

exports.login = async (req,res)=>{

 try{

  const {username,password}
   = req.body;

  const admin =
   await Admin.findAdmin(username);

  if(!admin){

   return res
   .status(401)
   .json({message:"Wrong credentials"});

  }

  const valid =
   await bcrypt.compare(
    password,
    admin.password
   );

  if(!valid){

   return res
   .status(401)
   .json({message:"Wrong credentials"});

  }

  req.session.admin = true;

  res.json({
   success:true
  });

 }catch(error){

  res.status(500).json(error);

 }

};

exports.logout=(req,res)=>{

 req.session.destroy();

 res.json({
  success:true
 });

};