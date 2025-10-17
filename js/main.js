// DOM Elements
const mpesaPayBtn = document.getElementById('mpesa-pay-btn');
const mpesaPaymentStatus = document.getElementById('mpesa-payment-status');
let paymentConfirmed = false;
// Helper to get cart total
function getCartTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}
// Convert local phone number (e.g., 0712345678) to international format (+254712345678)
function convertToInternationalFormat(localNumber) {
   if (localNumber.startsWith('07')) {
       return '+254' + localNumber.substring(1);  // Remove the '0' and add '+254'
   }
   // If the number is already in international format, return it as is
   return localNumber;
}

// M-Pesa Pay Button Logic
if (mpesaPayBtn) {
    mpesaPayBtn.addEventListener('click', async function() {
        const contactInput = document.getElementById('cart-contact');
        const contact = contactInput ? convertToInternationalFormat(contactInput.value.trim()) : '';

        // Check if the formatted phone number is valid (length should be 13: +254 followed by 9 digits)
        if (contact.length === 13 && contact.startsWith('+254')) {
           mpesaPayBtn.disabled = true;
           mpesaPayBtn.textContent = 'Processing...';
           if (mpesaPaymentStatus) mpesaPaymentStatus.textContent = '';

           try {
               const response = await fetch('/.netlify/functions/stkpush', {
                   method: 'POST',
                   headers: { 'Content-Type': 'application/json' },
                   body: JSON.stringify({
                       phone: contact,  // Send the correctly formatted phone number
                       amount: getCartTotal(),  // Send the total amount
                       account_reference: 'EdmacOrder',  // Example reference
                       transaction_desc: 'Order Payment'  // Description for payment
                   })
               });

               const data = await response.json();

               if (response.ok && data.CheckoutRequestID) {
                   if (mpesaPaymentStatus) {
                       mpesaPaymentStatus.textContent = 'STK Push sent! Please complete payment on your phone.';
                       mpesaPaymentStatus.className = 'text-green-700 text-sm mt-2 text-center';
                   }
                   pollPaymentStatus();
               } else {
                   if (mpesaPaymentStatus) {
                       mpesaPaymentStatus.textContent = 'Failed to initiate payment. Try again.';
                       mpesaPaymentStatus.className = 'text-red-600 text-sm mt-2 text-center';
                   }
                   mpesaPayBtn.disabled = false;
                   mpesaPayBtn.textContent = 'Pay Now with M-Pesa';
               }
           } catch (err) {
               console.error("Error details:", err);  // Log the actual error
               if (mpesaPaymentStatus) {
                   mpesaPaymentStatus.textContent = 'Error connecting to payment server.';
                   mpesaPaymentStatus.className = 'text-red-600 text-sm mt-2 text-center';
               }
               mpesaPayBtn.disabled = false;
               mpesaPayBtn.textContent = 'Pay Now with M-Pesa';
           }
        } else {
           alert("Please enter a valid phone number.");
        }
    });
}

// Payment polling removed — checkout no longer depends on M-Pesa payment
function pollPaymentStatus() {
    // no-op
}

const cartBtn = document.getElementById('cart-btn');
const closeCartBtn = document.getElementById('close-cart');
const cartSidebar = document.getElementById('cart-sidebar');
const overlay = document.getElementById('overlay');
const cartItemsContainer = document.getElementById('cart-items');
const emptyCartMessage = document.getElementById('empty-cart-message');
const cartCount = document.getElementById('cart-count');
const cartSubtotal = document.getElementById('cart-subtotal');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const continueShoppingBtn = document.getElementById('continue-shopping-btn');
const productModal = document.getElementById('product-modal');
const productModalContent = document.querySelector('.product-modal-content');
const closeProductModalBtn = document.querySelector('.close-product-modal');
const callBtn = document.getElementById('call-btn');
const whatsappBtn = document.getElementById('whatsapp-btn');
const phoneSlidePanel = document.getElementById('phone-slide-panel');
const closePhonePanelBtn = document.getElementById('close-phone-panel');
const callModal = document.getElementById('call-modal');
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.slider-dot');
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Cart state
let cart = [];

