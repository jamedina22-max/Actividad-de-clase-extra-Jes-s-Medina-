
let carrito = JSON.parse(localStorage.getItem(KEYS.CART)) || [];

function renderCatalogo() {
    const productos = getLocalData(KEYS.PRODUCTS);
    
    return `
        <div class="space-y-6">
            <div class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow flex flex-col md:flex-row gap-4 justify-between items-center">
                <input type="text" id="search-input" oninput="filtrarCatalogo()" placeholder="Buscar producto..." class="w-full md:w-1/3 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
                <select id="category-filter" onchange="filtrarCatalogo()" class="w-full md:w-1/4 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
                    <option value="all">Todas las categorías</option>
                    <option value="electronics">Electrónica</option>
                    <option value="jewelery">Joyería</option>
                    <option value="men's clothing">Ropa de Hombre</option>
                    <option value="women's clothing">Ropa de Mujer</option>
                </select>
            </div>

            <div id="grid-productos" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                ${generarCardsProductos(productos)}
            </div>
        </div>
    `;
}

function generarCardsProductos(lista) {
    if(lista.length === 0) return `<p class="col-span-full text-center text-gray-500 py-8">No se encontraron productos.</p>`;
    
    return lista.map(p => `
        <div class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow hover:shadow-xl transition flex flex-col justify-between">
            <div>
                <img src="${p.image}" class="h-48 mx-auto object-contain mb-4 bg-white p-2 rounded" alt="${p.title}">
                <span class="text-xs font-bold uppercase tracking-wider text-gray-400">${p.category}</span>
                <h4 class="font-semibold text-sm line-clamp-2 mt-1">${p.title}</h4>
                <div class="flex items-center text-yellow-500 my-1 text-xs">
                    ⭐ ${p.rating?.rate || 5} (${p.rating?.count || 1} reseñas)
                </div>
            </div>
            <div class="mt-4">
                <p class="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">$${p.price}</p>
                <button onclick="agregarAlCarrito(${p.id})" class="w-full mt-2 bg-gray-900 text-white dark:bg-indigo-600 py-2 rounded-lg font-medium text-sm hover:opacity-90 flex items-center justify-center space-x-1">
                    <i data-lucide="shopping-cart" class="w-4 h-4"></i> <span>Agregar</span>
                </button>
            </div>
        </div>
    `).join('');
}

function filtrarCatalogo() {
    const texto = document.getElementById('search-input').value.toLowerCase();
    const categoria = document.getElementById('category-filter').value;
    const todosLosProductos = getLocalData(KEYS.PRODUCTS);
    
    const filtrados = todosLosProductos.filter(p => {
        const coincideTexto = p.title.toLowerCase().includes(texto);
        const coincideCategoria = (categoria === 'all' || p.category === categoria);
        return coincideTexto && coincideCategoria;
    });
    
    document.getElementById('grid-productos').innerHTML = generarCardsProductos(filtrados);
    lucide.createIcons();
}

function guardarCarritoSeguro() {
    saveLocalData(KEYS.CART, carrito);
    const user = JSON.parse(sessionStorage.getItem(KEYS.CURRENT_USER));
    if (user) {
        localStorage.setItem(`ms_cart_${user.email}`, JSON.stringify(carrito));
    }
}

function agregarAlCarrito(id) {
    const usuarioActivo = JSON.parse(sessionStorage.getItem(KEYS.CURRENT_USER));
    
    if (!usuarioActivo) {
        alert(" Para poder añadir productos al carrito y realizar compras, debes iniciar sesión o registrarte.");
        
        cambiarPestañaAuth('login'); 
        return; 
    }
    const productos = getLocalData(KEYS.PRODUCTS);
    const producto = productos.find(p => p.id === id);
    
    if (producto) {
        const itemEnCarrito = carrito.find(item => item.id === id);
        if (itemEnCarrito) {
            itemEnCarrito.cantidad++;
        } else {
            carrito.push({ ...producto, cantidad: 1 });
        }
        
        guardarCarritoSeguro(); 
        actualizarContadorCarrito();
        alert(`🛒 "${producto.title}" añadido con éxito a tu cuenta.`);
    }
}

function actualizarContadorCarrito() {
    const countBadge = document.getElementById('cart-count');
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    if(countBadge) countBadge.innerText = totalItems;
}







function procesarPago(orderData) {
    if (!navigator.onLine) {
        // --- CASO OFFLINE ---
        let queue = getLocalData('ms_offline_queue'); 
        queue.push(orderData);
        saveLocalData('ms_offline_queue', queue);
        
        alert("Estás en modo Offline. Tu compra se ha guardado localmente y se procesará automáticamente cuando vuelvas a tener internet.");
        saveLocalData(KEYS.CART, []);
        navigate('landing');
    } else {
        // --- CASO ONLINE ---
        let orders = getLocalData(KEYS.ORDERS);
        orders.push(orderData);
        saveLocalData(KEYS.ORDERS, orders);
        alert("¡Compra realizada con éxito de forma online!");
        saveLocalData(KEYS.CART, []);
        navigate('landing');
    }
}


