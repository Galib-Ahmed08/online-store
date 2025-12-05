// Array to hold the items in the cart
let cart = [];

// Functions for index.html
function showMessage() {
    alert("Welcome to our store! Enjoy shopping.");
}

// Function for contact.html
function sayHi() {
    alert('Thank you for visiting!');
}

// --- Cart Logic Functions for products.html ---

function updateCartCount() {
    // This function looks for the cart-count span on products.html
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cart.length;
    }
}

function addToCart(productName, price) {
    const product = {
        name: productName,
        price: price,
        // Use a timestamp or similar for a unique ID to allow multiple of the same item
        id: Date.now() 
    };
    cart.push(product);
    alert(productName + " has been added to your cart for $" + price + ".");
    updateCartCount();
}

function removeFromCart(productId) {
    // Find the index of the product to remove using its unique ID
    const index = cart.findIndex(item => item.id === productId);

    if (index > -1) {
        const removedItem = cart.splice(index, 1)[0];
        alert(removedItem.name + " has been removed from your cart.");
        // Re-render the cart list and update the count
        renderCart();
        updateCartCount();
    }
}

function renderCart() {
    const cartItemsList = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    let total = 0;

    // Clear previous items
    if (cartItemsList) {
        cartItemsList.innerHTML = ''; 

        if (cart.length === 0) {
            cartItemsList.innerHTML = '<li>Your cart is empty.</li>';
        } else {
            cart.forEach(item => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <span>${item.name} - $${item.price.toFixed(2)}</span>
                    <button class="remove-button" onclick="removeFromCart(${item.id})">Remove</button>
                `;
                cartItemsList.appendChild(listItem);
                total += item.price;
            });
        }
    }

    if (cartTotalElement) {
        cartTotalElement.textContent = total.toFixed(2);
    }
}

function viewCart() {
    const modal = document.getElementById('cart-modal');
    if (modal) {
        renderCart(); // Populate the cart content before showing
        modal.style.display = 'block';
    }
}

function closeCart() {
    const modal = document.getElementById('cart-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Close the modal if the user clicks anywhere outside of it
window.onclick = function(event) {
    const modal = document.getElementById('cart-modal');
    if (modal && event.target == modal) {
        modal.style.display = "none";
    }
}

// Initial count update on products.html load
document.addEventListener('DOMContentLoaded', updateCartCount);
