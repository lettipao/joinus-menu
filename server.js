require("dotenv").config();

const express = require("express");
const session = require("express-session");
const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");
const path = require("path");

const app = express();

/* ROUTES */
const adminRoutes =
 require("./routes/adminRoutes");

const productRoutes =
 require("./routes/productRoutes");

/* SECURITY */
app.use(helmet());
app.use(cors());
app.use(compression());

/* BODY */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* SESSION */
app.use(
 session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
   httpOnly: true
  }
 })
);

/* STATIC */
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

/* ROUTES */
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);

/* HEALTH CHECK */
app.get("/api/health", (req, res) => {
 res.json({ status: "ok" });
});

/* START */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
 console.log("Server running on port " + PORT);
});

app.get("/qr", (req,res)=>{
 res.json({
  url: "da_fare"
 });
});