function renderCarrito() {
    if (carrito.length === 0) {
        return `
            <div class="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow">
                <i data-lucide="shopping-bag" class="w-16 h-16 mx-auto text-gray-300 mb-4"></i>
                <h2 class="text-2xl font-bold mb-2">Tu carrito está vacío</h2>
                <p class="text-gray-500 mb-6">¡Explora nuestro catálogo para añadir productos!</p>
                <button onclick="navigate('catalog')" class="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700">Ir al Catálogo</button>
            </div>
        `;
    }


    const subtotal = carrito.reduce((sum, item) => sum + (item.price * item.cantidad), 0);
    const total = subtotal;

    return `
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2 space-y-4">
                <h2 class="text-2xl font-black mb-4">Tu Carrito de Compras</h2>
                ${carrito.map(item => `
                    <div class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow flex items-center justify-between gap-4">
                        <img src="${item.image}" class="w-16 h-16 object-contain bg-white p-1 rounded" alt="${item.title}">
                        
                        <div class="flex-grow min-w-0">
                            <h4 class="font-semibold text-sm truncate">${item.title}</h4>
                            <p class="text-xs text-gray-500 font-bold">$${item.price} c/u</p>
                        </div>

                        <div class="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                            <button onclick="modificarCantidad(${item.id}, -1)" class="px-2 font-bold hover:text-red-500">-</button>
                            <span class="text-sm font-bold w-6 text-center">${item.cantidad}</span>
                            <button onclick="modificarCantidad(${item.id}, 1)" class="px-2 font-bold hover:text-green-500">+</button>
                        </div>

                        <div class="text-right">
                            <p class="font-bold text-indigo-600 dark:text-indigo-400">$${(item.price * item.cantidad).toFixed(2)}</p>
                            <button onclick="eliminarDelCarrito(${item.id})" class="text-xs text-red-500 hover:underline mt-1">Eliminar</button>
                        </div>
                    </div>
                `).join('')}
            </div>

            <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow h-fit space-y-6">
                <h3 class="text-xl font-bold border-b pb-3">Resumen de Compra</h3>
                <div class="flex justify-between font-medium">
                    <span>Total a pagar:</span>
                    <span class="text-xl font-black text-indigo-600 dark:text-indigo-400">$${total.toFixed(2)}</span>
                </div>

                <div class="space-y-3 pt-2">
                    <p class="text-xs font-bold uppercase tracking-wider text-gray-400">Datos de Pago Simulado</p>
                    <div>
                        <label class="block text-xs mb-1 font-medium">Número de Tarjeta</label>
                        <input type="text" id="card-number" placeholder="4556 7812 3456 7890" maxlength="16" class="w-full p-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600">
                    </div>
                    <div class="grid grid-cols-2 gap-2">
                        <div>
                            <label class="block text-xs mb-1 font-medium">Expiración</label>
                            <input type="text" id="card-expiry" placeholder="12/29" maxlength="5" class="w-full p-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600">
                        </div>
                        <div>
                            <label class="block text-xs mb-1 font-medium">CVV</label>
                            <input type="password" id="card-cvv" placeholder="123" maxlength="3" class="w-full p-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600">
                        </div>
                    </div>
                </div>

                <button onclick="dispararCheckout(${total})" class="w-full bg-green-600 text-white py-3 rounded-xl font-bold shadow-md hover:bg-green-700 transition flex items-center justify-center space-x-2">
                    <i data-lucide="credit-card" class="w-5 h-5"></i>
                    <span>Confirmar Pago Simulado</span>
                </button>
            </div>
        </div>
    `;
}


function modificarCantidad(id, cambio) {
    const item = carrito.find(i => i.id === id);
    if (item) {
        item.cantidad += cambio;
        if (item.cantidad <= 0) {
            eliminarDelCarrito(id);
            return;
        }
        guardarCarritoSeguro(); 
        actualizarContadorCarrito();
        navigate('cart'); 
    }
}

function eliminarDelCarrito(id) {
    carrito = carrito.filter(i => i.id !== id);
    guardarCarritoSeguro();
    actualizarContadorCarrito();
    navigate('cart');
}


function dispararCheckout(totalMonto) {
    const num = document.getElementById('card-number').value;
    const exp = document.getElementById('card-expiry').value;
    const cvv = document.getElementById('card-cvv').value;

    if (!num || !exp || !cvv) {
        alert("Por favor, rellene los datos simulados de la tarjeta de crédito.");
        return;
    }


    const orderData = {
        id: 'ORD-' + Date.now(),
        fecha: new Date().toLocaleDateString(),
        items: carrito,
        total: totalMonto,
        estado: 'Pendiente'
    };
    procesarPago(orderData);
    carrito = [];
    actualizarContadorCarrito();
}