// Attach event listeners to dynamic product buttons
function attachProductEventListeners() {
    // Add to Cart
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.onclick = function(e) {
            const card = btn.closest('.product-card');
            const id = btn.dataset.id;
            const product = products.find(p => p.id === id);
            let selectedVariation = {};
            if (card.querySelector('.size-selector')) {
                const sel = card.querySelector('.size-selector');
                const idx = sel.selectedIndex;
                selectedVariation = product.variations[idx];
            } else if (card.querySelector('.type-selector')) {
                const sel = card.querySelector('.type-selector');
                const idx = sel.selectedIndex;
                selectedVariation = product.variations[idx];
            } else {
                selectedVariation = product.variations[0];
            }
            addToCart(product, selectedVariation, btn);
        };
    });

    // Color selection: update image on color text click
    document.querySelectorAll('.product-card').forEach(card => {
        const colorOptions = card.querySelectorAll('.color-option');
        if (colorOptions.length > 0) {
            colorOptions.forEach(opt => {
                opt.onclick = function() {
                    colorOptions.forEach(o => o.classList.remove('selected'));
                    opt.classList.add('selected');
                    const img = card.querySelector('.product-img');
                    if (img && opt.dataset.img) {
                        img.src = opt.dataset.img;
                    }
                };
            });
        }
    });

    // View Details
    document.querySelectorAll('.view-details').forEach(btn => {
        btn.onclick = function(e) {
            const id = btn.dataset.id;
            showProductDetailsModal(id);
        };
    });

    // Variation price update
    document.querySelectorAll('.size-selector, .type-selector').forEach(sel => {
        sel.onchange = function(e) {
            const card = sel.closest('.product-card');
            const priceSpan = card.querySelector('.product-price');
            const idx = sel.selectedIndex;
            const id = card.dataset.id;
            const product = products.find(p => p.id === id);
            const variation = product.variations[idx];
            priceSpan.textContent = 'KSh ' + variation.price;
            const addBtn = card.querySelector('.add-to-cart');
            addBtn.dataset.price = variation.price;
        };
    });
}

// Cart open/close
function toggleCart() {
    cartSidebar.classList.toggle('translate-x-full');
    overlay.classList.toggle('hidden');
    document.body.classList.toggle('overflow-hidden');
}
if (cartBtn && cartSidebar && overlay) {
    cartBtn.onclick = toggleCart;
    if (closeCartBtn) closeCartBtn.onclick = toggleCart;
    overlay.onclick = function(e) {
        if (e.target === overlay) toggleCart();
    };
}

// Add to cart logic with variations
function addToCart(product, variation, btn) {
    const key = product.id + '-' + (variation.size || variation.type || 'default');
    let item = cart.find(i => i.key === key);

    if (item) {
        item.quantity += 1;
    } else {
        cart.push({
            key,
            id: product.id,
            name: product.name,
            price: variation.price,
            size: variation.size || null,
            type: variation.type || null,
            quantity: 1
        });
    }

    updateCartUI();
    showAddToCartFeedback(btn);
}
// Helper to convert local phone number to international format
function convertToInternationalFormat(localNumber) {
    if (localNumber.startsWith('07')) {
        return '+254' + localNumber.substring(1);
    }
    return localNumber;
}

function showAddToCartFeedback(button) {
    const originalText = button.textContent;
    button.innerHTML = '<i class="fas fa-check mr-1"></i> Added!';
    button.classList.remove('bg-secondary');
    button.classList.add('bg-success');

    setTimeout(() => {
        button.innerHTML = originalText;
        button.classList.remove('bg-success');
        button.classList.add('bg-secondary');
    }, 1200);
}

