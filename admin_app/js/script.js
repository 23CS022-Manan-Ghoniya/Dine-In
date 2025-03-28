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
        if (selectedTable && currentOrders[selectedTable]) { // Check if there's an order for the selected table
            displayBill(selectedTable, currentOrders[selectedTable]);
        } else {
            billTableNumber.textContent = selectedTable || 'N/A';
            billItemsList.innerHTML = '<li>No order found for this table.</li>';
            billTotalAmount.textContent = '0';
            billDisplay.style.display = 'block';
        }
    });

    function displayBill(tableNumber, orderItems) {
        billTableNumber.textContent = tableNumber;
        billItemsList.innerHTML = '';
        let total = 0;

        orderItems.forEach(orderItem => {
            const menuItem = menuForBilling.find(item => item.id === orderItem.id);
            if (menuItem) {
                const itemTotal = menuItem.price * (orderItem.quantity || 1); // Default quantity to 1 if not provided
                const listItem = document.createElement('li');
                listItem.textContent = `${menuItem.name} (x${orderItem.quantity || 1}) - ₹${itemTotal}`;
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
                detailItem.textContent = `${menuItem.name} (x${item.quantity || 1})`;
                orderDetails.appendChild(detailItem);
            }
        });
        listItem.appendChild(orderDetails);
        newOrdersList.appendChild(listItem);
        if (newOrdersList.children[0] && newOrdersList.children[0].textContent === 'No new orders yet.') {
            newOrdersList.innerHTML = '';
        }
    }

    // Listen for messages from the customer app
    window.addEventListener('message', function(event) {
        if (event.data && event.data.type === 'newOrder') {
            const { tableNumber, order } = event.data;
            receiveNewOrder(tableNumber, order);
        } else if (event.source && event.origin === window.location.origin) {
            event.source.postMessage({ type: 'adminReady' }, event.origin);
        }
    });

    // Expose the receiveNewOrder function globally
    window.receiveCustomerOrder = receiveNewOrder;

    // Initial state: disable Generate Bill button
    generateBillBtn.disabled = true;

});