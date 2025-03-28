document.addEventListener('DOMContentLoaded', function() {
    const tableNumberSpan = document.getElementById('table-number');
    const menuItemsDiv = document.querySelector('.menu-items');
    const orderList = document.getElementById('order-list');
    const orderTotalSpan = document.getElementById('order-total');
    const viewBillBtn = document.getElementById('view-bill-btn');
    const paymentModal = document.getElementById('payment-modal');
    const closeButton = paymentModal.querySelector('.close-button');
    const cashBtn = document.getElementById('cash-btn');
    const cardBtn = document.getElementById('card-btn');
    const onlinePaymentInfo = document.getElementById('online-payment-info');
    const payOnlineBtn = document.getElementById('pay-online-btn');
    const phoneNumberInput = document.getElementById('phone-number');
    const billSentMessage = document.getElementById('bill-sent-message');

    let order = [];
    let total = 0;

    // Function to extract table number from URL
    function getTableNumber() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('table');
    }

    // Display table number
    const tableNumber = getTableNumber();
    if (tableNumber) {
        tableNumberSpan.textContent = tableNumber;
    } else {
        tableNumberSpan.textContent = 'N/A';
    }

    // Sample menu data (same as before)
    const menuItemsData = [
        { name: "Dal Tadka", category: "Main Course", price: 120 },
        { name: "Paneer Butter Masala", category: "Main Course", price: 180 },
        { name: "Vegetable Biryani", category: "Main Course", price: 150 },
        { name: "Aloo Gobi", category: "Main Course", price: 130 },
        { name: "Baingan Bharta", category: "Main Course", price: 140 },
        { name: "Roti (2 pcs)", category: "Bread", price: 30 },
        { name: "Naan", category: "Bread", price: 40 },
        { name: "Jeera Rice", category: "Rice", price: 80 },
        { name: "Plain Rice", category: "Rice", price: 70 },
        { name: "Masala Papad", category: "Appetizer", price: 50 },
        { name: "Veg Samosa (2 pcs)", category: "Appetizer", price: 60 },
        { name: "Dhokla", category: "Gujarati", price: 70 },
        { name: "Khandvi", category: "Gujarati", price: 80 },
        { name: "Thepla (2 pcs)", category: "Gujarati", price: 60 },
        { name: "Undhiyu", category: "Gujarati", price: 160 },
        { name: "Shrikhand", category: "Dessert", price: 90 },
        { name: "Gulab Jamun (2 pcs)", category: "Dessert", price: 80 },
        { name: "Lassi", category: "Beverage", price: 70 },
        { name: "Masala Chai", category: "Beverage", price: 40 }
    ];

    // Function to display the menu
    function displayMenu() {
        menuItemsData.forEach(item => {
            const menuItemDiv = document.createElement('div');
            menuItemDiv.classList.add('menu-item');
            menuItemDiv.innerHTML = `
                <h3>${item.name}</h3>
                <p class="price">₹${item.price}</p>
                <button class="add-to-order" data-name="${item.name}" data-price="${item.price}">Add to Order</button>
            `;
            menuItemsDiv.appendChild(menuItemDiv);
        });
    }

    // Function to update the order
    function updateOrder() {
        orderList.innerHTML = '';
        total = 0;
        order.forEach(item => {
            const listItem = document.createElement('li');
            listItem.textContent = `${item.name} - ₹${item.price}`;
            orderList.appendChild(listItem);
            total += item.price;
        });
        orderTotalSpan.textContent = total;
        viewBillBtn.disabled = order.length === 0;
    }

    // Event listener for adding to order
    menuItemsDiv.addEventListener('click', function(event) {
        if (event.target.classList.contains('add-to-order')) {
            const itemName = event.target.dataset.name;
            const itemPrice = parseFloat(event.target.dataset.price);
            order.push({ name: itemName, price: itemPrice });
            updateOrder();
        }
    });

    // Event listener for viewing the bill
    viewBillBtn.addEventListener('click', function() {
        paymentModal.style.display = 'block';
        onlinePaymentInfo.style.display = 'none';
        billSentMessage.style.display = 'none';
        phoneNumberInput.value = ''; // Clear previous input
    });

    // Event listener for closing the modal
    closeButton.addEventListener('click', function() {
        paymentModal.style.display = 'none';
    });

    // Event listener for paying by card/UPI
    cardBtn.addEventListener('click', function() {
        onlinePaymentInfo.style.display = 'block';
    });

    // Event listener for proceeding to online payment (conceptual)
    payOnlineBtn.addEventListener('click', function() {
        const phoneNumber = phoneNumberInput.value;
        if (phoneNumber) {
            alert(`Initiating online payment for ₹${total} (conceptual).\nPhone number: ${phoneNumber}`);
            // In a real application, you would redirect to a payment gateway here.
            // Steps for UPI integration would involve:
            // 1. Choosing a Payment Gateway that supports UPI (e.g., Razorpay, PayU).
            // 2. Setting up an account with the gateway and obtaining API keys.
            // 3. Using their SDK or APIs to initiate a payment request with the total amount.
            // 4. Handling the payment response (success, failure, etc.).
            // 5. You might need server-side logic to securely handle transactions.
        } else {
            alert('Please enter your phone number to proceed with online payment.');
        }
    });

    // Event listener for paying by cash (conceptual WhatsApp bill)
    cashBtn.addEventListener('click', function() {
        const phoneNumber = phoneNumberInput.value;
        if (phoneNumber) {
            alert(`Cash payment selected. A copy of the bill will be sent to ${phoneNumber} via WhatsApp (conceptual).`);
            billSentMessage.style.display = 'block';
            // Conceptual WhatsApp Integration:
            // 1. WhatsApp does not have a direct API for sending messages from a web app for free.
            // 2. Businesses often use the WhatsApp Business API, which can involve costs and a more complex setup.
            // 3. For a simple academic project, you could:
            //    - Log the bill details and phone number for manual sending.
            //    - Explore third-party services that might offer limited free WhatsApp messaging capabilities (use with caution regarding privacy and terms of service).
            //    - The actual integration would likely involve server-side code to interact with such APIs.
        } else {
            alert('Please enter your phone number to send the bill via WhatsApp (conceptual).');
        }
    });

    // Close modal if user clicks outside
    window.addEventListener('click', function(event) {
        if (event.target == paymentModal) {
            paymentModal.style.display = 'none';
        }
    });

    displayMenu();
});