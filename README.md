# MA SPACE

MA SPACE is a full-stack furniture e-commerce website built with Node.js, Express, EJS, HTML, CSS and JavaScript. It demonstrates user authentication, shopping cart functionality, responsive design and reusable UI components.

The project includes user authentication, product browsing, shopping cart functionality, checkout, and order management.

---

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Node.js
- Express.js
- EJS Template Engine
- JSON File Database

---

## Features

### User
- Registration & Login
- Browse Products 
- Shopping Cart
- Checkout System
- Order History
- Contact Page

### General
- Responsive Layout
- Category Navigation
- Search

---

## Project Structure

```
MA-SPACE
│
├── server.js
├── package.json
├── db.js
├── auth-middleware.js
├── routes/
├── views/
├── partials/
├── public/
│   ├── css/
│   ├── js/
│   └── images/
└── data/

---

## Installation

Install dependencies

```bash
git clone <repository>

cd ma-space-final

npm install

npm start

Open your browser and go to
http://localhost:3000
```

---

## Main Pages

- Home
- Shop
- Product
- Cart
- Checkout
- Login
- Register
- Account
- About
- Contact
- Blog
- Terms

---

## What's in this folder

| File(s) | What it is |
|---|---|
| `server.js` | App entry point — Express setup, the EJS-on-`.html` engine, routes |
| `db.js` | The "database": reads/writes `data.json`, seeds sample products |
| `data.json` | Auto-created on first run (products/users/orders/contact messages) |
| `auth-middleware.js` | Guards pages that require login; exposes cart count + logged-in user to every page |
| `product-routes.js` | Home page, shop listing, product detail page |
| `cart-routes.js` | Add / update / remove cart items |
| `auth-routes.js` | Register, login, logout |
| `order-routes.js` | Checkout, order confirmation, account/order history |
| `pages-routes.js` | About, Blog, Terms, Contact |
| `header.html`, `footer.html` | Included on every page |
| `index.html`, `shop.html`, `product.html`, `cart.html`, `checkout.html`, `order-confirmation.html`, `account.html`, `login.html`, `register.html`, `about.html`, `blog.html`, `terms.html`, `contact.html`, `404.html` | One template per page |
| `style.css` | Your original stylesheet, plus additions for the newer pages |
| `script.js` | Search-dropdown behavior (header/footer no longer need JS to load) |
| `logo.png`, `Hero.jpg`, `arrivals-hero.jpg` | Site logo + hero banner images |
| `product1.jpg` ... `tables-cat.jpg` | Sample product photos |

## Pages included

| Page | Route | Notes |
|---|---|---|
| Home | `/` | New arrivals, promo banner, categories |
| Shop | `/shop`, `/shop?category=Lighting` | Full catalog with category filter pills |
| Product detail | `/product/:id` | Add-to-cart with quantity, related products |
| Cart | `/cart` | Update quantities, remove items |
| Checkout | `/checkout` | Requires login; collects shipping address |
| Order confirmation | `/order-confirmation/:id` | Shown right after placing an order |
| Register | `/register` | Creates an account (password hashed with bcrypt) |
| Login | `/login` | Signs in, remembers where you were headed |
| Account | `/account` | Shows your past orders |
| About | `/about` | Brand story |
| Journal / Blog | `/blog` | Sample posts (static for now — swap in real content whenever you're ready) |
| Terms & Conditions | `/terms` | Standard boilerplate — have a lawyer review before going live |
| Contact | `/contact` | Working form; submissions are saved to `data.json` |
| 404 | anything unmatched | Friendly "page not found" |

---

## Future Improvements

- Stripe Payment Integration
- Admin Dashboard
- Product Search
- Category Filtering
- Wishlist
- Product Reviews
- Inventory Management
- Email Verification