// Product details modal
function showProductDetailsModal(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    let variationHtml = '';
    let colorHtml = '';
    // Color options for modal
    if (product.colors && product.colors.length > 0) {
        colorHtml = `<div class="mb-3 flex flex-wrap items-center gap-y-2" style="row-gap:6px;"><span class="block text-sm font-medium text-gray-700 mr-2">Color:</span>` +
            product.colors.map((c, i) => `<span class="color-option color-text${i === 0 ? ' selected' : ''}" data-img="${c.image ? c.image : product.image}" data-color="${c.value ? c.value : ''}" title="${c.name}" style="color:${c.value ? c.value : 'inherit'};font-weight:bold;cursor:pointer;margin-right:10px;min-width:60px;">${c.name}</span>`).join('') +
            `</div>`;
    }
    if (product.variations && product.variations.length > 1) {
        const hasSize = product.variations.some(v => v.size);
        const hasType = product.variations.some(v => v.type);
        if (hasSize) {
            variationHtml = `<div class="mb-3">
                <label class="block text-sm font-medium text-gray-700 mb-1">Size:</label>
                <select class="modal-size-selector w-full border rounded p-2 text-sm">
                    ${product.variations.map((v, i) => `<option value="${v.size}" data-price="${v.price}" ${i === 0 ? 'selected' : ''}>${v.size} - KSh ${v.price}</option>`).join('')}
                </select>
            </div>`;
        } else if (hasType) {
            variationHtml = `<div class="mb-3">
                <label class="block text-sm font-medium text-gray-700 mb-1">Type:</label>
                <select class="modal-type-selector w-full border rounded p-2 text-sm">
                    ${product.variations.map((v, i) => `<option value="${v.type}" data-price="${v.price}" ${i === 0 ? 'selected' : ''}>${v.type} - KSh ${v.price}</option>`).join('')}
                </select>
            </div>`;
        }
    }
    const price = product.variations && product.variations.length > 0 ? product.variations[0].price : '';
    // Determine initial modal image (first color image if available, else product.image, or for Crocs, first variation image)
    let initialModalImg = product.image;
    if (product.id === "12" && product.variations && product.variations[0].image) {
        initialModalImg = product.variations[0].image;
    } else if (product.colors && product.colors.length > 0 && product.colors[0].image) {
        initialModalImg = product.colors[0].image;
    }
    productModalContent.innerHTML = `
        <div class="flex flex-col md:flex-row">
            <div class="md:w-1/2 mb-6 md:mb-0 md:pr-6">
                <img src="${initialModalImg}" alt="${product.name}" class="w-full rounded-lg modal-product-img">
            </div>
            <div class="md:w-1/2">
                <h2 class="text-2xl font-bold mb-2">${product.name}</h2>
                <p class="text-gray-600 mb-4">${product.description}</p>
                ${colorHtml}
                ${variationHtml}
                <div class="mb-6">
                    <span class="text-2xl font-bold text-primary modal-product-price">KSh ${price}</span>
                </div>
                <button class="add-to-cart-modal bg-secondary text-white px-6 py-2 rounded-lg font-bold hover:bg-teal-600 transition duration-300 w-full" data-id="${product.id}">Add to Cart</button>
            </div>
        </div>
    `;
    productModal.classList.add('active');
    overlay.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
    // Modal variation price update
    const sizeSel = productModalContent.querySelector('.modal-size-selector');
    const typeSel = productModalContent.querySelector('.modal-type-selector');
    const priceSpan = productModalContent.querySelector('.modal-product-price');
    // Modal color and variation selection
    const modalImg = productModalContent.querySelector('.modal-product-img');
    const colorOptions = productModalContent.querySelectorAll('.color-option');
    if (colorOptions.length > 0) {
        colorOptions.forEach(opt => {
            opt.onclick = function() {
                colorOptions.forEach(o => o.classList.remove('selected'));
                opt.classList.add('selected');
                if (modalImg && opt.dataset.img) {
                    modalImg.src = opt.dataset.img;
                }
            };
        });
    }
    if (sizeSel) {
        sizeSel.onchange = function() {
            const idx = sizeSel.selectedIndex;
            if (product.variations[idx].image && modalImg) {
                modalImg.src = product.variations[idx].image;
            }
            priceSpan.textContent = 'KSh ' + product.variations[idx].price;
        };
    }
    if (typeSel) {
        typeSel.onchange = function() {
            const idx = typeSel.selectedIndex;
            if (product.variations[idx].image && modalImg) {
                modalImg.src = product.variations[idx].image;
            }
            priceSpan.textContent = 'KSh ' + product.variations[idx].price;
        };
    }
    // Modal add to cart
    const addBtn = productModalContent.querySelector('.add-to-cart-modal');
    addBtn.onclick = function() {
        let selectedVariation = {};
        if (sizeSel) {
            selectedVariation = product.variations[sizeSel.selectedIndex];
        } else if (typeSel) {
            selectedVariation = product.variations[typeSel.selectedIndex];
        } else {
            selectedVariation = product.variations[0];
        }
        addToCart(product, selectedVariation, addBtn);
    };
}

// Close product modal
if (closeProductModalBtn) closeProductModalBtn.onclick = closeProductModal;
function closeProductModal() {
    productModal.classList.remove('active');
    overlay.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
}
// Also close modal if overlay is clicked
overlay && overlay.addEventListener('click', function(e) {
    if (productModal.classList.contains('active') && e.target === overlay) closeProductModal();
});

