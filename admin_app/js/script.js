document.addEventListener('DOMContentLoaded', function() {
    const tableSelector = document.getElementById('table-selector');
    const generateBillBtn = document.getElementById('generate-bill-btn');
    const billDisplay = document.getElementById('bill-display');
    const billTableNumber = document.getElementById('bill-table-number');
    const billItemsList = document.getElementById('bill-items');
    const billTotalAmount = document.getElementById('bill-total-amount');
    const newOrdersList = document.getElementById('new-orders-list');

    let currentOrders = {}; // To store simulated orders (Table No: [items])
    const menuForBilling = [ // Sample menu for billing
        { id: 1, name: "Dal Tadka", price: 120 },
        { id: 2, name: "Paneer Butter Masala", price: 180 },
        { id: 3, name: "Vegetable Biryani", price: 150 },
        { id: 4, name: "Aloo Gobi", price: 130 },
        { id: 5, name: "Baingan Bharta", price: 140 },
        { id: 6, name: "Roti (2 pcs)", price: 30 },
        { id: 7, name: "Naan", price: 40 },
        { id: 8, name: "Jeera Rice", price: 80 },
        { id: 9, name: "Plain Rice", price: 70 },
        { id: 10, name: "Masala Papad", price: 50 },
        { id: 11, name: "Veg Samosa (2 pcs)", price: 60 },
        { id: 12, name: "Dhokla", price: 70 },
        { id: 13, name: "Khandvi", price: 80 },
        { id: 14, name: "Thepla (2 pcs)", price: 60 },
        { id: 15, name: "Undhiyu", price: 160 },
        { id: 16, name: "Shrikhand", price: 90 },
        { id: 17, name: "Gulab Jamun (2 pcs)", price: 80 },
        { id: 18, name: "Lassi", price: 70 },
        { id: 19, name: "Masala Chai", price: 40 }
    ];

    // Enable Generate Bill button when a table is selected
    tableSelector.addEventListener('change', function() {
        generateBillBtn.disabled = !this.value;
        billDisplay.style.display = 'none'; // Hide previous bill
    });

    // Handle Generate Bill button click
    generateBillBtn.addEventListener('click', function() {
        const selectedTable = tableSelector.value;
        if (selectedTable) {
            // In a real scenario, you would fetch the order for this table from a database
            // For this simulation, we'll use a placeholder or assume we have some way to know the order

            // **SIMULATED ORDER DATA - Replace with actual logic if you had a backend**
            const simulatedOrderForTable = currentOrders[selectedTable] || [
                { id: 1, quantity: 1 }, // Example: Table ordered 1 Dal Tadka
                { id: 3, quantity: 2 }  // Example: Table ordered 2 Vegetable Biryani
            ];

            displayBill(selectedTable, simulatedOrderForTable);
        }
    });

    function displayBill(tableNumber, orderItems) {
        billTableNumber.textContent = tableNumber;
        billItemsList.innerHTML = '';
        let total = 0;

        orderItems.forEach(orderItem => {
            const menuItem = menuForBilling.find(item => item.id === orderItem.id);
            if (menuItem) {
                const itemTotal = menuItem.price * orderItem.quantity;
                const listItem = document.createElement('li');
                listItem.textContent = `${menuItem.name} (x${orderItem.quantity}) - ₹${itemTotal}`;
                billItemsList.appendChild(listItem);
                total += itemTotal;
            }
        });

        billTotalAmount.textContent = total;
        billDisplay.style.display = 'block';
    }

    // Function to simulate receiving a new order from a table
    function receiveNewOrder(tableNumber, order) {
        currentOrders[tableNumber] = order;
        const listItem = document.createElement('li');
        listItem.textContent = `New order for Table ${tableNumber}`;
        const orderDetails = document.createElement('ul');
        order.forEach(item => {
            const menuItem = menuForBilling.find(m => m.id === item.id);
            if (menuItem) {
                const detailItem = document.createElement('li');
                detailItem.textContent = `${menuItem.name} (x${item.quantity})`;
                orderDetails.appendChild(detailItem);
            }
        });
        listItem.appendChild(orderDetails);
        newOrdersList.appendChild(listItem);
        // Optionally, clear the "No new orders yet" message
        if (newOrdersList.children[0] && newOrdersList.children[0].textContent === 'No new orders yet.') {
            newOrdersList.innerHTML = '';
        }
    }

    // **SIMULATE A NEW ORDER ARRIVING (for testing)**
    // In a real app, this would be triggered by a server event
    setTimeout(() => {
        receiveNewOrder('3', [{ id: 2, quantity: 1 }, { id: 6, quantity: 2 }]);
    }, 3000); // Simulate an order after 3 seconds

    // Initial state: disable Generate Bill button
    generateBillBtn.disabled = true;

    // Let's try to simulate sending the cart data to the admin when "View Bill & Pay" is clicked on the customer side
    window.receiveCustomerOrder = function(tableNumber, orderData) {
        receiveNewOrder(tableNumber, orderData.map(item => ({ id: item.id, quantity: 1 })));
    };

});