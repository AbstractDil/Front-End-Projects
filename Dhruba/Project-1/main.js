const shipmentForm = document.getElementById('shipmentForm');
const trackingNumberInput = document.getElementById('trackingNumber');
const carrierInput = document.getElementById('carrier');
const expectedDateInput = document.getElementById('expectedDate');
const shipmentList = document.getElementById('shipmentList');
let shipments = JSON.parse(localStorage.getItem('shipments')) || [];

// Function to save shipments to localStorage
function saveShipments() {
    localStorage.setItem('shipments', JSON.stringify(shipments));
}

// Load and render shipments on page load
function renderShipments() {
    shipmentList.innerHTML = '';
    shipments.forEach((shipment, index) => {
        const li = document.createElement('li');
        const statusClass = `status status-${shipment.status.toLowerCase()}`;
        li.innerHTML = `
            <div class="shipment-info">
                <strong>Tracking: ${shipment.trackingNumber}</strong><br>
                Carrier: ${shipment.carrier}<br>
                Expected: ${shipment.expectedDate}<br>
                <span class="${statusClass}">${shipment.status}</span>
            </div>
            <div>
                <select class="update-btn" onchange="updateStatus(${index}, this.value)">
                    <option value="Pending" ${shipment.status === 'Pending' ? 'selected' : ''}>Pending</option>
                    <option value="Shipped" ${shipment.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
                    <option value="Delivered" ${shipment.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                    <option value="Delayed" ${shipment.status === 'Delayed' ? 'selected' : ''}>Delayed</option>
                </select>
                <button class="delete-btn" onclick="deleteShipment(${index})">Delete</button>
            </div>
        `;
        shipmentList.appendChild(li);
    });
}

// Function to add a new shipment
function addShipment(e) {
    e.preventDefault(); // Prevent page reload

    const newShipment = {
        trackingNumber: trackingNumberInput.value.trim(),
        carrier: carrierInput.value.trim(),
        expectedDate: expectedDateInput.value,
        status: 'Pending' // Default status
    };

    shipments.push(newShipment);
    saveShipments();
    renderShipments();

    // Clear form fields
    shipmentForm.reset();
}

// Function to update a shipment's status (made global for `onchange` event)
window.updateStatus = function(index, newStatus) {
    shipments[index].status = newStatus;
    saveShipments();
    renderShipments(); // Re-render to update the status color
}

// Function to delete a shipment (made global for `onclick` event)
window.deleteShipment = function(index) {
    if (confirm('Are you sure you want to delete this shipment?')) {
        shipments.splice(index, 1);
        saveShipments();
        renderShipments();
    }
}

// Event Listeners
shipmentForm.addEventListener('submit', addShipment);

// Initial load
renderShipments();