// Update cart UI
function updateCartUI() {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    let subtotal = 0;

    if (cart.length === 0) {
        emptyCartMessage.classList.remove('hidden');
        cartItemsContainer.innerHTML = '';
        subtotal = 0;
    } else {
        emptyCartMessage.classList.add('hidden');
        let itemsHTML = '';

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;

            itemsHTML += `
                <div class="cart-item flex justify-between items-center py-4 border-b border-gray-200">
                    <div class="flex-1">
                        <h4 class="font-medium">${item.name}</h4>
                        ${item.size ? `<p class='text-sm text-gray-500'>Size: ${item.size}</p>` : ''}
                        ${item.type ? `<p class='text-sm text-gray-500'>Type: ${item.type}</p>` : ''}
                        <p class="text-sm font-bold">KSh ${item.price}</p>
                    </div>
                    <div class="flex items-center">
                        <button class="quantity-btn decrease w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center" data-key="${item.key}"><i class="fas fa-minus text-xs"></i></button>
                        <span class="quantity mx-2 w-8 text-center">${item.quantity}</span>
                        <button class="quantity-btn increase w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center" data-key="${item.key}"><i class="fas fa-plus text-xs"></i></button>
                        <button class="remove-btn ml-4 text-red-500 hover:text-red-700" data-key="${item.key}"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            `;
        });

        cartItemsContainer.innerHTML = itemsHTML;
    }

    cartSubtotal.textContent = `KSh ${subtotal.toLocaleString()}`;
    cartTotal.textContent = `KSh ${subtotal.toLocaleString()}`;

    // Quantity and remove buttons
    cartItemsContainer.querySelectorAll('.quantity-btn.decrease').forEach(btn => {
        btn.onclick = function() {
            const key = btn.dataset.key;
            const item = cart.find(i => i.key === key);
            if (item && item.quantity > 1) {
                item.quantity -= 1;
                updateCartUI();
                saveCart();
            }
        };
    });

    cartItemsContainer.querySelectorAll('.quantity-btn.increase').forEach(btn => {
        btn.onclick = function() {
            const key = btn.dataset.key;
            const item = cart.find(i => i.key === key);
            if (item) {
                item.quantity += 1;
                updateCartUI();
                saveCart();
            }
        };
    });

    cartItemsContainer.querySelectorAll('.remove-btn').forEach(btn => {
        btn.onclick = function() {
            const key = btn.dataset.key;
            cart = cart.filter(i => i.key !== key);
            updateCartUI();
            saveCart();
        };
    });
}

function saveCart() {
    localStorage.setItem('edmac-cart', JSON.stringify(cart));
}

function loadCart() {
    const savedCart = localStorage.getItem('edmac-cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
}

// Slider functionality
let currentSlide = 0;
function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });

    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });

    currentSlide = index;
}
dots.forEach(dot => {
    dot.addEventListener('click', function() {
        showSlide(parseInt(dot.dataset.index));
    });
});
// Auto slide change
setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}, 5000);

// Floating buttons functionality
whatsappBtn.addEventListener('click', function() {
    const phone = '+254104988770';
    const message = 'Hello Edmac Creations, I would like to inquire about your products.';
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
});
callBtn.addEventListener('click', function() {
    phoneSlidePanel.classList.remove('translate-x-full');
});
closePhonePanelBtn.addEventListener('click', function() {
    phoneSlidePanel.classList.add('translate-x-full');
});

