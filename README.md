# E-Commerce Platform (Trendyol Clone)

This project is a modern, full-stack e-commerce application developed for demonstration purposes. It focuses on core features like product browsing, category filtering, and shopping cart management, utilizing a clean and responsive design.

## 🛠️ Technologies Used

The application is built using a modern stack:

* **Frontend:** **HTML5**, **CSS3**, and **Vanilla JavaScript** (ES6+).
* **Backend:** **Node.js** with **Express.js** for handling API routes.
* **Database:** **MongoDB** for data persistence.
* **ODM:** **Mongoose** is used for Object Data Modeling.
* **File Uploads:** **Multer** is integrated for managing product images.

## ✨ Key Features

### Product Navigation and Filtering
* **Dynamic Category Listing:** Main categories like "Fashion" and "Technology" are fetched from the database and displayed on the homepage.
* **Subcategory Browsing:** Users can drill down from a main category to specific **subcategories** (e.g., "Laptop", "Tshirt").
* **Instant Search:** A search bar allows users to instantly **filter** products by title or brand within the current product view.
* **Product Details:** Clicking any product card opens a modal to display more information and the option to add it to the cart.

### E-commerce Core
* **Shopping Cart:** A fully functional, client-side shopping cart allows users to add items, view quantities, remove products, and see the calculated total.
* **RESTful API:** Robust backend endpoints are available to **Create, Read, Update, and Delete** (CRUD) products, as well as fetch categories and subcategories.

### Design and Utility
* **Infinite Slider:** An automatic carousel is featured on the homepage for "Top Seller" items.
* **Newsletter Subscription:** The footer includes a newsletter sign-up with basic email validation.

## 🚀 Getting Started

To run this project locally, follow these steps. You will need **Node.js** and a local instance of **MongoDB** running.

### Prerequisites

* Node.js (LTS recommended)
* MongoDB running locally on the default port (`mongodb://localhost:27017`).

### Installation and Run

1.  **Clone the repository:**
    ```bash
    git clone [YOUR_REPOSITORY_URL]
    cd [YOUR_PROJECT_FOLDER_NAME]
    ```

2.  **Install server dependencies:**
    *(Make sure you have a `package.json` file for `npm install` to work correctly.)*
    ```bash
    npm install 
    ```

3.  **Start the Server:**
    The server will connect to MongoDB and automatically **seed** the initial categories and subcategories if the database collections are empty.
    ```bash
    node server.mjs
    ```
    The application server will start on `http://localhost:3000`.

4.  **Access the Application:**
    Open the `index.html` file in your web browser. The frontend automatically connects to the API at `http://localhost:3000/server/main`.

## 📂 Project Structure

| File/Folder | Purpose |
| :--- | :--- |
| `index.html` | The main structure of the application (layout, slider, modals). |
| `app.js` | Client-side logic: slider control, API fetching, category/filtering logic, and cart management. |
| `modal.js` | JavaScript for opening and closing the About and Contact modals. |
| `server.mjs` | Server entry point: Express setup, MongoDB connection, and starting the server. |
| `comRouter.mjs` | API router for all product, category, and subcategory operations. |
| `seed.mjs` | Script for populating the database with initial categories (Fashion, Technology, Home). |
| `db/*.mjs` | MongoDB Schema definitions (Product, Category, SubCategory). |

## 🤝 Contribution

This project was developed by Pydko and THEPEHLIONE. We welcome contributions! If you have suggestions or want to report a bug, please open an issue or submit a pull request.
