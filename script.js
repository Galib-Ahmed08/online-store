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

// --- SEARCH FILTER AND INITIAL SEARCH CHECK ---

function filterProducts() {
    const input = document.getElementById('product-search');
    if (!input) return; 

    const filter = input.value.toUpperCase(); 
    const productGrid = document.getElementById('product-list');
    
    if (!productGrid) return;
    
    const products = productGrid.getElementsByClassName('product'); 

    for (let i = 0; i < products.length; i++) {
        const productName = products[i].querySelector('h3'); 
        
        if (productName) {
            const txtValue = productName.textContent || productName.innerText;
            
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                products[i].style.display = ""; 
            } else {
                products[i].style.display = "none"; 
            }
        }       
    }
}

// Checks for a search query passed from another page (Home or Contact)
function checkURLForSearchQuery() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('query');
    
    if (searchQuery) {
        const searchInput = document.getElementById('product-search');
        if (searchInput) {
            // 1. Put the search term into the products page search box
            searchInput.value = searchQuery;
            // 2. Automatically run the filter
            filterProducts();
            // Clear the query from the URL bar for a cleaner look
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }
}


// --- Cart Logic Functions ---

function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cart.length;
    }
}

function addToCart(productName, price) {
    const product = {
        name: productName,
        price: price,
        id: Date.now() 
    };
    cart.push(product);
    alert(productName + " has been added to your cart for BDT " + price + ".");
    updateCartCount();
}

function removeFromCart(productId) {
    const index = cart.findIndex(item => item.id === productId);

    if (index > -1) {
        const removedItem = cart.splice(index, 1)[0];
        alert(removedItem.name + " has been removed from your cart.");
        renderCart();
        updateCartCount();
    }
}

function renderCart() {
    const cartItemsList = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    let total = 0;

    // Reset payment section whenever cart is rendered/updated
    const paymentSection = document.getElementById('payment-section');
    const checkoutBtn = document.getElementById('checkout-btn');
    if (paymentSection && checkoutBtn) {
        paymentSection.style.display = 'none';
        checkoutBtn.style.display = 'block';
    }

    if (cartItemsList) {
        cartItemsList.innerHTML = ''; 

        if (cart.length === 0) {
            cartItemsList.innerHTML = '<li>Your cart is empty.</li>';
        } else {
            cart.forEach(item => {
                const listItem = document.createElement('li');
                // Currency is BDT
                listItem.innerHTML = `
                    <span>${item.name} - BDT ${item.price.toFixed(2)}</span>
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
        renderCart(); 
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

// --- Payment Gateway Functions (MFS and Card) ---

// Toggles input fields based on payment method selection
function togglePaymentFields() {
    const method = document.getElementById('payment-method').value;
    const cardFields = document.getElementById('card-fields');
    const mfsFields = document.getElementById('mfs-fields');

    if (method === 'card') {
        cardFields.style.display = 'block';
        mfsFields.style.display = 'none';
        // Set Card fields as required
        document.getElementById('card').required = true;
        document.getElementById('name').required = true;
        document.getElementById('expiry').required = true;
        document.getElementById('cvv').required = true;
        // Set MFS field as not required
        document.getElementById('mfs-number').required = false;

    } else {
        cardFields.style.display = 'none';
        mfsFields.style.display = 'block';
        // Set MFS number as required
        document.getElementById('mfs-number').required = true;
        // Set Card fields as not required
        document.getElementById('card').required = false;
        document.getElementById('name').required = false;
        document.getElementById('expiry').required = false;
        document.getElementById('cvv').required = false;
    }
}

function showPaymentForm() {
    const paymentSection = document.getElementById('payment-section');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    if (cart.length === 0) {
        alert("Your cart is empty. Please add products to proceed to checkout.");
        return;
    }
    
    if (paymentSection && checkoutBtn) {
        paymentSection.style.display = 'block';
        checkoutBtn.style.display = 'none';
        // Initialize fields to the default state (Card)
        togglePaymentFields(); 
    }
}

function processPayment(event) {
    event.preventDefault(); 
    
    const totalAmount = document.getElementById('cart-total').textContent;
    const method = document.getElementById('payment-method').value;
    let paymentSuccess = false;

    if (method === 'card') {
        const cardNum = document.getElementById('card').value;
        // Basic Card validation: check for 16 digits
        if (cardNum.length === 16 && !isNaN(cardNum) && cardNum.trim() !== '') {
            paymentSuccess = true;
        } else {
            alert("Please enter a valid 16-digit card number.");
        }
    } else {
        const mfsNumber = document.getElementById('mfs-number').value;
        const mfsName = document.getElementById('payment-method').options[document.getElementById('payment-method').selectedIndex].text;
        
        // MFS number validation: check for 11 digits and start with '01'
        if (mfsNumber.length === 11 && !isNaN(mfsNumber) && mfsNumber.startsWith('01')) {
            alert(`Simulating MFS payment via ${mfsName} (Number: ${mfsNumber}). A pin verification step is simulated.`);
            paymentSuccess = true;
        } else {
            alert(`Please enter a valid 11-digit MFS account number starting with '01' for ${mfsName}.`);
        }
    }

    if (paymentSuccess) {
        // Final confirmation message using BDT
        alert(`Payment successful via ${method.toUpperCase()}! Your total of BDT ${totalAmount} has been processed. Your order is confirmed!`);
        
        // Clear cart and close modal
        cart = [];
        updateCartCount();
        closeCart();
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    const paymentForm = document.getElementById('payment-form');
    if (paymentForm) {
        paymentForm.addEventListener('submit', processPayment);
    }
    
    // Check for search query on page load
    checkURLForSearchQuery();
    
    updateCartCount();
});