// Checkout via WhatsApp
checkoutBtn.addEventListener('click', function() {
    const nameInput = document.getElementById('cart-name');
    const locationInput = document.getElementById('cart-location');
    const contactInput = document.getElementById('cart-contact');
    const nameError = document.getElementById('cart-name-error');
    const locationError = document.getElementById('cart-location-error');
    const contactError = document.getElementById('cart-contact-error');

    // Sanitize inputs
    function sanitizeInput(str) {
        return String(str || '').replace(/\s+/g, ' ').trim();
    }

    function normalizeKenyanPhone(input) {
        if (!input) return null;
        let s = String(input).replace(/[^0-9+]/g, ''); // remove spaces, dashes, parentheses
        // Examples accepted: 0712345678, +254712345678, 254712345678, 712345678
        if (s.startsWith('+')) {
            // +254712345678
            if (s.startsWith('+254') && s.length === 13) return s;
            return null;
        }
        if (s.startsWith('0') && s.length === 10) {
            // 0712345678 -> +254712345678
            return '+254' + s.substring(1);
        }
        if (s.length === 12 && s.startsWith('254')) {
            return '+' + s;
        }
        if (s.length === 9 && s.startsWith('7')) {
            return '+254' + s;
        }
        return null;
    }

    const name = sanitizeInput(nameInput.value);
    const location = sanitizeInput(locationInput.value);
    const contactRaw = sanitizeInput(contactInput.value);
    const contact = normalizeKenyanPhone(contactRaw);

    // Reset input borders and error messages
    nameInput.classList.remove('border-red-500');
    locationInput.classList.remove('border-red-500');
    contactInput.classList.remove('border-red-500');
    nameError.classList.add('hidden');
    locationError.classList.add('hidden');
    contactError.classList.add('hidden');

    let hasError = false;

    if (!name) {
        nameInput.classList.add('border-red-500');
        nameError.classList.remove('hidden');
        hasError = true;
    }
    if (!location) {
        locationInput.classList.add('border-red-500');
        locationError.classList.remove('hidden');
        hasError = true;
    }
    if (!contact) {
        contactInput.classList.add('border-red-500');
        contactError.classList.remove('hidden');
        hasError = true;
    }
    if (cart.length === 0) {
        alert('Your cart is empty.');
        return;
    }
    if (hasError) {
        return;
    }

    // Build sanitized WhatsApp message (use contact in normalized international format)
    let message = '';
    if (name !== '') {
        message += `Hello, my name is ${name}.%0A`;
    }
    message += `*NEW ORDER FROM EDMAC CREATIONS WEBSITE*\n\n`;
    message += `*Customer Details:*\n`;
    message += `📍 Location: ${location}\n`;
    message += `📞 Contact: ${contact || contactRaw}\n\n`;
    message += `*Order Items:*\n`;
    cart.forEach(item => {
        message += `➡️ ${item.name}`;
        if (item.size) message += ` (Size: ${item.size})`;
        if (item.type) message += ` (Type: ${item.type})`;
        message += ` - ${item.quantity} x KSh ${item.price} = KSh ${item.quantity * item.price}\n`;
    });
    message += `\n*Order Total:* KSh ${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)}`;
    const phone = '+254104988770';
    // Use normalizeKenyanPhone to ensure contact is valid; phone variable is the business WhatsApp number
    window.open(`https://wa.me/${phone.replace(/[^0-9]/g,'') }?text=${encodeURIComponent(message)}`, '_blank');
});
continueShoppingBtn.addEventListener('click', toggleCart);

// Theme toggle
if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark');
    themeToggle.querySelector('i').classList.remove('fa-moon');
    themeToggle.querySelector('i').classList.add('fa-sun');
}
themeToggle.addEventListener('click', function() {
    body.classList.toggle('dark');
    const isDark = body.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    // Change icon
    const icon = themeToggle.querySelector('i');
    if (isDark) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
});

// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileDropdownMenu = document.getElementById('mobile-dropdown-menu');

    function closeDropdownOnClickOutside(e) {
        if (!mobileDropdownMenu.contains(e.target) && e.target !== mobileMenuBtn && !mobileMenuBtn.contains(e.target)) {
            mobileDropdownMenu.classList.remove('open');
            document.body.removeEventListener('click', closeDropdownOnClickOutside);
        }
    }

    function openMobileDropdownMenu() {
        mobileDropdownMenu.classList.add('open');
        document.body.addEventListener('click', closeDropdownOnClickOutside);
    }

    function closeMobileDropdownMenu() {
        mobileDropdownMenu.classList.remove('open');
        document.body.removeEventListener('click', closeDropdownOnClickOutside);
    }

    if (mobileMenuBtn && mobileDropdownMenu) {
        mobileMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            if (mobileDropdownMenu.classList.contains('open')) {
                closeMobileDropdownMenu();
            } else {
                openMobileDropdownMenu();
            }
        });
        // Prevent clicks inside the dropdown from closing it
        mobileDropdownMenu.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }

    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            closeMobileDropdownMenu();
            const targetId = link.getAttribute('href');
            setTimeout(() => {
                const target = document.querySelector(targetId);
                if (target) target.scrollIntoView({ behavior: 'smooth' });
            }, 200);
        });
    });
});

// On DOMContentLoaded, render grouped products and load cart
document.addEventListener('DOMContentLoaded', function() {
    if (typeof renderProductsGrouped === "function") {
        renderProductsGrouped();
    }
    loadCart();
    showSlide(0); // Initialize slider
});
