

function renderAdminPanel() {
    const productos = getLocalData(KEYS.PRODUCTS);
    const ordenes = getLocalData(KEYS.ORDERS);
    
    const totalIngresos = ordenes.reduce((sum, o) => sum + (o.total || 0), 0);
    const totalProductos = productos.length;

    return `
        <div class="space-y-8 animate-fade-in">
            <div class="flex justify-between items-center border-b pb-4 border-gray-200 dark:border-gray-700">
                <h2 class="text-3xl font-black text-red-500 dark:text-red-400">Panel de Control (Modo Administrador)</h2>
                <span class="bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full uppercase">Acceso Autorizado</span>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow border-l-4 border-green-500">
                    <p class="text-xs text-gray-500 uppercase font-bold tracking-wider">Total Ingresos Generados</p>
                    <p class="text-3xl font-black mt-1 text-green-600 dark:text-green-400">$${totalIngresos.toFixed(2)}</p>
                </div>
                <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow border-l-4 border-blue-500">
                    <p class="text-xs text-gray-500 uppercase font-bold tracking-wider">Productos en Inventario</p>
                    <p class="text-3xl font-black mt-1 text-blue-600 dark:text-blue-400">${totalProductos}</p>
                </div>
                <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow border-l-4 border-purple-500">
                    <p class="text-xs text-gray-500 uppercase font-bold tracking-wider">Órdenes de Compra</p>
                    <p class="text-3xl font-black mt-1 text-purple-600 dark:text-purple-400">${ordenes.length}</p>
                </div>
            </div>

            <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow border border-gray-100 dark:border-gray-700">
                <h3 class="text-lg font-bold mb-4 flex items-center gap-2">
                    <i data-lucide="plus-circle" class="w-5 h-5 text-indigo-500"></i> Registrar Nuevo Producto
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label class="block text-xs font-semibold text-gray-400 mb-1">Nombre/Título</label>
                        <input type="text" id="crud-title" placeholder="Ej. Smartwatch Pro" class="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-sm">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-gray-400 mb-1">Precio ($)</label>
                        <input type="number" id="crud-price" placeholder="0.00" step="0.01" class="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-sm">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-gray-400 mb-1">Categoría</label>
                        <select id="crud-category" class="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-sm">
                            <option value="electronics">electronics</option>
                            <option value="jewelery">jewelery</option>
                            <option value="men's clothing">men's clothing</option>
                            <option value="women's clothing">women's clothing</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-gray-400 mb-1">URL de la Imagen</label>
                        <input type="text" id="crud-image" class="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-sm" value="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500">
                    </div>
                </div>
                <button onclick="crearProducto()" class="mt-4 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 transition flex items-center gap-2 shadow">
                    <span>Guardar en Inventario</span>
                </button>
            </div>

            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden border border-gray-100 dark:border-gray-700">
                <div class="p-4 bg-gray-50 dark:bg-gray-750 border-b border-gray-100 dark:border-gray-700">
                    <h3 class="font-bold text-gray-700 dark:text-gray-200">Inventario de Productos Locales</h3>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse text-sm">
                        <thead class="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 font-semibold">
                            <tr>
                                <th class="p-4">Imagen</th>
                                <th class="p-4">Producto</th>
                                <th class="p-4">Categoría</th>
                                <th class="p-4">Precio</th>
                                <th class="p-4 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
                            ${productos.map(p => `
                                <tr class="hover:bg-gray-50 dark:hover:bg-gray-750 transition">
                                    <td class="p-4"><img src="${p.image}" class="w-12 h-12 object-contain bg-white rounded p-1 border"></td>
                                    <td class="p-4 font-bold text-gray-900 dark:text-white truncate max-w-xs">${p.title}</td>
                                    <td class="p-4"><span class="text-xs bg-gray-100 dark:bg-gray-700 px-2.5 py-1 rounded-md font-medium text-gray-600 dark:text-gray-300">${p.category}</span></td>
                                    <td class="p-4 font-extrabold text-indigo-600 dark:text-indigo-400">$${p.price}</td>
                                    <td class="p-4 text-center">
                                        <button onclick="eliminarProducto(${p.id})" class="bg-red-50 hover:bg-red-100 text-red-600 dark:text-red-400 dark:hover:bg-red-900/30 px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 mx-auto">
                                            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i> Eliminar
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

function crearProducto() {
    const title = document.getElementById('crud-title').value;
    const price = parseFloat(document.getElementById('crud-price').value);
    const category = document.getElementById('crud-category').value;
    const image = document.getElementById('crud-image').value;

    if (!title || isNaN(price) || price <= 0) {
        alert("Por favor ingrese un título válido y un precio mayor a 0.");
        return;
    }

    let productos = getLocalData(KEYS.PRODUCTS);
    
    const nuevoProducto = {
        id: Date.now(), 
        title,
        price,
        category,
        image,
        rating: { rate: 5, count: 0 }
    };

    productos.unshift(nuevoProducto); 
    saveLocalData(KEYS.PRODUCTS, productos);
    
    alert(`🎉 ¡"${title}" ha sido creado e integrado con éxito al inventario local!`);
    navigate('admin'); 
}

// LÓGICA DEL CRUD: ELIMINAR (DELETE)
function eliminarProducto(id) {
    if (confirm("¿Está seguro de que desea eliminar permanentemente este producto del catálogo local?")) {
        let productos = getLocalData(KEYS.PRODUCTS);
        productos = productos.filter(p => p.id !== id);
        saveLocalData(KEYS.PRODUCTS, productos);
        
        alert("Producto eliminado correctamente.");
        navigate('admin'); 
    }
}