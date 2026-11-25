# WarrantyCare — DBMS Frontend Prototype

A responsive HTML/CSS/JavaScript frontend for the Product Warranty & Repair History Management System.

## Run
1. Extract the ZIP.
2. Open `index.html` in Chrome, Edge, or Firefox.
3. Use the left navigation to explore Dashboard, Customers, Products, Registrations, Warranty Claims, Repair History, and Reports.

## Included
- Responsive admin dashboard
- Demo records for all modules
- Add, edit, delete, and search records
- Browser `localStorage` persistence
- Demo reports and status indicators

## Important DBMS note
This is a frontend prototype. It currently stores demo changes in the browser's localStorage; it is not connected to MySQL. To make it a full DBMS application, connect these screens to a backend (Node.js/Express or Python FastAPI) and the existing MySQL `warranty_repair_db` schema. The frontend field names are illustrative and will need mapping to the SQL table columns.

The project schema has seven tables: customers, products, product_registrations, service_centres, warranty_claims, repair_records, and repair_parts.
