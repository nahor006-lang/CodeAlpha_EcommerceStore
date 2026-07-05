const express = require("express");
const router = express.Router();
const db = require("../db");

// ---------- About ----------
router.get("/about", (req, res) => {
  res.render("about", { activePage: "" });
});

// ---------- Terms & Conditions ----------
router.get("/terms", (req, res) => {
  res.render("terms", { activePage: "" });
});

// ---------- Blog (static sample posts for now) ----------
const BLOG_POSTS = [
  {
    title: "Designing for a quieter home",
    excerpt:
      "Why we build every MA SPACE piece around soft edges, muted tone, and materials that age gracefully.",
    image: "/images/lounge-sofa.jpg"
  },
  {
    title: "A short guide to layered lighting",
    excerpt:
      "Pendant, ambient, and task lighting working together — how to layer light the way you'd layer texture.",
    image: "/images/lighting-cat.jpg"
  },
  {
    title: "Bringing the outdoors in (and vice versa)",
    excerpt:
      "Simple ways to make an outdoor space feel like a natural extension of the room next to it.",
    image: "/images/outdoor-cat.jpg"
  }
];

router.get("/blog", (req, res) => {
  res.render("blog", { activePage: "", posts: BLOG_POSTS });
});

// ---------- Contact ----------
router.get("/contact", (req, res) => {
  res.render("contact", { activePage: "", error: null, sent: false });
});

router.post("/contact", (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.render("contact", {
      activePage: "",
      error: "Please fill in every field.",
      sent: false
    });
  }

  db.createMessage({ name, email, message });
  res.render("contact", { activePage: "", error: null, sent: true });
});

module.exports = router;
