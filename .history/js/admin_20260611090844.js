

function renderAdminPanel() {
    const productos = getLocalData(KEYS.PRODUCTS);
    const ordenes = getLocalData(KEYS.ORDERS);
    

    const totalIngresos = ordenes.reduce((sum, o) => sum + (o.total || 0), 0);
    const totalProductos = productos.length;

    return `
        <div class="space-y-8">
            <h2 class="text-3xl font-black text-indigo-600 dark:text-indigo-400">Panel de Control Operativo</h2>
            
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow border-l-4 border-green-500">
                    <p class="text-sm text-gray-500 uppercase font-bold">Total Ingresos</p>
                    <p class="text-3xl font-black mt-1 text-green-600">$${totalIngresos.toFixed(2)}</p>
                </div>
                <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow border-l-4 border-blue-500">
                    <p class="text-sm text-gray-500 uppercase font-bold">Índice de Inventario</p>
                    <p class="text-3xl font-black mt-1">${totalProductos} Productos</p>
                </div>
                <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow border-l-4 border-purple-500">
                    <p class="text-sm text-gray-500 uppercase font-bold">Órdenes Procesadas</p>
                    <p class="text-3xl font-black mt-1">${ordenes.length}</p>
                </div>
            </div>

            <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">
                <h3 class="text-lg font-bold mb-4">Añadir Nuevo Producto al Inventario Local</h3>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input type="text" id="crud-title" placeholder="Título del producto" class="p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-sm">
                    <input type="number" id="crud-price" placeholder="Precio ($)" class="p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-sm">
                    <input type="text" id="crud-category" placeholder="Categoría" class="p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-sm">
                    <input type="text" id="crud-image" placeholder="URL de Imagen" class="p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-sm" value="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500">
                </div>
                <button onclick="crearProducto()" class="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-indigo-700">Guardar en Inventario</button>
            </div>

            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden">
                <div class="p-4 border-b border-gray-100 dark:border-gray-700">
                    <h3 class="font-bold">Listado de Existencias</h3>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse text-sm">
                        <thead class="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200">
                            <tr>
                                <th class="p-3">Imagen</th>
                                <th class="p-3">Nombre</th>
                                <th class="p-3">Categoría</th>
                                <th class="p-3">Precio</th>
                                <th class="p-3 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${productos.map(p => `
                                <tr class="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750">
                                    <td class="p-3"><img src="${p.image}" class="w-10 h-10 object-contain bg-white rounded p-0.5"></td>
                                    <td class="p-3 font-medium truncate max-w-xs">${p.title}</td>
                                    <td class="p-3 text-gray-500">${p.category}</td>
                                    <td class="p-3 font-bold text-indigo-600 dark:text-indigo-400">$${p.price}</td>
                                    <td class="p-3 text-center">
                                        <button onclick="eliminarProducto(${p.id})" class="text-red-500 hover:text-red-700 p-1 font-bold">Eliminar</button>
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

    if(!title || !price) return alert("Por favor rellena los campos principales.");

    let productos = getLocalData(KEYS.PRODUCTS);
    
    const nuevo = {
        id: Date.now(), 
        title,
        price,
        category,
        image,
        rating: { rate: 5, count: 0 }
    };

    productos.unshift(nuevo); 
    saveLocalData(KEYS.PRODUCTS, productos);
    alert("¡Producto añadido con éxito!");
    navigate('admin'); 
}


function eliminarProducto(id) {
    if(confirm("¿Estás seguro de eliminar este producto de la base de datos local?")) {
        let productos = getLocalData(KEYS.PRODUCTS);
        productos = productos.filter(p => p.id !== id);
        saveLocalData(KEYS.PRODUCTS, productos);
        navigate('admin'); 
    }
}