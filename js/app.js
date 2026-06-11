
document.addEventListener("DOMContentLoaded", async () => {
    lucide.createIcons();
    await checkAndLoadAPIProducts();
    initTheme();
    
    const user = JSON.parse(sessionStorage.getItem(KEYS.CURRENT_USER));
    if (user) {
        const carritoGuardado = localStorage.getItem(`ms_cart_${user.email}`);
        carrito = carritoGuardado ? JSON.parse(carritoGuardado) : [];
    } else {
        carrito = []; 
    }
    
    actualizarContadorCarrito();
    actualizarNavbarPorSesion(); 

    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);
    updateNetworkStatus();

    if (user && user.role === 'admin') {
        navigate('admin'); 
    } else {
        navigate('landing');
    }
});

function navigate(view) {
    const main = document.getElementById('main-content');
    const user = JSON.parse(sessionStorage.getItem(KEYS.CURRENT_USER));

    if (view === 'admin' && (!user || user.role !== 'admin')) {
        alert("Acceso denegado. Se requieren permisos de Administrador.");
        navigate('landing');
        return;
    }

    switch(view) {
        case 'landing':
            main.innerHTML = renderLandingPage();
            break;
        case 'catalog':
            main.innerHTML = renderCatalogo();
            break;
        case 'cart':
            main.innerHTML = renderCarrito(); 
            break;
        case 'admin':
            main.innerHTML = renderAdminPanel();
            break;
        case 'login':
            main.innerHTML = renderLogin();
            break;
        default:
            main.innerHTML = `<h2 class="text-xl">404 - Vista no encontrada</h2>`;
    }
}
    lucide.createIcons();


function renderLandingPage() {
    
    const products = getLocalData(KEYS.PRODUCTS).slice(0, 4); 
    
    let productCards = products.map(p => `
        <div class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow hover:shadow-xl transition flex flex-col justify-between h-full">
            <div>
                <img src="${p.image}" class="h-40 mx-auto object-contain mb-4 bg-white p-2 rounded" alt="${p.title}">
                <h4 class="font-semibold text-sm line-clamp-2">${p.title}</h4>
                <p class="text-indigo-600 dark:text-indigo-400 font-black text-lg mt-2">$${p.price}</p>
            </div>
            
            <div class="mt-4">
                <button onclick="agregarAlCarrito(${p.id})" class="w-full bg-gray-900 text-white dark:bg-indigo-600 py-2 rounded-lg font-medium text-xs hover:opacity-90 flex items-center justify-center space-x-1 transition">
                    <i data-lucide="shopping-cart" class="w-3.5 h-3.5"></i> 
                    <span>Agregar al carrito</span>
                </button>
            </div>
        </div>
    `).join('');

    return `
        <section class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-3xl p-8 md:p-16 text-center mb-12 shadow-xl">
            <h1 class="text-4xl md:text-6xl font-extrabold mb-4">¡Descubre el Futuro del E-Commerce!</h1>
            <p class="text-lg md:text-xl mb-6 opacity-90">Navega, compra y gestiona incluso sin conexión a internet.</p>
            <button onclick="navigate('catalog')" class="bg-white text-indigo-600 font-bold px-8 py-3 rounded-full shadow-md hover:bg-gray-100 transition">Ver Catálogo Completo</button>
        </section>

        <section class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div class="p-6 bg-white dark:bg-gray-800 rounded-xl shadow text-center">
                <i data-lucide="zap" class="w-10 h-10 mx-auto text-yellow-500 mb-2"></i>
                <h3 class="font-bold text-lg">PWA Offline</h3>
                <p class="text-sm text-gray-500">¿Sin internet? No hay problema. Sigue comprando sin interrupciones.</p>
            </div>
            <div class="p-6 bg-white dark:bg-gray-800 rounded-xl shadow text-center">
                <i data-lucide="shield-check" class="w-10 h-10 mx-auto text-green-500 mb-2"></i>
                <h3 class="font-bold text-lg">Pagos Seguros</h3>
                <p class="text-sm text-gray-500">Pasarela simulada con encriptación local y alertas instantáneas.</p>
            </div>
            <div class="p-6 bg-white dark:bg-gray-800 rounded-xl shadow text-center">
                <i data-lucide="sliders" class="w-10 h-10 mx-auto text-blue-500 mb-2"></i>
                <h3 class="font-bold text-lg">Control Total Admin</h3>
                <p class="text-sm text-gray-500">Panel CRUD avanzado e historial dinámico de ventas.</p>
            </div>
        </section>

        <section class="mb-12">
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-2xl font-black">Productos Destacados</h3>
                <button onclick="navigate('catalog')" class="text-sm font-bold text-indigo-500 hover:underline">Ver todos &rarr;</button>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">${productCards}</div>
        </section>
    `;
}

function initTheme() {
    const toggleBtn = document.getElementById('theme-toggle');
    let currentTheme = localStorage.getItem(KEYS.THEME) || 'light';
    
    if (currentTheme === 'dark') document.documentElement.classList.add('dark');

    toggleBtn.addEventListener('click', () => {
        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem(KEYS.THEME, 'light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem(KEYS.THEME, 'dark');
        }
    });
}

function updateNetworkStatus() {
    const statusDiv = document.getElementById('connection-status');
    
    if (navigator.onLine) {
        statusDiv.className = "flex items-center space-x-2 text-sm font-medium px-3 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
        statusDiv.innerHTML = `<span class="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span><span>Modo Online</span>`;
        sincronizarPedidosPendientes();

    } else {
        statusDiv.className = "flex items-center space-x-2 text-sm font-medium px-3 py-1 rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
        statusDiv.innerHTML = `<span class="w-2.5 h-2.5 bg-red-500 rounded-full"></span><span>Modo Offline</span>`;
    }
}

function sincronizarPedidosPendientes() {
    let queue = getLocalData('ms_offline_queue');
    
    
    if (queue.length > 0) {
        let orders = getLocalData(KEYS.ORDERS);
        orders = [...orders, ...queue];
        saveLocalData(KEYS.ORDERS, orders);
        
        saveLocalData('ms_offline_queue', []);
        
        alert("🔄 ¡Conexión restablecida! Tus compras hechas en modo offline se han sincronizado con el servidor de la tienda.");
        if(typeof renderAdminHistory === 'function') {
            renderAdminHistory();
        }
    }
}