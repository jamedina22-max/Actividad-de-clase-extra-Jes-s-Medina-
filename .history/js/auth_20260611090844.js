
function renderLogin() {
    return `
        <div class="max-w-md mx-auto bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md my-10">
            <h2 class="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium mb-1">Correo Electrónico</label>
                    <input type="email" id="login-email" class="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" placeholder="user@store.com o admin@store.com">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">Contraseña</label>
                    <input type="password" id="login-pass" class="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" placeholder="user123 o admin123">
                </div>
                <button onclick="ejecutarLogin()" class="w-full bg-indigo-600 text-white py-2 rounded-lg font-bold hover:bg-indigo-700">Ingresar</button>
            </div>
            <p class="text-xs text-gray-500 mt-4 text-center">Cuentas demo de prueba en storage.js (admin@store.com / user@store.com)</p>
        </div>
    `;
}

function ejecutarLogin() {
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-pass').value;
    
    const usuarios = getLocalData(KEYS.USERS);
    const usuarioEncontrado = usuarios.find(u => u.email === email && u.pass === pass);
    
    if (usuarioEncontrado) {
        sessionStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(usuarioEncontrado));
        alert(`¡Bienvenido de nuevo, ${usuarioEncontrado.name}! Rol: ${usuarioEncontrado.role.toUpperCase()}`);
        actualizarNavbarPorSesion();
        navigate('landing');
    } else {
        alert("Credenciales incorrectas. Intenta con user@store.com y user123");
    }
}

function actualizarNavbarPorSesion() {
    const user = JSON.parse(sessionStorage.getItem(KEYS.CURRENT_USER));
    const authZone = document.getElementById('auth-zone');
    const btnAdmin = document.getElementById('btn-admin-panel');
    
    if (user) {
        if (user.role === 'admin') {
            btnAdmin.classList.remove('hidden');
        } else {
            btnAdmin.classList.add('hidden');
        }
        
        authZone.innerHTML = `
            <div class="flex items-center space-x-3">
                <img src="${user.avatar || 'https://i.pravatar.cc/40'}" class="w-8 h-8 rounded-full border border-indigo-500" alt="Avatar">
                <span class="text-sm font-medium hidden sm:inline">${user.name}</span>
                <button onclick="ejecutarLogout()" class="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded hover:bg-red-500 hover:text-white">Salir</button>
            </div>
        `;
    } else {
        btnAdmin.classList.add('hidden');
        authZone.innerHTML = `<button onclick="navigate('login')" class="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-indigo-700">Ingresar</button>`;
    }
}

function ejecutarLogout() {
    sessionStorage.removeItem(KEYS.CURRENT_USER);
    actualizarNavbarPorSesion();
    alert("Sesión cerrada.");
    navigate('landing');
}