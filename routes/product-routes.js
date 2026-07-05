const express = require("express");
const router = express.Router();
const db = require("../db");

// Home page
router.get("/", (req, res) => {
  const newArrivals = db.getAllProducts().slice(0, 4);
  res.render("index", {
    activePage: "home",
    newArrivals,
    categories: db.getCategories()
  });
});

// Shop / New Arrivals listing (supports ?category=Lighting)
router.get("/shop", (req, res) => {
  const category = req.query.category || "All";
  const products = db.getProductsByCategory(category);
  res.render("shop", {
    activePage: "shop",
    products,
    category,
    categories: ["All", ...db.getCategories()]
  });
});

// New Arrivals (all products tagged "New")
router.get("/new-arrivals", (req, res) => {
  const products = db.getAllProducts().filter((p) => p.tag === "New");
  res.render("new-arrivals", {
    activePage: "new-arrivals",
    products
  });
});

// Product detail page
router.get("/product/:id", (req, res) => {
  const product = db.getProductById(req.params.id);
  if (!product) return res.status(404).render("404", { activePage: "" });

  // simple "related products" = other items in the same category
  const related = db
    .getProductsByCategory(product.category)
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  res.render("product", { activePage: "shop", product, related });
});

module.exports = router;
