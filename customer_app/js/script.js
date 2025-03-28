document.addEventListener('DOMContentLoaded', function() {
    const tableNumberSpan = document.getElementById('table-number');
    const menuItemsDiv = document.querySelector('.menu-items');
    const cartItemsList = document.getElementById('cart-items');
    const cartTotalSpan = document.getElementById('cart-total');
    const viewBillBtn = document.getElementById('view-bill-btn');
    const paymentModal = document.getElementById('payment-modal');
    const closeButton = paymentModal.querySelector('.close-button');
    const cashBtn = document.getElementById('cash-btn');
    const cardBtn = document.getElementById('card-btn');
    const onlinePaymentInfo = document.getElementById('online-payment-info');
    const payOnlineBtn = document.getElementById('pay-online-btn');
    const phoneNumberInput = document.getElementById('phone-number');
    const billSentMessage = document.getElementById('bill-sent-message');

    let cart = [];
    let cartTotal = 0;

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

    // Sample menu data
    const menuItemsData = [
        { id: 1, name: "Dal Tadka", category: "Main Course", price: 120 },
        { id: 2, name: "Paneer Butter Masala", category: "Main Course", price: 180 },
        { id: 3, name: "Vegetable Biryani", category: "Main Course", price: 150 },
        { id: 4, name: "Aloo Gobi", category: "Main Course", price: 130 },
        { id: 5, name: "Baingan Bharta", category: "Main Course", price: 140 },
        { id: 6, name: "Roti (2 pcs)", category: "Bread", price: 30 },
        { id: 7, name: "Naan", category: "Bread", price: 40 },
        { id: 8, name: "Jeera Rice", category: "Rice", price: 80 },
        { id: 9, name: "Plain Rice", category: "Rice", price: 70 },
        { id: 10, name: "Masala Papad", category: "Appetizer", price: 50 },
        { id: 11, name: "Veg Samosa (2 pcs)", category: "Appetizer", price: 60 },
        { id: 12, name: "Dhokla", category: "Gujarati", price: 70 },
        { id: 13, name: "Khandvi", category: "Gujarati", price: 80 },
        { id: 14, name: "Thepla (2 pcs)", category: "Gujarati", price: 60 },
        { id: 15, name: "Undhiyu", category: "Gujarati", price: 160 },
        { id: 16, name: "Shrikhand", category: "Dessert", price: 90 },
        { id: 17, name: "Gulab Jamun (2 pcs)", category: "Dessert", price: 80 },
        { id: 18, name: "Lassi", category: "Beverage", price: 70 },
        { id: 19, name: "Masala Chai", category: "Beverage", price: 40 }
    ];

    // Function to display the menu
    function displayMenu() {
        menuItemsData.forEach(item => {
            const menuItemDiv = document.createElement('div');
            menuItemDiv.classList.add('menu-item');
            menuItemDiv.innerHTML = `
                <h3>${item.name}</h3>
                <p class="price">₹${item.price}</p>
                <button class="add-to-cart" data-id="${item.id}" data-name="${item.name}" data-price="${item.price}">Add to Cart</button>
            `;
            menuItemsDiv.appendChild(menuItemDiv);
        });
    }

    // Function to update the cart display
    function updateCartDisplay() {
        cartItemsList.innerHTML = '';
        cartTotal = 0;
        const itemCounts = {};
        cart.forEach(item => {
            itemCounts[item.id] = (itemCounts[item.id] || 0) + 1;
            cartTotal += item.price;
        });

        for (const itemId in itemCounts) {
            const item = menuItemsData.find(i => i.id === parseInt(itemId));
            const quantity = itemCounts[itemId];
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <div class="cart-item-details">${item.name} (x${quantity}) - ₹${item.price * quantity}</div>
                <div class="cart-item-actions">
                    <button class="remove-from-cart" data-id="${itemId}">Remove</button>
                </div>
            `;
            cartItemsList.appendChild(listItem);
        }

        cartTotalSpan.textContent = cartTotal;
        viewBillBtn.disabled = cart.length === 0;
    }

    // Event listener for adding to cart
    menuItemsDiv.addEventListener('click', function(event) {
        if (event.target.classList.contains('add-to-cart')) {
            const itemId = parseInt(event.target.dataset.id);
            const itemName = event.target.dataset.name;
            const itemPrice = parseFloat(event.target.dataset.price);
            cart.push({ id: itemId, name: itemName, price: itemPrice });
            updateCartDisplay();
        }
    });

    // Event listener for removing from cart
    cartItemsList.addEventListener('click', function(event) {
        if (event.target.classList.contains('remove-from-cart')) {
            const itemIdToRemove = parseInt(event.target.dataset.id);
            const indexToRemove = cart.findIndex(item => item.id === itemIdToRemove);
            if (indexToRemove !== -1) {
                cart.splice(indexToRemove, 1);
                updateCartDisplay();
            }
        }
    });

    // Event listener for viewing the bill
    viewBillBtn.addEventListener('click', function() {
        paymentModal.style.display = 'block';
        onlinePaymentInfo.style.display = 'none';
        billSentMessage.style.display = 'none';
        phoneNumberInput.value = ''; // Clear previous input
        console.log("Simulated order for admin:", cart); // Log the cart for now

        const table = getTableNumber();
        const orderToSend = cart.map(item => ({ id: item.id, name: item.name, price: item.price }));
        if (window.opener && !window.opener.closed && typeof window.opener.receiveCustomerOrder === 'function') {
            window.opener.receiveCustomerOrder(table, orderToSend);
            console.log(`(Simulated send to popup) Order for Table ${table}:`, orderToSend);
        } else {
            window.postMessage({ type: 'newOrder', tableNumber: table, order: orderToSend }, '*');
            console.log(`(Simulated send via message) Order for Table ${table}:`, orderToSend);
        }
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
            alert(`Initiating online payment for ₹${cartTotal} (conceptual).\nPhone number: ${phoneNumber}`);
            // In a real application, you would redirect to a payment gateway here.
        } else {
            alert('Please enter your phone number to proceed with online payment.');
        }
    });

    // Event listener for paying by cash (send order to backend with phone number)
    // Event listener for paying by cash (send order to backend with phone number and email)
    cashBtn.addEventListener('click', function() {
        const phoneNumber = phoneNumberInput.value;
        const emailAddress = document.getElementById('email-address').value; // Get the email address
        if (phoneNumber && emailAddress) {
            const tableNumber = getTableNumber();
            const orderToSend = cart.map(item => ({ id: item.id, name: item.name, price: item.price }));

            fetch('http://localhost:3000/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ tableNumber: tableNumber, order: orderToSend, phoneNumber: phoneNumber, email: emailAddress }) // Send the email
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                alert(`Cash payment selected. Order submitted and bill sent to ${emailAddress}! (Backend says: ${data.message})`);
                billSentMessage.style.display = 'block';
                cart = [];
                updateCartDisplay();
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('There was an error submitting your order. Please try again.');
            });
        } else {
            alert('Please enter both your phone number and email address to submit your order.');
        }
    });

    // Close modal if user clicks outside
    window.addEventListener('click', function(event) {
        if (event.target == paymentModal) {
            paymentModal.style.display = 'none';
        }
    });

    displayMenu();
    updateCartDisplay();

    let adminWindow = window.open('../admin_app/index.html', 'adminWindow');
    window.openAdminWindow = adminWindow;
    window.addEventListener('message', function(event) {
        if (event.data && event.data.type === 'adminReady' && adminWindow && !adminWindow.closed) {
            const table = getTableNumber();
            const orderToSend = cart.map(item => ({ id: item.id }));
            adminWindow.postMessage({ type: 'newOrder', tableNumber: table, order: orderToSend }, '*');
            console.log(`(Simulated send via message) Order for Table ${table}:`, orderToSend);
        }
    });
});