
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

// Buscador y filtros combinados en tiempo real
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

// Lógica básica del Carrito
function agregarAlCarrito(id) {
    const productos = getLocalData(KEYS.PRODUCTS);
    const producto = productos.find(p => p.id === id);
    
    if (producto) {
        const itemEnCarrito = carrito.find(item => item.id === id);
        if (itemEnCarrito) {
            itemEnCarrito.cantidad++;
        } else {
            carrito.push({ ...producto, cantidad: 1 });
        }
        saveLocalData(KEYS.CART, carrito);
        actualizarContadorCarrito();
        alert(`"${producto.title}" añadido al carrito.`);
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