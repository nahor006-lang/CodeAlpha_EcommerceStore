/**
 * db/db.js
 * ------------------------------------------------------------------
 * A tiny, dependency-free "database" that stores everything in a
 * single JSON file (db/data.json). It is intentionally simple so the
 * whole project runs with `npm install && npm start` and never needs
 * a native module to compile (which is where a lot of Node + SQLite
 * tutorials trip people up).
 *
 * >>> If you later want a "real" database, swap the functions below
 * >>> for calls to Postgres/MySQL/MongoDB/SQLite. Every route file
 * >>> only talks to this module, so that's the only place you'd
 * >>> need to change.
 * ------------------------------------------------------------------
 */
const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "data", "data.json");

function defaultData() {
  return {
    nextProductId: 10,
    nextUserId: 1,
    nextOrderId: 1000,
    nextMessageId: 1,
    products: [
      {
        id: 1,
        name: "Minimalist Cozy Chair",
        category: "Seating",
        price: 189,
        tag: "New",
        image: "/images/product1.jpg",
        description:
          "A softly upholstered accent chair with clean lines and a solid wood frame. Designed to slip into any corner and instantly make it feel considered."
      },
      {
        id: 2,
        name: "Earthy Lounge Sofa",
        category: "Seating",
        price: 1249,
        tag: "New",
        image: "/images/product2.jpg",
        description:
          "Deep, generous proportions and premium high-resiliency foam make this sofa the heart of any living room — structured refinement with sink-in comfort."
      },
      {
        id: 3,
        name: "Sculptural Wooden Stool",
        category: "Seating",
        price: 129,
        tag: "New",
        image: "/images/product3.jpg",
        description:
          "Hand-finished solid wood stool with a sculptural silhouette. Doubles as a side table or extra seating when guests are over."
      },
      {
        id: 4,
        name: "Artistic Ceramic Vase",
        category: "Decor",
        price: 59,
        tag: "New",
        image: "/images/product4.jpg",
        description:
          "A small-batch, hand-thrown ceramic vase in a considered palette of violet and orchid. No two pieces are exactly alike."
      },
      {
        id: 5,
        name: "Earthy Lounge Sofa — Wide",
        category: "Seating",
        price: 1349,
        tag: "Featured",
        image: "/images/lounge-sofa.jpg",
        description:
          "The wide-body version of our signature lounge sofa. A perfect balance of structured refinement and sink-in comfort for larger living rooms."
      },
      {
        id: 6,
        name: "Raffia Bubble Pendant Light",
        category: "Lighting",
        price: 219,
        tag: null,
        image: "/images/lighting-cat.jpg",
        description:
          "A hand-woven raffia and glass pendant light that scatters warm, textured light across the room. Solid brass hardware included."
      },
      {
        id: 7,
        name: "Teak Outdoor Umbrella",
        category: "Outdoor",
        price: 149,
        tag: null,
        image: "/images/outdoor-cat.jpg",
        description:
          "Weather-resistant canvas paired with a powder-coated steel pole. Tilts and rotates so shade always lands where you need it."
      },
      {
        id: 8,
        name: "Boucle Swivel Armchair",
        category: "Seating",
        price: 429,
        tag: null,
        image: "/images/seating-cat.jpg",
        description:
          "A plush boucle-wrapped armchair on a solid swivel base. Compact enough for a reading nook, comfortable enough to live in."
      },
      {
        id: 9,
        name: "Live-Edge Coffee Table",
        category: "Tables",
        price: 379,
        tag: null,
        image: "/images/tables-cat.jpg",
        description:
          "A single slab of solid wood with a natural live edge, finished by hand. Every grain pattern is unique to the piece you receive."
      }
    ],
    users: [],
    orders: [],
    messages: []
  };
}

function load() {
  if (!fs.existsSync(DATA_FILE)) {
    save(defaultData());
  }
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  const data = JSON.parse(raw);

  // Backfill fields for anyone upgrading from an older data.json
  let changed = false;
  if (!data.messages) {
    data.messages = [];
    changed = true;
  }
  if (!data.nextMessageId) {
    data.nextMessageId = 1;
    changed = true;
  }
  if (changed) save(data);

  return data;
}

function save(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

// ---------- Products ----------
function getAllProducts() {
  return load().products;
}

function getProductById(id) {
  return load().products.find((p) => p.id === Number(id));
}

function getProductsByCategory(category) {
  const products = load().products;
  if (!category || category === "All") return products;
  return products.filter(
    (p) => p.category.toLowerCase() === category.toLowerCase()
  );
}

function getCategories() {
  const products = load().products;
  return [...new Set(products.map((p) => p.category))];
}

// ---------- Users ----------
function getUserByEmail(email) {
  return load().users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
}

function getUserById(id) {
  return load().users.find((u) => u.id === Number(id));
}

function createUser({ name, email, passwordHash }) {
  const data = load();
  const user = { id: data.nextUserId++, name, email, passwordHash };
  data.users.push(user);
  save(data);
  return user;
}

// ---------- Orders ----------
function createOrder({ userId, items, total, shipping }) {
  const data = load();
  const order = {
    id: data.nextOrderId++,
    userId,
    items,
    total,
    shipping,
    status: "Processing",
    createdAt: new Date().toISOString()
  };
  data.orders.push(order);
  save(data);
  return order;
}

function getOrderById(id) {
  return load().orders.find((o) => o.id === Number(id));
}

function getOrdersByUser(userId) {
  return load()
    .orders.filter((o) => o.userId === Number(userId))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

// ---------- Contact messages ----------
function createMessage({ name, email, message }) {
  const data = load();
  const record = {
    id: data.nextMessageId++,
    name,
    email,
    message,
    createdAt: new Date().toISOString()
  };
  data.messages.push(record);
  save(data);
  return record;
}

module.exports = {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  getCategories,
  getUserByEmail,
  getUserById,
  createUser,
  createOrder,
  getOrderById,
  getOrdersByUser,
  createMessage
};
