document.addEventListener('DOMContentLoaded', function() {
    const burgerContainer = document.getElementById('burger-container');
    const landing = document.getElementById('landing');
    const menuContainer = document.getElementById('menu-container');
    const searchInput = document.querySelector('.search-input');
    const foodCards = document.querySelectorAll('.food-card');
    const productModal = document.getElementById('product-modal');
    const modalImg = document.querySelector('.modal-img');
    const modalName = document.querySelector('.modal-name');
    const qtyValue = document.querySelector('.qty-value');
    const priceValue = document.querySelector('.price-value');
    const modalBackBtn = document.querySelector('.modal-back-btn');
    const modalCancelBtn = document.querySelector('.modal-cancel-btn');
    const modalAddCartBtn = document.querySelector('.modal-add-cart-btn');
    const qtyMinusBtn = document.querySelector('.qty-btn.minus');
    const qtyPlusBtn = document.querySelector('.qty-btn.plus');
    const cartIconContainer = document.querySelector('.cart-icon-container');
    const cartCount = document.querySelector('.cart-count');
    const cartModal = document.getElementById('cart-modal');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotalPrice = document.querySelector('.cart-total-price');
    const cartCloseBtn = document.querySelector('.cart-close-btn');
    const cartClearBtn = document.querySelector('.cart-clear-btn');
    const cartCheckoutBtn = document.querySelector('.cart-checkout-btn');
    const receiptModal = document.getElementById('receipt-modal');
    const receiptDate = document.getElementById('receipt-date');
    const receiptTime = document.getElementById('receipt-time');
    const receiptOrderNumber = document.getElementById('receipt-order-number');
    const receiptItemsContainer = document.querySelector('.receipt-items');
    const receiptTotal = document.getElementById('receipt-total');
    const receiptCloseBtn = document.querySelector('.receipt-close-btn');
    const notificationIconContainer = document.querySelector('.notification-icon-container');
    const notificationCount = document.querySelector('.notification-count');
    const notificationModal = document.getElementById('notification-modal');
    const notificationItemsContainer = document.querySelector('.notification-items');
    const notificationCloseBtn = document.querySelector('.notification-close-btn');
    const notificationClearBtn = document.querySelector('.notification-clear-btn');
    const logoutIcon = document.querySelector('.logout-icon');
    const logoutModal = document.getElementById('logout-modal');
    const logoutCancelBtn = document.querySelector('.logout-cancel-btn');
    const logoutConfirmBtn = document.querySelector('.logout-confirm-btn');
    
    let animationTriggered = false;
    let currentPrice = 0;
    let currentQuantity = 1;
    let currentProductName = '';
    let cart = [];
    let notifications = [];
    let unreadNotificationCount = 0;

    function triggerFoodCardAnimations() {
        const foodCards = document.querySelectorAll('.food-card');
        foodCards.forEach(card => {
            card.style.animation = 'none';
            card.offsetHeight;
            card.style.animation = null;
        });
    }

    document.body.addEventListener('click', function() {
        if (animationTriggered) return;
        animationTriggered = true;

        burgerContainer.classList.add('split');

        setTimeout(function() {
            landing.style.display = 'none';
            menuContainer.classList.remove('hidden');
            setTimeout(function() {
                menuContainer.classList.add('show');
                triggerFoodCardAnimations();
            }, 10);
        }, 1200);
    });

    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            
            foodCards.forEach(card => {
                const cardName = card.getAttribute('data-name').toLowerCase();
                
                if (cardName.includes(searchTerm)) {
                    card.classList.remove('hidden-card');
                } else {
                    card.classList.add('hidden-card');
                }
            });
        });
    }

    foodCards.forEach(card => {
        card.addEventListener('click', function(e) {
            e.stopPropagation();
            const name = card.getAttribute('data-name');
            const price = parseInt(card.getAttribute('data-price'));
            let img = card.getAttribute('data-hover');
            if (!img) {
                img = card.getAttribute('data-img');
            }
            
            openModal(name, price, img);
        });
    });

    function openModal(name, price, img) {
        currentProductName = name;
        currentPrice = price;
        currentQuantity = 1;
        modalImg.src = img;
        modalName.textContent = name;
        qtyValue.textContent = currentQuantity;
        priceValue.textContent = currentPrice;
        productModal.classList.remove('hidden');
    }

    function closeProductModal() {
        productModal.classList.add('hidden');
    }

    function addToCart() {
        const existingItemIndex = cart.findIndex(item => item.name === currentProductName);
        
        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += currentQuantity;
        } else {
            cart.push({
                name: currentProductName,
                price: currentPrice,
                quantity: currentQuantity
            });
        }
        
        updateCartUI();
        closeProductModal();
        alert(currentQuantity + 'x ' + currentProductName + ' added to cart!');
    }

    function updateCartUI() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        if (totalItems > 0) {
            cartCount.textContent = totalItems;
            cartCount.classList.remove('hidden');
        } else {
            cartCount.classList.add('hidden');
        }
        
        renderCartItems();
        updateCartTotal();
    }

    function renderCartItems() {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<div class="cart-empty">Your cart is empty!</div>';
            return;
        }
        
        cartItemsContainer.innerHTML = cart.map((item, index) => `
            <div class="cart-item" data-index="${index}">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-details">₱${item.price} each</div>
                </div>
                <div class="cart-item-controls">
                    <div class="cart-item-qty">
                        <button class="cart-item-qty-btn minus" data-index="${index}">-</button>
                        <span class="cart-item-qty-value">${item.quantity}</span>
                        <button class="cart-item-qty-btn plus" data-index="${index}">+</button>
                    </div>
                    <div class="cart-item-price">₱${item.price * item.quantity}</div>
                    <button class="cart-item-remove" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
        
        addCartItemEventListeners();
    }

    function addCartItemEventListeners() {
        document.querySelectorAll('.cart-item-qty-btn.minus').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const index = parseInt(this.getAttribute('data-index'));
                if (cart[index].quantity > 1) {
                    cart[index].quantity--;
                    updateCartUI();
                }
            });
        });
        
        document.querySelectorAll('.cart-item-qty-btn.plus').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const index = parseInt(this.getAttribute('data-index'));
                cart[index].quantity++;
                updateCartUI();
            });
        });
        
        document.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const index = parseInt(this.getAttribute('data-index'));
                cart.splice(index, 1);
                updateCartUI();
            });
        });
    }

    function updateCartTotal() {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotalPrice.textContent = '₱' + total;
    }

    function clearCart() {
        cart = [];
        updateCartUI();
    }

    function openCartModal() {
        cartModal.classList.remove('hidden');
    }

    function closeCartModal() {
        cartModal.classList.add('hidden');
    }

    function checkout() {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        closeCartModal();
        showReceipt();
    }

    function showReceipt() {
        const now = new Date();
        const dateStr = now.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        const timeStr = now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        const orderNum = Math.floor(100000 + Math.random() * 900000);
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        receiptDate.textContent = dateStr;
        receiptTime.textContent = timeStr;
        receiptOrderNumber.textContent = '#' + orderNum;
        
        receiptItemsContainer.innerHTML = cart.map(item => `
            <div class="receipt-order-item">
                <div class="item-info">
                    <span class="item-name">${item.name}</span>
                    <span class="item-quantity">x${item.quantity}</span>
                </div>
                <span class="item-price">₱${item.price * item.quantity}</span>
            </div>
        `).join('');
        
        receiptTotal.textContent = '₱' + total;
        receiptModal.classList.remove('hidden');
        
        addNotification(dateStr, timeStr, orderNum, [...cart], total);
        
        clearCart();
    }

    function addNotification(date, time, orderNum, items, total) {
        const notification = {
            date: date,
            time: time,
            orderNumber: orderNum,
            items: items,
            total: total,
            timestamp: Date.now()
        };
        
        notifications.unshift(notification);
        unreadNotificationCount++;
        updateNotificationUI();
    }

    function updateNotificationUI() {
        if (unreadNotificationCount > 0) {
            notificationCount.textContent = unreadNotificationCount;
            notificationCount.classList.remove('hidden');
        } else {
            notificationCount.classList.add('hidden');
        }
        
        renderNotificationItems();
    }

    function renderNotificationItems() {
        if (notifications.length === 0) {
            notificationItemsContainer.innerHTML = '<div class="notification-empty">No notifications yet!</div>';
            return;
        }
        
        notificationItemsContainer.innerHTML = notifications.map((notification, index) => `
            <div class="notification-item">
                <div class="notification-item-header">
                    <span class="notification-item-title">Order #${notification.orderNumber}</span>
                    <span class="notification-item-time">${notification.date} ${notification.time}</span>
                </div>
                <div class="notification-item-content">
                    ${notification.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}<br>
                    <strong>Total: ₱${notification.total}</strong>
                </div>
            </div>
        `).join('');
    }

    function openNotificationModal() {
        unreadNotificationCount = 0;
        updateNotificationUI();
        notificationModal.classList.remove('hidden');
    }

    function closeNotificationModal() {
        notificationModal.classList.add('hidden');
    }

    function clearNotifications() {
        notifications = [];
        unreadNotificationCount = 0;
        updateNotificationUI();
    }

    function closeReceipt() {
        receiptModal.classList.add('hidden');
    }

    modalBackBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        closeProductModal();
    });

    modalCancelBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        closeProductModal();
    });

    modalAddCartBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        addToCart();
    });

    qtyMinusBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        if (currentQuantity > 1) {
            currentQuantity--;
            qtyValue.textContent = currentQuantity;
            priceValue.textContent = currentPrice * currentQuantity;
        }
    });

    qtyPlusBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        currentQuantity++;
        qtyValue.textContent = currentQuantity;
        priceValue.textContent = currentPrice * currentQuantity;
    });

    cartIconContainer.addEventListener('click', function(e) {
        e.stopPropagation();
        openCartModal();
    });

    cartCloseBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        closeCartModal();
    });

    cartClearBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        clearCart();
    });

    cartCheckoutBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        checkout();
    });

    cartModal.querySelector('.cart-overlay').addEventListener('click', function() {
        closeCartModal();
    });

    productModal.querySelector('.modal-overlay').addEventListener('click', function() {
        closeProductModal();
    });

    receiptCloseBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        closeReceipt();
    });

    notificationIconContainer.addEventListener('click', function(e) {
        e.stopPropagation();
        openNotificationModal();
    });

    notificationCloseBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        closeNotificationModal();
    });

    notificationClearBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        clearNotifications();
    });

    notificationModal.querySelector('.notification-overlay').addEventListener('click', function() {
        closeNotificationModal();
    });

    function openLogoutModal() {
        logoutModal.classList.remove('hidden');
    }

    function closeLogoutModal() {
        logoutModal.classList.add('hidden');
    }

    function resetLandingAnimations() {
        const topTitle = document.querySelector('.top-title');
        const bottomTitle = document.querySelector('.bottom-title');
        const mainBurger = document.getElementById('main-burger');
        const chickenImg = document.querySelector('.chicken-img');
        const bbqImg = document.querySelector('.bbq-img');
        const clickHint = document.querySelector('.click-hint');
        
        const elements = [topTitle, bottomTitle, mainBurger, chickenImg, bbqImg, clickHint];
        elements.forEach(el => {
            el.style.animation = 'none';
            el.offsetHeight;
            el.style.animation = null;
        });
    }

    function logOut() {
        closeLogoutModal();
        clearCart();
        notifications = [];
        unreadNotificationCount = 0;
        updateNotificationUI();
        
        menuContainer.classList.add('hidden');
        landing.style.display = 'flex';
        burgerContainer.classList.remove('split');
        animationTriggered = false;
        
        const foodCards = document.querySelectorAll('.food-card');
        foodCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(60px) scale(0.9)';
        });
        
        setTimeout(() => {
            resetLandingAnimations();
        }, 100);
    }

    logoutIcon.addEventListener('click', function(e) {
        e.stopPropagation();
        openLogoutModal();
    });

    logoutCancelBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        closeLogoutModal();
    });

    logoutConfirmBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        logOut();
    });

    logoutModal.querySelector('.logout-overlay').addEventListener('click', function() {
        closeLogoutModal();
    });
});
