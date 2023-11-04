import menuItems from "./image-data.js"
let totalPrice = 0;
document.addEventListener("DOMContentLoaded", function () {
    // For the menu page
    if (window.location.pathname.includes("menu.html")) {
        const container = document.getElementById("menu-preview");
        menuItems.forEach(i => {
            const menuItem = createMenuItem(i["id"], i["picture-path"], i["item-name"], i["item-description"], i["price"])
            container.appendChild(menuItem);
        });
    }

    // For the order page
    if (window.location.pathname.includes("order.html")) {
        const container = document.getElementById("order-items");

        const itemIds = getOrderFromLocalStorage();
        const menuItems = []
        itemIds.forEach(i => {
            filterMenuItemsById(i).forEach(i => menuItems.push(i))
        })
        // Make sure order is not null or empty
        menuItems.forEach(i => {
            const menuItem = createThumbnailItem(i["picture-path"], i["item-name"], i["item-name"], i["id"], i["price"])
            totalPrice += i["price"]
            totalPrice.toFixed(2)
            container.appendChild(menuItem);
        });
        const priceIndicator = document.getElementById("price")
        priceIndicator.textContent = `Total cost: $${totalPrice}`;

        const submitButton = document.getElementById('submit-button');
        submitButton.addEventListener('click', function (event) {
            event.preventDefault();

            // Regular expressions for validation
            const nameRegex = /^[a-zA-Z\s]{2,}$/; // Allow letters and spaces, at least two characters
            const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/; // Simple validation for email
            const addressRegex = /^[a-zA-Z0-9\s,'-]{3,}$/; // Allow alphanumeric characters, spaces, and certain punctuation, at least three characters

            // Extracting form data
            const nameInput = document.querySelector('input[name="name"]');
            const emailInput = document.querySelector('input[name="email"]');
            const addressInput = document.querySelector('input[name="reservation-date"]'); // Again, assuming this is the address input

            // Validate name
            if (!nameRegex.test(nameInput.value)) {
                alert("Please enter a valid name.");
                nameInput.focus();
                return false;
            }

            // Validate email
            if (!emailRegex.test(emailInput.value)) {
                alert("Please enter a valid email address.");
                emailInput.focus();
                return false;
            }

            // Validate address
            if (!addressRegex.test(addressInput.value)) {
                alert("Please enter a valid address.");
                addressInput.focus();
                return false;
            }

            // If all validations pass
            const orderData = {
                name: nameInput.value,
                email: emailInput.value,
                address: addressInput.value,
                // other data extraction
            };

            //Toggle the success element
            const success = document.getElementById('success')
            const orders = document.getElementById('orders')
            const successCard = document.getElementById('success-card')
            orders.style.display = 'none';
            success.style.display = 'flex';
            successCard.style.display = 'flex';
        });
    }
});

function createMenuItem(id, imgSrc, title, description, price) {
    // Create the main container div and set its attributes
    const menuItem = document.createElement('div');
    menuItem.className = 'menu-item';
    menuItem.dataset.id = id.toString();

    // Create the image element
    const image = document.createElement('img');
    image.className = 'menu-item-img';
    image.src = `/assets/images/menu-items/${imgSrc}`;
    image.alt = title;

    // Create the card content container
    const cardContent = document.createElement('div');
    cardContent.className = 'card-content';

    // Create the info wrapper
    const infoWrapper = document.createElement('div');
    infoWrapper.className = 'info-wrapper';

    // Create the heading (title)
    const menuHeading = document.createElement('h3');
    menuHeading.className = 'menu-heading';
    menuHeading.textContent = title;

    // Create the paragraph (description)
    const p = document.createElement('p');
    p.textContent = description;
    p.classList.add('item-description')

    // Create the price element
    const priceElement = document.createElement('h3');
    priceElement.className = 'subtitle';
    priceElement.classList.add('price')
    priceElement.textContent = `Price: $${price.toFixed(2)}`;

    // Create the button and set its attributes
    const button = document.createElement('button');
    button.className = 'main-button';
    button.textContent = 'Add to your order';
    // Here we are setting the onclick event to a string that will call your addToOrder function with the id
    // It is assumed that addToOrder is a global function that can be called from anywhere
    button.onclick = function () {
        addToOrder(id);
    };

    // Append everything together
    infoWrapper.appendChild(menuHeading);
    infoWrapper.appendChild(p);

    cardContent.appendChild(infoWrapper);
    cardContent.appendChild(priceElement);
    cardContent.appendChild(button);

    menuItem.appendChild(image);
    menuItem.appendChild(cardContent);

    // Return the complete menu item
    return menuItem;
}

function addToOrder(id) {

    // Assume you want to store an array of item IDs
    // Retrieve the current order from localStorage, or create a new array if none exists
    let order = getOrderFromLocalStorage();

    // Add the new item ID to the order array
    order.push(id);

    // Save the updated order back to localStorage
    localStorage.setItem('order', JSON.stringify(order));
}

function getOrderFromLocalStorage() {
    // Retrieve the current order from localStorage or return an empty array if null
    return JSON.parse(localStorage.getItem('order')) || [];
}

function saveOrderToLocalStorage(order) {
    // Save the given order array to localStorage
    localStorage.setItem('order', JSON.stringify(order));
}

function removeFromOrder(id, price) {
    // Fetch the current order list
    let order = getOrderFromLocalStorage();

    // Find the index of the first item with the given id
    const index = order.indexOf(id);

    // If the item is found, remove it from the array
    if (index === -1) {
        return
    }
    order.splice(index, 1);

    // Save the updated order back to localStorage
    saveOrderToLocalStorage(order);
    totalPrice = Math.round(totalPrice -Number(price))
    const priceIndicator = document.getElementById("price")
    priceIndicator.textContent = `Total cost: $${totalPrice}`;

    // Add any additional logic needed after removing the item from the order
}

function createThumbnailItem(imgSrc, altText, itemName, id, price) {
    // Create the outer div with class 'item-thumbnail'
    const thumbnailDiv = document.createElement('div');
    thumbnailDiv.classList.add('selected-item');

    // Create the image element
    const imgElement = document.createElement('img');
    imgElement.src = `/assets/images/menu-items/${imgSrc}`;;
    imgElement.alt = altText;
    imgElement.classList.add('item-thumbnail');

    // Append image to the thumbnail div
    thumbnailDiv.appendChild(imgElement);

    // Create the heading (h3) for the item name
    const h3Element = document.createElement('h3');
    h3Element.classList.add('itemName');
    h3Element.textContent = itemName;

    // Append heading to the thumbnail div
    thumbnailDiv.appendChild(h3Element);

    thumbnailDiv.addEventListener('click', function () {
        removeFromOrder(id, price);
        thumbnailDiv.remove(); // Removes the thumbnail div from the HTML DOM
    });
    // Return the completed HTML structure
    return thumbnailDiv;
}

function filterMenuItemsById(id) {
    return menuItems
        .filter(item => item.id == id)
}


const burgerMenu = document.getElementById('burger-menu');
const overlay = document.getElementById('menu');
burgerMenu.addEventListener('click', function () {
    this.classList.toggle("close");
    overlay.classList.toggle("overlay");
});
