const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const port = 3000;

app.use(cors()); // Enable CORS for all origins BEFORE defining routes
app.use(bodyParser.json());

// --- Email Configuration ---
// Replace these with your actual email service provider details
const transporter = nodemailer.createTransport({
    service: 'your_email_service_provider', // e.g., 'Gmail', 'Outlook'
    auth: {
        user: 'your_email@example.com',
        pass: 'your_email_password'
    }
});

// Endpoint to receive new orders and send email to customer
app.post('/api/orders', async (req, res) => {
    const { tableNumber, order, phoneNumber, email } = req.body; // Expecting email now
    console.log(`Received new order for Table ${tableNumber}:`, order, `Phone: ${phoneNumber}, Email: ${email}`);

    // In a real application, you would save this order to a database here

    // --- Construct the email content ---
    let orderDetails = '<h2>Order Details:</h2><ul>';
    let totalAmount = 0;
    order.forEach(item => {
        orderDetails += `<li>${item.name} (₹${item.price})</li>`;
        totalAmount += item.price;
    });
    orderDetails += `</ul><p>Total Amount: ₹${totalAmount}</p><p>Phone Number: ${phoneNumber}</p><p>Table Number: ${tableNumber}</p>`;

    const mailOptions = {
        from: 'your_email@example.com',
        to: email, // Send to the customer's email address
        subject: `Your Order from Our Vegetarian Restaurant - Table ${tableNumber}`,
        html: `<h1>Your Order Details for Table ${tableNumber}</h1>${orderDetails}`
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent to customer:', info.messageId);
        res.status(200).json({ message: `Order received successfully! A copy of your bill has been sent to ${email}` });
    } catch (error) {
        console.error('Error sending email to customer:', error);
        res.status(500).json({ message: 'Order received, but there was an error sending the bill via email. Please contact the restaurant.' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
});