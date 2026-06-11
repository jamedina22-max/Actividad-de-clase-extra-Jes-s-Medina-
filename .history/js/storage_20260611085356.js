
const KEYS = {
    PRODUCTS: 'ms_products',
    USERS: 'ms_users',
    CURRENT_USER: 'ms_session',
    CART: 'ms_cart',
    ORDERS: 'ms_orders',
    THEME: 'ms_theme'
};

function initLocalStorage() {
    if (!localStorage.getItem(KEYS.USERS)) {
        const defaultUsers = [
            { email: 'admin@store.com', pass: 'admin123', name: 'Admin Principal', role: 'admin', avatar: 'https://i.pravatar.cc/150?img=33', address: 'Oficina Central' },
            { email: 'user@store.com', pass: 'user123', name: 'Juan Pérez', role: 'client', avatar: 'https://i.pravatar.cc/150?img=12', address: 'Calle Falsa 123' }
        ];
        localStorage.setItem(KEYS.USERS, JSON.stringify(defaultUsers));
    }
    if (!localStorage.getItem(KEYS.ORDERS)) localStorage.setItem(KEYS.ORDERS, JSON.stringify([]));
    if (!localStorage.getItem(KEYS.CART)) localStorage.setItem(KEYS.CART, JSON.stringify([]));
}

function getLocalData(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

function saveLocalData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

initLocalStorage();