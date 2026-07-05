const express = require("express");
const session = require("express-session");
const path = require("path");

const { attachLocals } = require("./middleware/auth-middleware");
const productRoutes = require("./routes/product-routes");
const cartRoutes = require("./routes/cart-routes");
const authRoutes = require("./routes/auth-routes");
const orderRoutes = require("./routes/order-routes");
const pagesRoutes = require("./routes/pages-routes");

const app = express();
const PORT = process.env.PORT || 3000;

// ---------- View engine ----------
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.set("views", path.join(__dirname, "views"));

// ---------- Core middleware ----------
app.use(express.urlencoded({ extended: true })); // parse HTML form posts
app.use(express.json());

// ---------- Static assets ----------
// Because the project is one flat folder, we can't just `express.static`
// the whole directory — that would also serve server.js, db.js, and
// data.json (which has password hashes in it) straight over HTTP.
// Instead, only these exact files are servable as static assets.
// >>> If you add a new image, add its filename here too. <<<

app.use(express.json());
// Serve everything inside /public
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "ma-space-dev-secret-change-me", // change this in production
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 } // 1 week
  })
);

app.use(attachLocals); // makes currentUser + cartCount available to all views

// ---------- Routes ----------
app.use("/", productRoutes);
app.use("/", cartRoutes);
app.use("/", authRoutes);
app.use("/", orderRoutes);
app.use("/", pagesRoutes);

// ---------- 404 ----------
app.use((req, res) => {
  res.status(404).render("404", { activePage: "" });
});

app.listen(PORT, () => {
  console.log(`MA SPACE running at http://localhost:${PORT}`);
});
