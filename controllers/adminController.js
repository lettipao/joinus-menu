const bcrypt = require("bcrypt");
const Admin = require("../models/adminModel");

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const admin = await Admin.findAdmin(username);

    if (!admin) {
      return res.status(401).json({ message: "Wrong credentials" });
    }

    const valid = await bcrypt.compare(password, admin.password);

    if (!valid) {
      return res.status(401).json({ message: "Wrong credentials" });
    }

    req.session.admin = true;
    req.session.adminUser = username;

    res.json({ success: true });

  } catch (error) {
    console.error(error);
    res.status(500).json({
    error:error.message
  });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
};