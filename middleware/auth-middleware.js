const db = require("../db");

// Makes the logged-in user + cart item count available in EVERY view
// (used by the header partial for "Login/Account" and the cart badge).
function attachLocals(req, res, next) {
  res.locals.currentUser = req.session.userId
    ? db.getUserById(req.session.userId)
    : null;

  if (!req.session.cart) req.session.cart = {}; // { productId: qty }
  const cart = req.session.cart;
  res.locals.cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  next();
}

// Blocks a route unless the user is logged in, remembering where they
// were headed so we can send them back after login.
function requireLogin(req, res, next) {
  if (!req.session.userId) {
    req.session.redirectTo = req.originalUrl;
    return res.redirect("/login");
  }
  next();
}

module.exports = { attachLocals, requireLogin };
