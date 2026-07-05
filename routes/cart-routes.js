const express = require("express");
const router = express.Router();
const db = require("../db");

function buildCartView(cart) {
  const items = Object.entries(cart)
    .map(([productId, qty]) => {
      const product = db.getProductById(productId);
      if (!product) return null;
      return { product, qty, lineTotal: product.price * qty };
    })
    .filter(Boolean);

  const subtotal = items.reduce((sum, i) => sum + i.lineTotal, 0);
  return { items, subtotal };
}

// View cart
router.get("/cart", (req, res) => {
  const { items, subtotal } = buildCartView(req.session.cart);
  res.render("cart", { activePage: "cart", items, subtotal });
});

// Add to cart (from product page or shop grid)
router.post("/cart/add", (req, res) => {
  const { productId } = req.body;
  const qty = Math.max(1, parseInt(req.body.qty, 10) || 1);
  const product = db.getProductById(productId);
  if (!product) return res.redirect("/shop");

  const cart = req.session.cart;
  cart[productId] = (cart[productId] || 0) + qty;

  const backTo = req.body.redirectTo || "/cart";
  res.redirect(backTo);
});

// Update quantity
router.post("/cart/update", (req, res) => {
  const { productId } = req.body;
  const qty = parseInt(req.body.qty, 10);
  const cart = req.session.cart;

  if (!qty || qty <= 0) {
    delete cart[productId];
  } else {
    cart[productId] = qty;
  }
  res.redirect("/cart");
});

// Remove item
router.post("/cart/remove", (req, res) => {
  delete req.session.cart[req.body.productId];
  res.redirect("/cart");
});

module.exports = router;
