const express = require("express");
const router = express.Router();
const db = require("../db");
const { requireLogin } = require("../middleware/auth-middleware");

function cartTotal(cart) {
  return Object.entries(cart).reduce((sum, [productId, qty]) => {
    const product = db.getProductById(productId);
    return product ? sum + product.price * qty : sum;
  }, 0);
}

// Checkout page (must be logged in)
router.get("/checkout", requireLogin, (req, res) => {
  const cart = req.session.cart;
  const items = Object.entries(cart)
    .map(([productId, qty]) => {
      const product = db.getProductById(productId);
      return product ? { product, qty, lineTotal: product.price * qty } : null;
    })
    .filter(Boolean);

  if (items.length === 0) return res.redirect("/cart");

  res.render("checkout", {
    activePage: "cart",
    items,
    subtotal: cartTotal(cart),
    error: null
  });
});

// Place order
router.post("/checkout", requireLogin, (req, res) => {
  const cart = req.session.cart;
  const items = Object.entries(cart)
    .map(([productId, qty]) => {
      const product = db.getProductById(productId);
      return product
        ? { productId: product.id, name: product.name, price: product.price, qty }
        : null;
    })
    .filter(Boolean);

  if (items.length === 0) return res.redirect("/cart");

  const { fullName, address, city, postalCode, country } = req.body;
  if (!fullName || !address || !city || !postalCode || !country) {
    const viewItems = items.map((i) => ({
      product: db.getProductById(i.productId),
      qty: i.qty,
      lineTotal: i.price * i.qty
    }));
    return res.render("checkout", {
      activePage: "cart",
      items: viewItems,
      subtotal: cartTotal(cart),
      error: "Please fill in all shipping fields."
    });
  }

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const order = db.createOrder({
    userId: req.session.userId,
    items,
    total,
    shipping: { fullName, address, city, postalCode, country }
  });

  req.session.cart = {}; // empty the cart
  res.redirect(`/order-confirmation/${order.id}`);
});

// Order confirmation
router.get("/order-confirmation/:id", requireLogin, (req, res) => {
  const order = db.getOrderById(req.params.id);
  if (!order || order.userId !== req.session.userId) {
    return res.status(404).render("404", { activePage: "" });
  }
  res.render("order-confirmation", { activePage: "", order });
});

// Account page: order history
router.get("/account", requireLogin, (req, res) => {
  const orders = db.getOrdersByUser(req.session.userId);
  res.render("account", { activePage: "", orders });
});

module.exports = router;
