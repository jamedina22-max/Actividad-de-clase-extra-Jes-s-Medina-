
let vistaActualAuth = 'login'; 

function renderLogin() {
    if (vistaActualAuth === 'login') {
        return `
            <div class="max-w-md mx-auto bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl my-10 border border-gray-100 dark:border-gray-700">
                <h2 class="text-2xl font-black mb-6 text-center">Iniciar Sesión</h2>
                <div class="space-y-4">
                    <div>
                        <label class="block text-xs font-bold uppercase text-gray-400 mb-1">Correo Electrónico</label>
                        <input type="email" id="login-email" class="w-full p-2.5 border rounded-xl dark:bg-gray-700 dark:border-gray-600" placeholder="user@store.com">
                    </div>
                    <div>
                        <label class="block text-xs font-bold uppercase text-gray-400 mb-1">Contraseña</label>
                        <input type="password" id="login-pass" class="w-full p-2.5 border rounded-xl dark:bg-gray-700 dark:border-gray-600" placeholder="••••••••">
                    </div>
                    <button onclick="ejecutarLogin()" class="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-md">Ingresar</button>
                </div>
                
                <div class="mt-6 flex flex-col items-center space-y-2 text-sm">
                    <button onclick="cambiarPestañaAuth('register')" class="text-indigo-500 hover:underline">¿No tienes cuenta? Regístrate aquí</button>
                    <button onclick="cambiarPestañaAuth('recover')" class="text-gray-400 hover:underline text-xs">¿Olvidaste tu contraseña?</button>
                </div>
            </div>
        `;
    } 
    
    if (vistaActualAuth === 'register') {
        return `
            <div class="max-w-md mx-auto bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl my-10 border border-gray-100 dark:border-gray-700">
                <h2 class="text-2xl font-black mb-6 text-center">Crear una Cuenta</h2>
                <div class="space-y-4">
                    <div>
                        <label class="block text-xs font-bold uppercase text-gray-400 mb-1">Nombre Completo</label>
                        <input type="text" id="reg-name" class="w-full p-2.5 border rounded-xl dark:bg-gray-700 dark:border-gray-600" placeholder="Ej. Ana Gómez">
                    </div>
                    <div>
                        <label class="block text-xs font-bold uppercase text-gray-400 mb-1">Correo Electrónico</label>
                        <input type="email" id="reg-email" class="w-full p-2.5 border rounded-xl dark:bg-gray-700 dark:border-gray-600" placeholder="ana@ejemplo.com">
                    </div>
                    <div>
                        <label class="block text-xs font-bold uppercase text-gray-400 mb-1">Contraseña</label>
                        <input type="password" id="reg-pass" class="w-full p-2.5 border rounded-xl dark:bg-gray-700 dark:border-gray-600" placeholder="Crea una contraseña segura">
                    </div>
                    <div>
                        <label class="block text-xs font-bold uppercase text-gray-400 mb-1">Dirección de Envío</label>
                        <input type="text" id="reg-address" class="w-full p-2.5 border rounded-xl dark:bg-gray-700 dark:border-gray-600" placeholder="Calle, Número, Ciudad">
                    </div>
                    <button onclick="ejecutarRegistro()" class="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition shadow-md">Registrarme</button>
                </div>
                
                <div class="mt-6 text-center text-sm">
                    <button onclick="cambiarPestañaAuth('login')" class="text-indigo-500 hover:underline">¿Ya tienes cuenta? Inicia sesión</button>
                </div>
            </div>
        `;
    }

    if (vistaActualAuth === 'recover') {
        return `
            <div class="max-w-md mx-auto bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl my-10 border border-gray-100 dark:border-gray-700">
                <h2 class="text-2xl font-black mb-4 text-center">Recuperar Contraseña</h2>
                <p class="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">Introduce tu correo electrónico y te mostraremos tu contraseña simulada del LocalStorage.</p>
                <div class="space-y-4">
                    <div>
                        <label class="block text-xs font-bold uppercase text-gray-400 mb-1">Correo Electrónico</label>
                        <input type="email" id="recover-email" class="w-full p-2.5 border rounded-xl dark:bg-gray-700 dark:border-gray-600" placeholder="ana@ejemplo.com">
                    </div>
                    <button onclick="ejecutarRecuperacion()" class="w-full bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 transition shadow-md">Buscar Credenciales</button>
                </div>
                
                <div class="mt-6 text-center text-sm">
                    <button onclick="cambiarPestañaAuth('login')" class="text-indigo-500 hover:underline">Volver al Login</button>
                </div>
            </div>
        `;
    }
}


