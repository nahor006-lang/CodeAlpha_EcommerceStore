const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const db = require("../db");

// ---------- Register ----------
router.get("/register", (req, res) => {
  res.render("register", { activePage: "", error: null });
});

router.post("/register", (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!name || !email || !password) {
    return res.render("register", {
      activePage: "",
      error: "Please fill in every field."
    });
  }
  if (password !== confirmPassword) {
    return res.render("register", {
      activePage: "",
      error: "Passwords do not match."
    });
  }
  if (db.getUserByEmail(email)) {
    return res.render("register", {
      activePage: "",
      error: "An account with that email already exists."
    });
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  const user = db.createUser({ name, email, passwordHash });

  req.session.userId = user.id;
  res.redirect(req.session.redirectTo || "/account");
});

// ---------- Login ----------
router.get("/login", (req, res) => {
  res.render("login", { activePage: "", error: null });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = db.getUserByEmail(email || "");

  if (!user || !bcrypt.compareSync(password || "", user.passwordHash)) {
    return res.render("login", {
      activePage: "",
      error: "Incorrect email or password."
    });
  }

  req.session.userId = user.id;
  const redirectTo = req.session.redirectTo || "/account";
  delete req.session.redirectTo;
  res.redirect(redirectTo);
});

// ---------- Logout ----------
router.post("/logout", (req, res) => {
  req.session.userId = null;
  res.redirect("/");
});

module.exports = router;
