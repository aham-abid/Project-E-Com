# 🛒 Climax Online Shop (Local Storage Edition)

## Project Overview

This is a simple, single-page web application for an online shop, designed primarily for viewing products, adding items to a cart, and placing orders via WhatsApp. All data (products, cart, language preference) is stored directly in the user's **browser Local Storage**, making it a client-side application that does not require a database or backend server.

The application supports both Bengali and English interfaces and includes a robust Admin Panel for product management.

## 🛠️ Key Features

* **Product Catalog:** Displays products with images, names (Bengali/English), prices, and minimum quantity requirements.
* **Dynamic Filtering:** Products can be filtered by category pills and searched using keywords (including simple transliteration support).
* **Client-Side Persistence:** Products and cart data are saved in `localStorage`.
* **Shopping Cart:** Users can add/remove items and adjust quantities. **Note:** Quantity adjustment respects the minimum quantity (`min_qty`) set for each product.
* **WhatsApp Ordering:** Generates a pre-filled WhatsApp message with the order details (including a custom note/address) for quick communication with the seller.
* **Admin Panel:** Secure panel for adding, editing, and removing products.
* **Theming:** Supports light and dark mode toggling.
* **Localization:** Supports Bengali (`bn`) and English (`en`) language switching.

---

## 🚀 Getting Started

This project is entirely front-end. No installation or server is required.

1.  **Download:** Download all project files (`index.html`, `style.css`, `script.js`, etc.).
2.  **Run:** Open the `index.html` file directly in any modern web browser (Chrome, Firefox, Edge, etc.).

---

## 🔑 Admin Panel Access

The Admin Panel is a hidden feature used for managing the product list.

### How to Access

1.  While on the shop's main page, press the keyboard shortcut: **`Ctrl + A`** (Windows/Linux) or **`Cmd + A`** (Mac).
2.  You will be prompted for a Username and Password.

| Field | Value |
| :--- | :--- |
| **Username** | `Climax&Trade` |
| **Password** | `Climax&tradetrust` |

Once logged in, the Admin Panel will appear on the screen, allowing you to **Add**, **Edit**, or **Remove** products.

---

## ⚙️ Recent Updates & Fix (v1.1)

### Fixed: Local Storage Product Limit

The previous version of the application would silently fail to save new products after reaching approximately 5-10 products (depending on image size). This was due to hitting the browser's **Local Storage Size Limit** (typically 5-10MB), especially when saving product images as **Data URLs**.

The `script.js` has been updated to include robust error handling:

* The `saveAll()` function now uses a **`try...catch`** block to monitor for a `QuotaExceededError`.
* If the save operation fails due to the storage limit, an **alert message** is displayed to the administrator.
* The newly added product is immediately **removed from the product list** if the save operation fails, ensuring the displayed product grid accurately reflects the successfully saved state.

**Recommendation:** To prevent this error, use smaller product images (under 500KB) when adding products to the admin panel.