function cambiarPestañaAuth(nuevaPestaña) {
    vistaActualAuth = nuevaPestaña;
    navigate('login');
}

function ejecutarRegistro() {
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const pass = document.getElementById('reg-pass').value;
    const address = document.getElementById('reg-address').value;

    if (!name || !email || !pass || !address) {
        alert("Por favor rellene todos los campos para el registro.");
        return;
    }

    let usuarios = getLocalData(KEYS.USERS);
    

    if (usuarios.some(u => u.email === email)) {
        alert("Este correo ya está registrado en el sistema.");
        return;
    }

    
    const nuevoUsuario = {
        email,
        pass,
        name,
        role: 'client', // Todo registro por defecto es rol Cliente
        avatar: `https://i.pravatar.cc/150?u=${email}`, 
        address
    };

    usuarios.push(nuevoUsuario);
    saveLocalData(KEYS.USERS, usuarios);
    
    alert("¡Registro completado con éxito! Ya puedes iniciar sesión.");
    cambiarPestañaAuth('login');
}


function ejecutarRecuperacion() {
    const email = document.getElementById('recover-email').value;
    const usuarios = getLocalData(KEYS.USERS);
    const usuario = usuarios.find(u => u.email === email);

    if (usuario) {
        alert(`🔒 [Simulación de Recuperación]\nPara el usuario: ${usuario.name}\nSu contraseña guardada es: ${usuario.pass}`);
        cambiarPestañaAuth('login');
    } else {
        alert("No se encontró ningún usuario con ese correo electrónico.");
    }
}

function ejecutarLogin() {
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-pass').value;
    
    const usuarios = getLocalData(KEYS.USERS);
    const usuarioEncontrado = usuarios.find(u => u.email === email && u.pass === pass);
    
    if (usuarioEncontrado) {
        sessionStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(usuarioEncontrado));
        
        
        const carritoGuardado = localStorage.getItem(`ms_cart_${usuarioEncontrado.email}`);
        carrito = carritoGuardado ? JSON.parse(carritoGuardado) : [];
        

        saveLocalData(KEYS.CART, carrito); 
        actualizarContadorCarrito();

        alert(`¡Bienvenido de nuevo, ${usuarioEncontrado.name}!`);
        actualizarNavbarPorSesion();
        navigate('landing');
    } else {
        alert("Credenciales incorrectas. Revisa los datos.");
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
            <div class="flex items-center space-x-2 sm:space-x-3">
                <img src="${user.avatar}" class="w-8 h-8 rounded-full border border-indigo-500 object-cover" alt="Avatar">
                <span class="text-xs font-bold hidden sm:inline truncate max-w-[100px]">${user.name}</span>
                <button onclick="ejecutarLogout()" class="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-lg hover:bg-red-500 hover:text-white transition">Salir</button>
            </div>
        `;
    } else {
        btnAdmin.classList.add('hidden');
        authZone.innerHTML = `<button onclick="navigate('login')" class="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition">Ingresar</button>`;
    }
}

function ejecutarLogout() {
    const user = JSON.parse(sessionStorage.getItem(KEYS.CURRENT_USER));
    
    if (user) {
        localStorage.setItem(`ms_cart_${user.email}`, JSON.stringify(carrito));
    }
    carrito = [];
    saveLocalData(KEYS.CART, []);
    actualizarContadorCarrito();
    sessionStorage.removeItem(KEYS.CURRENT_USER);
    actualizarNavbarPorSesion();
    
    alert("Sesión finalizada. Carrito resguardado.");
    navigate('landing');
}