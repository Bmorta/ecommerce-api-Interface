# E-Commerce API with Web Interface

A simple e-commerce product management application built for the **MSTCONNECT PH Full-Stack Web Development Bootcamp – Capstone 2**.

This project combines a **REST API** built with Node.js, Express.js, MongoDB, and Mongoose with a clean and simple browser interface for managing products.

The application supports product CRUD operations, searching, category filtering, and product management through the web interface.

---

## 📸 Interface Preview

### Home

The Home page displays the available products with their name, category, price, stock, and a shared product image.

<img src="images/Home.png" alt="Home Page" width="800">

---

### Add Product

The Add Product interface allows users to create a new product by entering the required product information.

<img src="images/Add.png" alt="Add Product" width="800">

---

### Update Product

The Update Product interface allows users to modify existing product information.

<img src="images/Update.png" alt="Update Product" width="800">

---

### Delete Product

Products can be deleted through the interface with a confirmation step before the deletion is completed.

<img src="images/Delete.png" alt="Delete Product" width="800">

---

## 🚀 Features

### Product Management

- Add new products
- View all products
- View individual products
- Update existing products
- Delete products
- Display product price and stock
- Shared product image displayed on all product cards

### Search and Filtering

- Search products by name
- Filter products by category
- Case-insensitive product search
- Display all products when no filters are applied

### REST API

The application provides the following REST API endpoints:

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/products` | Get all products |
| POST | `/api/products` | Create a new product |
| GET | `/api/products/:id` | Get a product by ID |
| PATCH | `/api/products/:id` | Update a product |
| DELETE | `/api/products/:id` | Delete a product |

### Validation and Error Handling

The API handles:

- Missing required fields
- Negative prices
- Negative stock values
- Invalid MongoDB IDs
- Products that do not exist
- MongoDB/Mongoose validation errors
- Server errors

---

## 🛠️ Technologies Used

### Frontend

- HTML5
- CSS3
- JavaScript

### Backend

- Node.js
- Express.js
- REST API

### Database

- MongoDB
- Mongoose

### Development Tools

- Visual Studio Code
- Postman
- Git
- GitHub
- Nodemon

---

## 📁 Project Structure

```text
ecommerce-api-Interface/
│
├── images/
│   ├── Home.png
│   ├── Add.png
│   ├── Update.png
│   └── Delete.png
│
├── public/
│   ├── images/
│   │   └── Cover.jpg
│   │
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── postman/
│   └── MSTCONNECT-Capstone-2-API.postman_collection.json
│
├── src/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   └── productController.js
│   │
│   ├── middleware/
│   │   └── errorHandler.js
│   │
│   ├── models/
│   │   └── Product.js
│   │
│   ├── routes/
│   │   └── productRoutes.js
│   │
│   └── server.js
│
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md