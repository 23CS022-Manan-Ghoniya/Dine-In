const express = require('express');
const path = require('path');
const app = express();

// 1) Parse JSON and URL-encoded payloads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2) Security middleware to block access to server.js itself
app.use((req, res, next) => {
  const forbiddenFiles = ['server.js'];
  if (forbiddenFiles.some(file => req.url.endsWith(file))) {
    return res.status(404).send('Not Found');
  }
  next();
});

// 3) Serve ALL static files from the current directory
//    This means index.html, breakfast.html, style.css, etc. remain accessible
app.use(express.static(__dirname));

// 4) In-memory orders storage (replace with DB for production)
let orders = [];

// 5) API endpoint to submit an order
app.post('/api/orders', (req, res) => {
  const order = req.body;
  order.id = Date.now(); // a quick unique ID
  orders.push(order);
  res.status(201).json({ success: true, order });
});

// 6) Admin page to view orders
app.get('/admin', (req, res) => {
    let html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Admin Dashboard - Orders</title>
          <!-- Link to your main stylesheet -->
          <link rel="stylesheet" href="project-styles.css">
        </head>
        <body>
          <!-- Example navigation (adjust to match your site's nav) -->
          <nav class="navbar">
            <a href="index.html">Home</a>
            <a href="menu.html">Menu</a>
            <a href="cart.html">Cart</a>
            <!-- Highlight or style the Admin link differently -->
            <a href="#" class="active">Admin</a>
          </nav>
  
          <div class="admin-container">
            <h1>Orders Overview</h1>
    `;
  
    if (orders.length === 0) {
      html += `<p>No orders have been placed yet.</p>`;
    } else {
      html += `
        <table class="admin-orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Items</th>
              <th>Total Amount</th>
              <th>Billing Method</th>
            </tr>
          </thead>
          <tbody>
      `;
      orders.forEach(order => {
        html += `
          <tr>
            <td>${order.id}</td>
            <td>${order.items ? JSON.stringify(order.items) : 'N/A'}</td>
            <td>${order.totalAmount || 'N/A'}</td>
            <td>${order.billingMethod || 'N/A'}</td>
          </tr>
        `;
      });
      html += `
          </tbody>
        </table>
      `;
    }
  
    // Close out the HTML
    html += `
          </div>
        </body>
      </html>
    `;
    res.send(html);
  });
  

// 7) Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
