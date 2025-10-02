# 🛒 E-Commerce Platform (Trendyol Clone)

This project is a modern, full-stack e-commerce application developed for demonstration purposes. It focuses on core features like product browsing, category filtering, and shopping cart management, utilizing a clean and responsive design.

---

## 🛠️ Technologies Used

The application is built using a modern stack:

- **Frontend:** HTML5, CSS3, and Vanilla JavaScript (ES6+).  
- **Backend:** Node.js with Express.js for handling API routes.  
- **Database:** MongoDB for data persistence.  
- **ODM:** Mongoose is used for Object Data Modeling.  
- **File Uploads:** Multer is integrated for managing product images.  

---

## ✨ Key Features

### Product Navigation and Filtering
- **Dynamic Category Listing:** Main categories like "Fashion" and "Technology" are fetched from the database and displayed on the homepage.  
- **Subcategory Browsing:** Users can drill down from a main category to specific subcategories (e.g., "Laptop", "Tshirt").  
- **Instant Search:** A search bar allows users to instantly filter products by title or brand within the current product view.  
- **Product Details:** Clicking any product card opens a modal to display more information and the option to add it to the cart.  

### E-commerce Core
- **Shopping Cart:** A fully functional, client-side shopping cart allows users to add items, view quantities, remove products, and see the calculated total.  
- **RESTful API:** Robust backend endpoints are available to Create, Read, Update, and Delete (CRUD) products, as well as fetch categories and subcategories.  

### Design and Utility
- **Infinite Slider:** An automatic carousel is featured on the homepage for "Top Seller" items.  
- **Newsletter Subscription:** The footer includes a newsletter sign-up with basic email validation.  

---

## 🚀 Getting Started

To run this project locally, follow these steps. You will need Node.js and a local instance of MongoDB running.  

### Prerequisites
- Node.js (LTS recommended)  
- MongoDB running locally on the default port (`mongodb://localhost:27017`)  

### Installation and Run

This project was developed by:

Pydko → Backend development (API, database, server logic).

THEPEHLIONE → Frontend development (UI, design, client-side logic).

We welcome contributions! If you have suggestions or want to report a bug, please open an issue or submit a pull request.

```bash

# Install server dependencies
npm i express
npm i -D nodemon
npm install mongoose
npm install cors
npm install multer


# Start the server (seeds DB if empty)
node server.mjs

